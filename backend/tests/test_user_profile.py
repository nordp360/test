
import pytest
from sqlalchemy import select
from httpx import AsyncClient
from app.db.models import User, UserProfile

@pytest.mark.asyncio
async def test_profile_created_and_deleted_with_user(client: AsyncClient, db_session, auth_headers):
    # 1. Pobierz dane aktualnego użytkownika
    me_res = await client.get("/api/v1/users/me", headers=auth_headers)
    assert me_res.status_code == 200
    user_data = me_res.json()
    user_id = user_data["id"]

    # 2. Dodaj profil (jeśli nie istnieje lub zaktualizuj) przez PATCH /me
    # Upewnijmy się, że dane są poprawne (PESEL 11 cyfr)
    update_res = await client.patch(
        "/api/v1/users/me", 
        json={"pesel": "12345678901"}, 
        headers=auth_headers
    )
    assert update_res.status_code == 200

    # 3. Usuń użytkownika bezpośrednio w DB (simulating account deletion)
    # Musimy użyć UUID w zapytaniu
    import uuid
    if isinstance(user_id, str):
        user_uuid = uuid.UUID(user_id)
    else:
        user_uuid = user_id
        
    result = await db_session.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one()
    await db_session.delete(user)
    await db_session.commit()

    # 4. Sprawdź czy profil również zniknął (Cascade Delete)
    # UserProfile ma (user_id) jako Foreign Key z ondelete="CASCADE"
    profile_result = await db_session.execute(select(UserProfile).where(UserProfile.user_id == user_uuid))
    assert profile_result.scalar_one_or_none() is None
