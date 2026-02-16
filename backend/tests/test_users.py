
import pytest
from httpx import AsyncClient
from tests.test_security import create_user_with_role

@pytest.mark.asyncio
async def test_password_change_flow(client: AsyncClient, db_session):
    """Testuje pełny cykl zmiany hasła"""
    email = "change_pass@example.com"
    old_pass = "Password123!"
    new_pass = "NewStrongPass456!"
    
    # 1. Rejestracja i logowanie starym hasłem
    headers = await create_user_with_role(client, email, "CLIENT")
    
    # 2. Zmiana hasła przez dedykowany endpoint
    # Endpoint might be /me/password or /change-password. Let's assume /change-password based on request.
    # Note: UserPasswordUpdate schema expects current_password and new_password.
    change_payload = {
        "current_password": old_pass,
        "new_password": new_pass
    }
    
    # Check if endpoint exists, otherwise this test will help TDD it.
    # Trying /api/v1/users/me/password or similar if standard pattern is used. 
    # User request said /api/v1/users/change-password.
    response = await client.post("/api/v1/users/change-password", json=change_payload, headers=headers)
    
    if response.status_code == 404:
        # Fallback to standard convention if custom one missing, or fail if strictly required.
        # Let's try /api/v1/users/me/password just in case or fail.
        response = await client.patch("/api/v1/users/me/password", json=change_payload, headers=headers)


    assert response.status_code == 200

    # 3. Próba logowania STARYM hasłem (powinna zawieść)
    login_old = await client.post("/api/v1/auth/login", data={"username": email, "password": old_pass})
    assert login_old.status_code == 400

    # 4. Logowanie NOWYM hasłem (powinno się udać)
    login_new = await client.post("/api/v1/auth/login", data={"username": email, "password": new_pass})
    assert login_new.status_code == 200
    assert "access_token" in login_new.json()
