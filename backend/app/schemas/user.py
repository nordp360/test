from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
import re
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "client"  # client, lawyer, admin

class UserCreate(UserBase):
    password: str = Field(
        ..., 
        min_length=8, 
        description="Password must be at least 8 characters with uppercase, lowercase, digit, and special character"
    )
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """
        Validate password complexity:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = Field(None, description="International phone number in E.164 format (e.g., +48123456789)")
    pesel: Optional[str] = Field(None, description="Polish PESEL number (11 digits)")
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """
        Validate international phone number in E.164 format
        Format: +[country code][number] (e.g., +48123456789)
        """
        if v is None:
            return v
        # E.164 format: + followed by 1-15 digits
        if not re.match(r'^\+[1-9]\d{1,14}$', v):
            raise ValueError('Phone number must be in international E.164 format (e.g., +48123456789)')
        return v
    
    @field_validator('pesel')
    @classmethod
    def validate_pesel(cls, v: Optional[str]) -> Optional[str]:
        """
        Validate Polish PESEL number (11 digits)
        """
        if v is None:
            return v
        if not re.match(r'^\d{11}$', v):
            raise ValueError('PESEL must be exactly 11 digits')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: Optional[str]) -> Optional[str]:
        """
        Validate password complexity if provided
        """
        if v is None:
            return v
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    pesel: Optional[str] = None
    address: Optional[str] = None

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    user_id: uuid.UUID
    
    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool = True
    profile: Optional[UserProfileResponse] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user_role: Optional[str] = None
    user_name: Optional[str] = None

class TokenData(BaseModel):
    id: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(
        ..., 
        min_length=8,
        description="New password must be at least 8 characters with uppercase, lowercase, digit, and special character"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class ForgotPassword(BaseModel):
    email: EmailStr
