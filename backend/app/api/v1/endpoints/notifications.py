from datetime import datetime
from typing import Any, List
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db.models import Notification, User

router = APIRouter()

@router.get("/", response_model=List[dict])
async def read_notifications(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve notifications.
    """
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    notifications = result.scalars().all()
    # Simple dict return for now as schema is likely simple or missing
    return [{"id": str(n.id), "message": n.message, "is_read": n.is_read, "created_at": n.created_at} for n in notifications]
