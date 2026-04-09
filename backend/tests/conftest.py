import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from main import app
from app.core.database import get_db, Base

# Use in-memory SQLite for tests (no real DB needed)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
  TEST_DATABASE_URL,
  connect_args={"check_same_thread": False}
)

TestSessionLocal = sessionmaker(
  test_engine,
  class_=AsyncSession,
  expire_on_commit=False
)

async def override_get_db():
  async with TestSessionLocal() as session:
    yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def event_loop():
  loop = asyncio.get_event_loop_policy().new_event_loop()
  yield loop
  loop.close()

@pytest.fixture(scope="session")
async def setup_db():
  async with test_engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
  yield
  async with test_engine.begin() as conn:
    await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client(setup_db):
  async with AsyncClient(
    transport=ASGITransport(app=app),
    base_url="http://test"
  ) as ac:
    yield ac

@pytest.fixture
async def auth_headers(client):
  # Create test user
  await client.post("/api/auth/signup", json={
    "full_name": "Test User",
    "email": "test@chefai.com",
    "password": "testpassword123",
    "dietary_preference": "any"
  })
  # Login
  response = await client.post("/api/auth/login", json={
    "email": "test@chefai.com",
    "password": "testpassword123"
  })
  token = response.json()["token"]
  return {"Authorization": f"Bearer {token}"}
