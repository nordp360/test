import pytest
from httpx import AsyncClient
import uuid

@pytest.mark.asyncio
async def test_create_case_success(client: AsyncClient, auth_headers):
    response = await client.post(
        "/api/v1/cases/",
        json={
            "title": "New Case",
            "description": "Case description"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Case"
    assert "id" in data

@pytest.mark.asyncio
async def test_list_owner_cases(client: AsyncClient, auth_headers):
    # Create two cases
    await client.post("/api/v1/cases/", json={"title": "C1", "description": "D1"}, headers=auth_headers)
    await client.post("/api/v1/cases/", json={"title": "C2", "description": "D2"}, headers=auth_headers)
    
    response = await client.get("/api/v1/cases/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    # At least the 2 we just created
    assert len(data) >= 2

@pytest.mark.asyncio
async def test_case_isolation(client: AsyncClient, auth_headers, test_user):
    # This user (from auth_headers) creates a case
    create_resp = await client.post(
        "/api/v1/cases/",
        json={"title": "Private Case", "description": "Confidential"},
        headers=auth_headers
    )
    case_id = create_resp.json()["id"]
    
    # Another user tries to access it
    from app.core.security import create_access_token
    other_token = create_access_token(subject=str(test_user.id))
    other_headers = {"Authorization": f"Bearer {other_token}"}
    
    response = await client.get(f"/api/v1/cases/{case_id}", headers=other_headers)
    # Based on cases.py:102, it returns 400 for "Not enough permissions"
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_get_case_not_found(client: AsyncClient, auth_headers):
    random_id = uuid.uuid4()
    response = await client.get(f"/api/v1/cases/{random_id}", headers=auth_headers)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_read_cases_pagination(client: AsyncClient, auth_headers):
    # Create multiple cases first
    for i in range(3):
        await client.post(
            "/api/v1/cases/",
            json={"title": f"Case {i}", "description": "Pagination test"},
            headers=auth_headers
        )
    
    response = await client.get("/api/v1/cases/?skip=0&limit=2", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 2
