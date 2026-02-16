import pytest
import uuid
from httpx import AsyncClient
from sqlalchemy import select
from app.db.models import User

@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient, db_session):
    email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "email": email,
        "password": "Password123!",
        "full_name": "Test User"
    }
    
    response = await client.post("/api/v1/auth/register", json=payload)
    
    # Check status (using 200 as per previous observations of this specific backend)
    assert response.status_code == 200 
    
    data = response.json()
    assert data["email"] == email
    
    # Security: Password should NOT be in the response
    assert "password" not in data
    assert "password_hash" not in data
    
    # DB Verification: Check if user exists in database
    result = await db_session.execute(select(User).where(User.email == email))
    user_in_db = result.scalar_one_or_none()
    assert user_in_db is not None
    assert user_in_db.email == email

@pytest.mark.asyncio
async def test_register_user_duplicate_email(client: AsyncClient, test_user):
    payload = {
        "email": test_user.email,
        "password": "AnotherPassword123!",
        "full_name": "Duplicate User"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    # Should be 400 as seen in auth.py:41
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

@pytest.mark.asyncio
async def test_register_user_invalid_email(client: AsyncClient):
    payload = {
        "email": "invalid-email",
        "password": "Password123!",
        "full_name": "Invalid User"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    # FastAPI/Pydantic returns 422 for validation errors
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_register_user_role_protection(client: AsyncClient, db_session):
    email = f"attacker_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "email": email,
        "password": "Password123!",
        "full_name": "Attacker",
        "role": "ADMIN" # Attempting to escalate role
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 200
    
    # Verify in DB that role is STILL 'CLIENT' (or default)
    result = await db_session.execute(select(User).where(User.email == email))
    user_in_db = result.scalar_one()
    # Looking at auth.py, it doesn't even read 'role' from UserCreate, so it should stay default
    assert user_in_db.role != "ADMIN"

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.email,
            "password": "Password123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.email,
            "password": "WrongPassword123!"
        }
    )
    assert response.status_code == 400 # Per auth.py:90

@pytest.mark.asyncio
async def test_get_current_user_me(client: AsyncClient, auth_headers, test_user):
    response = await client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email

# --- Advanced Security & Boundary Tests ---

@pytest.mark.asyncio
async def test_protected_route_no_token(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

@pytest.mark.asyncio
async def test_protected_route_malformed_token(client: AsyncClient):
    headers = {"Authorization": "Bearer not-a-valid-token"}
    response = await client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 403 # jose.jwt.decode failure usually returns 403

@pytest.mark.asyncio
async def test_register_schema_boundary_long_strings(client: AsyncClient):
    long_email = "a" * 250 + "@example.com"
    payload = {
        "email": long_email,
        "password": "Password123!",
        "full_name": "Long Name " * 50
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    # Backend should handle or reject. If 422, it's Pydantic. If 500, it's DB overflow.
    # Standard Pydantic usually allows 255 for strings unless limited.
    assert response.status_code in [200, 422]

@pytest.mark.asyncio
async def test_register_schema_boundary_empty_fields(client: AsyncClient):
    payload = {
        "email": "",
        "password": "",
        "full_name": ""
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_email_normalization(client: AsyncClient):
    email_mixed = f"Test_{uuid.uuid4().hex[:6]}@Example.com"
    email_lower = email_mixed.lower()
    
    # Register with mixed case
    await client.post("/api/v1/auth/register", json={
        "email": email_mixed,
        "password": "Password123!",
        "full_name": "Mixed Case"
    })
    
    # Login with lower case
    response = await client.post("/api/v1/auth/login", data={
        "username": email_lower,
        "password": "Password123!"
    })
    # If the backend normalizes, this should be 200
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_register_password_strength_fail(client: AsyncClient):
    """Testuje, czy słabe hasło zostanie odrzucone (brak cyfry/znaku specjalnego)"""
    payload = {
        "email": "weak@example.com",
        "password": "onlyletters", # Zbyt słabe
        "full_name": "Weak User"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422 # Pydantic rzuci błędem walidacji
    # Check detail message. It might be complex json.
    # Pydantic v2 returns list of errors.
    assert "Password" in response.text
