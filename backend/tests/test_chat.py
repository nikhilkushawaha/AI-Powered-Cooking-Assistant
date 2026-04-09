import pytest
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_chat_requires_auth(client):
  response = await client.post("/api/chat", json={
    "session_id": "test-session",
    "message": "Hello"
  })
  assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_chat_history_empty(client, auth_headers):
  response = await client.get(
    "/api/chat/history/new-session-123",
    headers=auth_headers
  )
  assert response.status_code == 200
  data = response.json()
  assert data["history"] == []

@pytest.mark.asyncio
async def test_clear_session(client, auth_headers):
  response = await client.delete(
    "/api/chat/session/test-session-xyz",
    headers=auth_headers
  )
  assert response.status_code == 200
  assert response.json()["status"] == "cleared"

@pytest.mark.asyncio
@patch(
  "app.services.chat_service.ChatService.chat",
  new_callable=AsyncMock
)
async def test_chat_message_mocked(
  mock_chat, client, auth_headers
):
  mock_chat.return_value = "Here is a great pasta recipe!"

  response = await client.post(
    "/api/chat",
    json={
      "session_id": "test-session-456",
      "message": "How do I make pasta?"
    },
    headers=auth_headers
  )
  assert response.status_code == 200
  data = response.json()
  assert "reply" in data
  assert "session_id" in data
