from typing import Any, List
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.api import deps
from app.db.models import Message, User
from app.core.encryption import encryption_service

router = APIRouter()

@router.get("/", response_model=List[dict])
async def read_messages(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve messages.
    """
    result = await db.execute(
        select(Message)
        .where(
            or_(
                Message.sender_id == current_user.id,
                Message.recipient_id == current_user.id
            )
        )
        .offset(skip)
        .limit(limit)
    )
    messages = result.scalars().all()
    
    return [
        {
            "id": str(m.id),
            "content": encryption_service.decrypt(m.content_enc) if m.content_enc else "",
            "sender_id": str(m.sender_id),
            "recipient_id": str(m.recipient_id),
            "created_at": m.created_at,
            "is_read": m.is_read
        }
        for m in messages
    ]

@router.post("/send")
async def send_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    recipient_id: str,
    content: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Send new message.
    """
    msg = Message(
        sender_id=current_user.id,
        recipient_id=uuid.UUID(recipient_id),
        content_enc=encryption_service.encrypt(content)
    )
    db.add(msg)
    await db.commit()
    return {"message": "Message sent"}
