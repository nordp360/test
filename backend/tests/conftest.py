import asyncio
import pytest
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy import String

@compiles(INET, "sqlite")
def compile_inet_sqlite(element, compiler, **kw):
    return "VARCHAR"

from app.main import app
from app.db.models import Base
from app.api.deps import get_db
from app.core.config import settings

# Test database URL - using a separate database or sqlite for simplicity in tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
async def test_user(db_session: AsyncSession):
    from app.core.security import get_password_hash
    from app.db.models import User
    import uuid
    
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email=f"user_{user_id.hex[:8]}@example.com",
        password_hash=get_password_hash("Password123!"),
        role="client",
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest.fixture
async def user_token(client: AsyncClient, test_user):
    from app.core.security import create_access_token
    token = create_access_token(subject=str(test_user.id))
    return token

@pytest.fixture
async def auth_headers(user_token):
    return {"Authorization": f"Bearer {user_token}"}

@pytest.fixture
async def second_test_user(db_session: AsyncSession):
    from app.core.security import get_password_hash
    from app.db.models import User
    import uuid
    
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email=f"user2_{user_id.hex[:8]}@example.com",
        password_hash=get_password_hash("Password123!"),
        role="CLIENT",
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest.fixture
async def other_auth_headers(second_test_user):
    from app.core.security import create_access_token
    token = create_access_token(subject=str(second_test_user.id))
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), # type: ignore
        base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture(scope="session", autouse=True)
def disable_ddos_redis():
    from app.main import app
    from app.middleware.ddos_protection import DDoSProtectionMiddleware
    from starlette.middleware import Middleware

    new_middleware_stack = []
    for mw in app.user_middleware:
        if mw.cls == DDoSProtectionMiddleware:
            # Safely get options/kwargs
            options = {}
            if hasattr(mw, "options"):
                options = mw.options.copy()
            elif hasattr(mw, "kwargs"):
                options = mw.kwargs.copy()
            else:
                # Fallback: maybe it's iterating over something else? 
                # Assuming standard Middleware usage
                pass
            
            options["redis_client"] = None
            new_middleware_stack.append(Middleware(mw.cls, **options))
        else:
            new_middleware_stack.append(mw)
    
    app.user_middleware = new_middleware_stack
