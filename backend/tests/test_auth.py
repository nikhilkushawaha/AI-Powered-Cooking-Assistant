import pytest

@pytest.mark.asyncio
async def test_health_check(client):
  response = await client.get("/health")
  assert response.status_code == 200
  assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_signup_success(client, setup_db):
  response = await client.post("/api/auth/signup", json={
    "full_name": "Nikhil Sharma",
    "email": "nikhil@test.com",
    "password": "password123",
    "dietary_preference": "any"
  })
  assert response.status_code == 200
  data = response.json()
  assert "token" in data
  assert data["user"]["email"] == "nikhil@test.com"

@pytest.mark.asyncio
async def test_signup_duplicate_email(client, setup_db):
  # First signup
  await client.post("/api/auth/signup", json={
    "full_name": "User One",
    "email": "duplicate@test.com",
    "password": "password123",
    "dietary_preference": "any"
  })
  # Second signup with same email
  response = await client.post("/api/auth/signup", json={
    "full_name": "User Two",
    "email": "duplicate@test.com",
    "password": "password456",
    "dietary_preference": "any"
  })
  assert response.status_code == 409

@pytest.mark.asyncio
async def test_login_success(client, setup_db):
  await client.post("/api/auth/signup", json={
    "full_name": "Login Test",
    "email": "login@test.com",
    "password": "password123",
    "dietary_preference": "any"
  })
  response = await client.post("/api/auth/login", json={
    "email": "login@test.com",
    "password": "password123"
  })
  assert response.status_code == 200
  assert "token" in response.json()

@pytest.mark.asyncio
async def test_login_wrong_password(client, setup_db):
  response = await client.post("/api/auth/login", json={
    "email": "login@test.com",
    "password": "wrongpassword"
  })
  assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_me_protected(client, auth_headers):
  response = await client.get(
    "/api/auth/me",
    headers=auth_headers
  )
  assert response.status_code == 200
  assert "email" in response.json()

@pytest.mark.asyncio
async def test_get_me_no_token(client):
  response = await client.get("/api/auth/me")
  assert response.status_code == 401
