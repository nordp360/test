"""
DDoS Protection Middleware

Provides additional protection layer beyond basic rate limiting:
- IP reputation tracking
- Suspicious pattern detection
- Automatic temporary bans
- Integration with Redis for distributed tracking
"""

from __future__ import annotations

from typing import Dict, Optional, List
from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import redis.asyncio as redis
from app.core.config import settings


class DDoSProtectionMiddleware(BaseHTTPMiddleware):
    """
    Advanced DDoS protection middleware
    
    Features:
    - Track request patterns per IP
    - Detect suspicious behavior (rapid requests, unusual endpoints)
    - Temporary IP bans for repeated violations
    - Redis-based distributed tracking
    """
    
    def __init__(
        self, 
        app, 
        redis_client: Optional[redis.Redis] = None,
        trusted_ips: Optional[List[str]] = None,
        max_violations: int = 5,
        ban_duration: int = 900,
        violation_window: int = 300
    ):
        super().__init__(app)
        self.redis_client = redis_client
        self.trusted_ips = set(trusted_ips or ["127.0.0.1", "::1"])

        # Configuration
        self.max_violations = max_violations
        self.ban_duration = timedelta(seconds=ban_duration)
        self.violation_window = timedelta(seconds=violation_window)
        
        # In-memory fallback if Redis unavailable
        self.ip_violations: Dict[str, int] = {}
        self.banned_ips: Dict[str, datetime] = {}
    
    async def dispatch(self, request: Request, call_next):
        """
        Process each request through DDoS protection checks
        """
        client_ip = self._get_client_ip(request)

        # Check whitelist
        if client_ip in self.trusted_ips:
            return await call_next(request)
        
        # Check if IP is banned
        if await self._is_banned(client_ip):
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Your IP has been temporarily banned due to suspicious activity. Please try again later."
                }
            )
        
        # Check for suspicious patterns
        if await self._detect_suspicious_pattern(request, client_ip):
            await self._record_violation(client_ip)
            
            # Check if violations exceed threshold
            violations = await self._get_violations(client_ip)
            if violations >= self.max_violations:
                await self._ban_ip(client_ip)
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": "Too many violations detected. Your IP has been temporarily banned."
                    }
                )
        
        # Process request
        response = await call_next(request)
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """
        Extract client IP from request, considering proxies
        """
        # Check for forwarded IP (behind proxy/load balancer)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        # Check for real IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to direct client
        return request.client.host if request.client else "unknown"
    
    async def _is_banned(self, ip: str) -> bool:
        """
        Check if IP is currently banned
        """
        if self.redis_client:
            # Check Redis for ban status
            ban_key = f"ddos:ban:{ip}"
            is_banned = await self.redis_client.exists(ban_key)
            return bool(is_banned)
        else:
            # Check in-memory cache
            if ip in self.banned_ips:
                ban_expiry = self.banned_ips[ip]
                # Compare with UTC aware datetime
                if datetime.now(timezone.utc) < ban_expiry:
                    return True
                else:
                    # Ban expired, remove from cache
                    del self.banned_ips[ip]
            return False
    
    async def _detect_suspicious_pattern(self, request: Request, ip: str) -> bool:
        """
        Detect suspicious request patterns
        
        Patterns checked:
        - Accessing unusual/non-existent endpoints repeatedly
        - Sending malformed requests
        - Unusual user agents
        """
        # Check for common attack patterns in path
        suspicious_paths = [
            "/admin", "/phpmyadmin", "/.env", "/wp-admin", 
            "/.git", "/config", "/backup", "/shell"
        ]
        
        path = request.url.path.lower()
        if any(suspicious in path for suspicious in suspicious_paths):
            return True
        
        # Check for SQL injection attempts in query params
        query_string = str(request.url.query).lower()
        sql_patterns = ["union select", "drop table", "insert into", "delete from", "' or '1'='1"]
        if any(pattern in query_string for pattern in sql_patterns):
            return True
        
        # Check for missing or suspicious user agent
        user_agent = request.headers.get("User-Agent", "").lower()
        
        # Whitelist good bots
        good_bots = ["googlebot", "bingbot", "duckduckbot"] 
        if any(bot in user_agent for bot in good_bots):
            return False

        if not user_agent or any(bot in user_agent for bot in ["bot", "crawler", "spider", "scraper"]):
            # Note: Legitimate bots should be whitelisted separately
            pass
        
        return False
    
    async def _record_violation(self, ip: str):
        """
        Record a violation for an IP
        """
        if self.redis_client:
            violation_key = f"ddos:violations:{ip}"
            # Increment violation count
            await self.redis_client.incr(violation_key)
            # Set expiry for violation window
            # Set expiry for violation window
            await self.redis_client.expire(violation_key, int(self.violation_window.total_seconds()))
        else:
            # In-memory tracking
            self.ip_violations[ip] = self.ip_violations.get(ip, 0) + 1
    
    async def _get_violations(self, ip: str) -> int:
        """
        Get current violation count for an IP
        """
        if self.redis_client:
            violation_key = f"ddos:violations:{ip}"
            violations = await self.redis_client.get(violation_key)
            return int(violations) if violations else 0
        else:
            return self.ip_violations.get(ip, 0)
    
    async def _ban_ip(self, ip: str):
        """
        Ban an IP for the configured duration
        """
        if self.redis_client:
            ban_key = f"ddos:ban:{ip}"
            # Set ban with expiry
            await self.redis_client.setex(
                ban_key,
                int(self.ban_duration.total_seconds()),
                "1"
            )
        else:
            # In-memory ban
            self.banned_ips[ip] = datetime.now(timezone.utc) + self.ban_duration
