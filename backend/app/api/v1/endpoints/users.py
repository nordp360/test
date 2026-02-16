from __future__ import annotations

from typing import Any
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.db.models import User, UserProfile
from app.schemas.user import UserResponse as UserSchema, UserProfileUpdate, UserPasswordUpdate
from app.core import security

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.patch("/me", response_model=UserSchema)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    profile_in: UserProfileUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update own profile.
    """
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    
    if profile_in.first_name is not None:
        profile.first_name_enc = profile_in.first_name # In real app, encrypt this
    if profile_in.last_name is not None:
        profile.last_name_enc = profile_in.last_name
    if profile_in.pesel is not None:
        profile.pesel_enc = profile_in.pesel
    if profile_in.address is not None:
        profile.address_enc = profile_in.address
        
    await db.commit()
    
    # Re-fetch with profile eagerly loaded
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile))
        .where(User.id == current_user.id)
    )
    return result.scalar_one()


@router.post("/change-password")
async def change_password(
    *,
    db: AsyncSession = Depends(deps.get_db),
    password_in: UserPasswordUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Change user password.
    """
    if not security.verify_password(password_in.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Incorrect current password",
        )
    
    current_user.password_hash = security.get_password_hash(password_in.new_password)
    db.add(current_user)
    await db.commit()
    
    return {"message": "Password updated successfully"}
