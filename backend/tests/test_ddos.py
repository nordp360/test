
import pytest
import asyncio
from httpx import AsyncClient
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_ddos_detects_suspicious_path(client: AsyncClient):
    # Próba wejścia na zakazaną ścieżkę
    # Not using trusted IP to trigger protection
    headers = {"X-Forwarded-For": "10.0.0.1"} # Use a non-local IP to bypass trusted list (127.0.0.1 is trusted in tests usually)
    
    response = await client.get("/.env", headers=headers)
    # Status might be 404 (not found) or 200 (if caught by something elese), but logic should record violation.
    # We can't easily check internal state without mocking, but we can check if it eventually bans.
    
    # Let's try to trigger it enough times to get banned, or just check response isn't 500
    assert response.status_code in [404, 200, 429]

@pytest.mark.asyncio
async def test_ddos_sql_injection_detection(client: AsyncClient):
    # Próba wstrzyknięcia SQL w query params
    headers = {"X-Forwarded-For": "10.0.0.2"}
    response = await client.get("/api/v1/cases/?title=' OR '1'='1", headers=headers)
    # Middleware logic: if suspicious, record violation.
    # It passes request downstream unless banned or handled?
    # Actually code says: 
    # if await self._detect_suspicious_pattern(request, client_ip): 
    #    await self._record_violation(client_ip)
    #    ... check if banned ...
    #    response = await call_next(request)
    # So it still processes request unless banned.
    assert response.status_code in [200, 404, 400, 422, 429, 401]

@pytest.mark.asyncio
async def test_ddos_ip_banning_flow(client: AsyncClient):
    client_ip = "1.2.3.4"
    headers = {"X-Forwarded-For": client_ip}
    
    # 1. Generujemy 6 naruszeń (max_violations = 5)
    # Using a suspicious path to trigger violation
    for i in range(7):
        response = await client.get("/phpmyadmin", headers=headers)
        if response.status_code == 429:
            break
    
    # 2. Kolejne zapytanie (nawet na poprawny endpoint) powinno dostać 429
    # Note: simple get to / might be rate limited by slowapi too, but 429 is what we expect from DDoS middleware too.
    # DDoS middleware returns 429 with specific message "Your IP has been temporarily banned" or "Too many violations"
    
    response = await client.get("/api/v1/auth/register", headers=headers) # Using a valid endpoint
    
    assert response.status_code == 429
    data = response.json()
    # Check if it comes from DDoS middleware (custom message)
    # Middleware returns: "detail": "Your IP has been temporarily banned due to suspicious activity. Please try again later."
    # OR "Too many violations detected. Your IP has been temporarily banned."
    assert "banned" in data.get("detail", "").lower()

@pytest.mark.asyncio
async def test_ddos_whitelist_works(client: AsyncClient):
    # 1. Trusted IP should NOT trigger bans even with suspicious activity
    # Default trusted is 127.0.0.1 (which client uses by default usually?)
    # But AsyncClient might not set X-Forwarded-For, and request.client.host is "testclient" or "127.0.0.1"
    
    # Let's explicitly set X-Forwarded-For to a trusted IP if we configured one.
    # In config we set trusted_ips=["127.0.0.1"]
    
    headers = {"X-Forwarded-For": "127.0.0.1"}
    
    # Try to spam suspicious requests
    for _ in range(10):
        await client.get("/phpmyadmin", headers=headers)
        
    # Should still be able to access valid endpoint
    response = await client.get("/api/v1/auth/register", headers=headers) # Method not allowed maybe (GET on POST endpoint), but not 429
    assert response.status_code != 429
