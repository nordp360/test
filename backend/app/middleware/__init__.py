"""
Middleware package for LexPortal backend

Contains custom middleware for:
- DDoS protection
- Request logging
- Security headers
"""

from app.middleware.ddos_protection import DDoSProtectionMiddleware

__all__ = ["DDoSProtectionMiddleware"]
