from __future__ import annotations

import uuid

from typing import Optional
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    pesel: Optional[str] = None
    address: Optional[str] = None


class UserProfileUpdate(UserProfileBase):
    pass


class UserInDBBase(UserBase):
    id: uuid.UUID
    role: str
    kyc_status: str

    class Config:
        from_attributes = True


class UserProfileResponse(UserProfileBase):
    user_id: uuid.UUID
    
    class Config:
        from_attributes = True


class User(UserInDBBase):
    is_active: bool = True
    profile: Optional[UserProfileResponse] = None


class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
