import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.recipe import (
    ExtractIngredientsResponse,
    GenerateRecipeRequest,
    RecipeListOut,
    RecipeOut,
)
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/recipes", tags=["recipes"])

recipe_service = RecipeService()

# Reusable dependency type aliases
CurrentUser = Annotated[User, Depends(get_current_user)]
DB = Annotated[AsyncSession, Depends(get_db)]


@router.post("/generate", response_model=RecipeOut)
async def generate_recipe(
    data: GenerateRecipeRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Generate a recipe from ingredients using AI and persist to DB."""
    recipe = await recipe_service.generate_recipe(
        ingredients=data.ingredients,
        cuisine_preference=data.cuisine_preference,
        dietary_preference=data.dietary_preference,
        user_id=current_user.id,
        db=db,
    )
    return recipe


@router.get("/extract-ingredients", response_model=ExtractIngredientsResponse)
async def extract_ingredients(
    current_user: CurrentUser,
    db: DB,
    dish_name: str = Query(..., min_length=2, max_length=100, description="Dish name"),
):
    """Extract ingredients for a dish via AI. Does not save to DB."""
    result = await recipe_service.extract_ingredients(
        dish_name=dish_name,
        db=db,
    )
    return result


@router.get("/my-recipes", response_model=RecipeListOut)
async def get_my_recipes(
    current_user: CurrentUser,
    db: DB,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get paginated list of the authenticated user's saved recipes."""
    recipes, total = await recipe_service.get_user_recipes(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        db=db,
    )
    return {"recipes": recipes, "total": total}


@router.get("/{recipe_id}", response_model=RecipeOut)
async def get_recipe(
    recipe_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """Fetch a single recipe by ID (must belong to current user)."""
    recipe = await recipe_service.get_recipe_by_id(
        recipe_id=recipe_id,
        user_id=current_user.id,
        db=db,
    )
    return recipe


@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """Delete a recipe (must belong to current user)."""
    await recipe_service.delete_recipe(
        recipe_id=recipe_id,
        user_id=current_user.id,
        db=db,
    )
    return {"message": "Recipe deleted successfully"}
