import pytest
from unittest.mock import patch, AsyncMock

MOCK_RECIPE = {
  "name": "Test Pasta",
  "description": "A test pasta dish",
  "ingredients": [{"name": "pasta", "quantity": "200g"}],
  "instructions": ["Step 1: Boil pasta"],
  "cooking_time": 20,
  "difficulty": "easy",
  "cuisine_type": "Italian",
  "is_vegetarian": True,
  "calories": 300
}

@pytest.mark.asyncio
async def test_get_my_recipes_empty(client, auth_headers):
  response = await client.get(
    "/api/recipes/my-recipes",
    headers=auth_headers
  )
  assert response.status_code == 200
  data = response.json()
  assert "recipes" in data
  assert "total" in data
  assert data["total"] == 0

@pytest.mark.asyncio
async def test_extract_ingredients_requires_auth(client):
  response = await client.get(
    "/api/recipes/extract-ingredients?dish_name=pasta"
  )
  assert response.status_code == 401

@pytest.mark.asyncio
@patch(
  "app.services.recipe_service.RecipeService.generate_recipe",
  new_callable=AsyncMock
)
async def test_generate_recipe_mocked(
  mock_generate, client, auth_headers, setup_db
):
  # Mock the LLM call
  from app.models.recipe import Recipe
  import uuid
  from datetime import datetime

  mock_recipe = Recipe(
    id=uuid.uuid4(),
    user_id=uuid.uuid4(),
    name="Mock Pasta",
    description="Mocked",
    ingredients=[{"name": "pasta", "quantity": "200g"}],
    instructions=["Step 1"],
    cooking_time=20,
    difficulty="easy",
    cuisine_type="Italian",
    is_vegetarian=True,
    calories=300,
    source="ai_generated",
    created_at=datetime.now()
  )
  mock_generate.return_value = mock_recipe

  response = await client.post(
    "/api/recipes/generate",
    json={
      "ingredients": ["pasta", "eggs"],
      "cuisine_preference": "Italian"
    },
    headers=auth_headers
  )
  assert response.status_code == 200
