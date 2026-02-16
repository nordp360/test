from __future__ import annotations

import uuid
from typing import Any, List

import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.db.models import Case, User, Document
from app.schemas.case import Case as CaseSchema, CaseCreate, CaseUpdate
from app.schemas.document import Document as DocumentSchema
from app.core.encryption import encryption_service

UPLOAD_DIR = "uploads"

router = APIRouter()


@router.get("/", response_model=List[CaseSchema])
async def read_cases(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve cases.
    """
    if current_user.role == "ADMIN":
        result = await db.execute(
            select(Case)
            .options(selectinload(Case.documents))
            .offset(skip)
            .limit(limit)
        )
    else:
        result = await db.execute(
            select(Case)
            .where(Case.user_id == current_user.id)
            .options(selectinload(Case.documents))
            .offset(skip)
            .limit(limit)
        )
    cases = result.scalars().all()
    
    # Decrypt descriptions for the response
    for case in cases:
        if case.description_enc:
            case.description = encryption_service.decrypt(case.description_enc)
    
    return cases


@router.post("/", response_model=CaseSchema)
async def create_case(
    *,
    db: AsyncSession = Depends(deps.get_db),
    case_in: CaseCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new case.
    """
    case = Case(
        title=case_in.title,
        description_enc=encryption_service.encrypt(case_in.description) if case_in.description else None,
        user_id=current_user.id,
    )
    db.add(case)
    await db.commit()
    await db.refresh(case)
    
    # case.documents = []  # Initialize documents to avoid lazy load error
    # Instead of returning the ORM object which might trigger lazy loading, 
    # we can explictly return a dict or ensure Pydantic handling.
    # Or simpler:
    case_dict = {
        "id": case.id,
        "title": case.title,
        "description": case_in.description,
        "user_id": case.user_id,
        "status": case.status,
        "created_at": case.created_at,
        "documents": []
    }
    return case_dict


@router.get("/{id}", response_model=CaseSchema)
async def read_case(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get case by ID.
    """
    result = await db.execute(
        select(Case)
        .options(selectinload(Case.documents))
        .where(Case.id == id)
    )
    case = result.scalar_one_or_none()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.role != "ADMIN" and case.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    if case.description_enc:
        case.description = encryption_service.decrypt(case.description_enc)
        
    return case


@router.post("/{id}/documents", response_model=DocumentSchema)
async def upload_document(
    id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload a document to a case.
    """
    # Verify case access
    result = await db.execute(select(Case).where(Case.id == id))
    case = result.scalar_one_or_none()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.role != "ADMIN" and case.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Save file
    file_location = f"{UPLOAD_DIR}/{id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Create DB record
    document = Document(
        case_id=id,
        filename=file.filename,
        file_path=file_location,
        content_type=file.content_type or "application/octet-stream"
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    
    return document
