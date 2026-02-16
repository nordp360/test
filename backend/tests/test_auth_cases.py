
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_user_cannot_access_others_case(client: AsyncClient, auth_headers, other_auth_headers):
    # 1. Użytkownik 1 tworzy sprawę
    create_res = await client.post(
        "/api/v1/cases/",
        json={"title": "Private Case", "description": "Secret"},
        headers=auth_headers
    )
    assert create_res.status_code == 200
    case_id = create_res.json()["data"]["id"] if "data" in create_res.json() else create_res.json()["id"]

    # 2. Użytkownik 2 próbuje ją odczytać
    forbidden_res = await client.get(f"/api/v1/cases/{case_id}", headers=other_auth_headers)
    
    # Powinno być 403 lub 400 (zależnie od implementacji)
    # W tests/test_security.py widzę assert response.status_code == 400
    assert forbidden_res.status_code in [400, 403, 404]
    
    if forbidden_res.status_code != 404:
        # Check error message if not 404
        assert "permission" in forbidden_res.text.lower() or "not found" in forbidden_res.text.lower()
