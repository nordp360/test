from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import User, UserProfile
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/run")
async def seed_data(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Seed database with initial data.
    """
    
    users_to_create = [
        {
            "email": "admin@lexportal.pl",
            "password": "admin123",
            "role": "admin",
            "full_name": "Admin User",
            "is_superuser": True
        },
        {
            "email": "anna.nowak@lexportal.pl",
            "password": "lawyer123",
            "role": "lawyer",
            "full_name": "Anna Nowak"
        },
        {
            "email": "jan.kowalski@example.com",
            "password": "password123",
            "role": "client",
            "full_name": "Jan Kowalski"
        },
    ]

    created_users = []
    for user_data in users_to_create:
        result = await db.execute(select(User).where(User.email == user_data["email"]))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            continue

        hashed_password = get_password_hash(user_data["password"])
        new_user = User(
            email=user_data["email"],
            password_hash=hashed_password,
            role=user_data["role"],
            full_name=user_data["full_name"],
            is_active=True,
            is_superuser=user_data.get("is_superuser", False)
        )
        db.add(new_user)
        await db.flush() # Flush to get the new_user.id for the profile

        profile = UserProfile(user_id=new_user.id)
        db.add(profile)
        
        created_users.append(user_data['email'])

    if created_users:
        await db.commit()
        return {"message": "Database seeded successfully", "created_users": created_users}
    
    return {"message": "Database already seeded"}

