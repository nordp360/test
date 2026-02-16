# No __future__ annotations - causes Pydantic ForwardRef issues

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import redis.asyncio as redis

from app.core.config import settings
from app.middleware.ddos_protection import DDoSProtectionMiddleware


# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Import all schemas BEFORE importing routers
# This ensures proper model resolution
from app.schemas.user import UserCreate, UserResponse, UserProfileUpdate, UserPasswordUpdate
from app.schemas.case import CaseCreate, Case, CaseUpdate
from app.schemas.document import Document, DocumentCreate
from app.schemas.auth import Token, TokenData, UserBase

# No model_rebuild() calls - let Pydantic handle ForwardRef resolution naturally

# Now import routers
from app.api.v1.endpoints import auth, cases, ai, notifications, messages, users, seed, audit

from contextlib import asynccontextmanager
from app.db.session import engine
from app.db.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if not testing
    if settings.environment != "TESTING":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown logic if any

# Create FastAPI app
app = FastAPI(
    title="LexPortal API",
    description="Backend API for LexPortal legal platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter

# Add rate limit exception handler
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize Redis client for DDoS protection (optional)
try:
    redis_client = redis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True
    )
except Exception:
    # Fallback to in-memory tracking if Redis unavailable
    redis_client = None

# Add DDoS Protection Middleware
app.add_middleware(
    DDoSProtectionMiddleware, 
    redis_client=redis_client,
    trusted_ips=settings.trusted_ips,
    max_violations=settings.ddos_max_violations,
    ban_duration=settings.ddos_ban_seconds,
    violation_window=settings.ddos_window_seconds
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(seed.router, prefix="/api/v1/dev", tags=["development"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["audit"])


@app.get("/")
async def root():
    return {
        "name": "LexPortal API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }
