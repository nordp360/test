# No __future__ annotations - causes Pydantic ForwardRef issues

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import redis.asyncio as redis
import asyncio
import socket
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.core.config import settings
from app.middleware.ddos_protection import DDoSProtectionMiddleware


# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Import all schemas BEFORE importing routers
from app.schemas.user import UserCreate, UserResponse, UserProfileUpdate, UserPasswordUpdate
from app.schemas.case import CaseCreate, Case, CaseUpdate
from app.schemas.document import Document, DocumentCreate
from app.schemas.auth import Token, TokenData, UserBase

# Now import routers
from app.api.v1.endpoints import auth, cases, ai, notifications, messages, users, seed, audit

from contextlib import asynccontextmanager
from app.db.session import engine
from app.db.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retry logic for database connection on startup
    retries = 5
    while retries > 0:
        try:
            if settings.environment != "TESTING":
                async with engine.begin() as conn:
                    await conn.run_sync(Base.metadata.create_all)
                    await conn.execute(text("SELECT 1"))
            break
        except (OperationalError, socket.gaierror) as e:
            retries -= 1
            print(f"Database error: {e}. Retrying...")
            await asyncio.sleep(5)
    yield
    await engine.dispose()

# Create FastAPI app
app = FastAPI(
    title="LexPortal API",
    description="Backend API for LexPortal legal platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Redis client
try:
    redis_client = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
except Exception:
    redis_client = None

# 1. DDoS Middleware
app.add_middleware(
    DDoSProtectionMiddleware,
    redis_client=redis_client,
    trusted_ips=settings.trusted_ips,
    max_violations=settings.ddos_max_violations,
    ban_duration=settings.ddos_ban_seconds,
    violation_window=settings.ddos_window_seconds
)

# 2. CORS Middleware
origins = [
    "https://test-production-bf56f.up.railway.app",
    "https://twoja-domena-frontendu.up.railway.app",
    "http://localhost:5173",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Routers
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
    return {"name": "LexPortal API", "version": "1.0.0", "status": "running"}
