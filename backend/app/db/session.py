from __future__ import annotations

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=True,
    pool_size=20,          # Maintain up to 20 permanent connections
    max_overflow=10,       # Allow up to 10 additional temporary connections
    pool_timeout=30,       # Wait up to 30 seconds for a connection
    pool_recycle=1800,     # Recycle connections every 30 minutes
    pool_pre_ping=True,    # Check connection health before use
    connect_args={
        "ssl": True  # Force SSL for cloud connections
    }
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
