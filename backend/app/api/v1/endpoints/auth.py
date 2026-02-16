# No __future__ annotations - let Pydantic resolve types normally

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.db.models import User
from app.schemas.user import Token, UserCreate, UserResponse as UserSchema, ForgotPassword
from app.services.audit import create_audit_log

router = APIRouter()

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)


@router.post("/register", response_model=UserSchema)
@limiter.limit("3/minute")
async def register(
    user_in: UserCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create new user.
    """
    print(f"DEBUG REGISTER: {user_in}")
    email = user_in.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    try:
        password_hash = security.get_password_hash(user_in.password)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    user = User(
        email=email,
        password_hash=password_hash,
    )
    db.add(user)
    await db.commit()
    
    # Create empty profile
    from app.db.models import UserProfile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    await db.commit()
    
    # Re-fetch with profile eagerly loaded
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile))
        .where(User.id == user.id)
    )
    user = result.scalar_one()
    
    # Audit log
    await create_audit_log(
        db=db,
        action="user_registered",
        actor_id=user.id,
        ip_address=request.client.host if request.client else None,
    )
    
    return user


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    email = form_data.username.lower()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    
    # Audit log
    await create_audit_log(
        db=db,
        action="user_login",
        actor_id=user.id,
        ip_address=request.client.host if request.client else None,
    )
    
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
@router.post("/forgot-password")
async def forgot_password(
    forgot_in: ForgotPassword,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Simulate forgot password email recovery flow.
    In a real app, this would generate a reset token and send an email.
    """
    result = await db.execute(select(User).where(User.email == forgot_in.email))
    user = result.scalar_one_or_none()
    
    if user:
        # In a real app, send email with token here
        pass
    
    # Always return 200 to prevent email enumeration
    return {"message": "If this email is registered, a recovery link has been sent."}
