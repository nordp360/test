from __future__ import annotations

from typing import Optional
from datetime import datetime
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import AuditLog


async def create_audit_log(
    db: AsyncSession,
    action: str,
    actor_id: Optional[uuid.UUID] = None,
    resource_id: Optional[uuid.UUID] = None,
    ip_address: Optional[str] = None,
) -> AuditLog:
    """
    Create a new audit log entry.
    
    Args:
        db: Database session
        action: Action performed (e.g., "user_login", "case_created")
        actor_id: ID of user who performed the action
        resource_id: ID of affected resource
        ip_address: IP address of the client
    """
    audit_log = AuditLog(
        actor_id=actor_id,
        action=action,
        details={"resource_id": str(resource_id)} if resource_id else None,
        ip_address=ip_address,
        timestamp=datetime.utcnow(),
    )
    db.add(audit_log)
    await db.commit()
    await db.refresh(audit_log)
    return audit_log
