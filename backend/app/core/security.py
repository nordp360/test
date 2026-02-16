from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional, Union

from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Argon2id configuration with production-grade security parameters
# Memory cost: 64 MB (65536 KiB) - resistant to GPU/ASIC attacks
# Time cost: 3 iterations - balance between security and performance
# Parallelism: 4 threads - utilizes modern multi-core CPUs
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__memory_cost=65536,  # 64 MB
    argon2__time_cost=3,        # 3 iterations
    argon2__parallelism=4,      # 4 threads
    argon2__type="id"           # Argon2id (hybrid mode - best for password hashing)
)


def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.algorithm)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)