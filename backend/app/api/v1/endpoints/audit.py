# Future annotations disabled - causes Pydantic ForwardRef issues

from typing import Any, List, Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db.session import get_db
from app.db.models import AuditLog, User

router = APIRouter()


class AuditLogResponse(BaseModel):
    id: int
    actor_id: Optional[str] = None
    action: str
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)


@router.get("/logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
) -> Any:
    """
    Retrieve audit logs.
    Returns paginated list of audit logs ordered by timestamp descending.
    """
    result = await db.execute(
        select(AuditLog)
        .order_by(desc(AuditLog.timestamp))
        .limit(limit)
        .offset(offset)
    )
    logs = result.scalars().all()
    
    return [
        AuditLogResponse(
            id=log.id,
            actor_id=str(log.actor_id) if log.actor_id else None,
            action=log.action,
            resource_id=str(log.resource_id) if log.resource_id else None,
            ip_address=log.ip_address,
            timestamp=log.timestamp,
        )
        for log in logs
    ]


@router.get("/logs/{log_id}", response_model=AuditLogResponse)
async def get_audit_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Retrieve a single audit log by ID.
    """
    result = await db.execute(
        select(AuditLog).where(AuditLog.id == log_id)
    )
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    
    return AuditLogResponse(
        id=log.id,
        actor_id=str(log.actor_id) if log.actor_id else None,
        action=log.action,
        resource_id=str(log.resource_id) if log.resource_id else None,
        ip_address=log.ip_address,
        timestamp=log.timestamp,
    )
