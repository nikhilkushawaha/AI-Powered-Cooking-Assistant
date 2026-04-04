from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator


class Ingredient(BaseModel):
    name: str
    quantity: str


class GenerateRecipeRequest(BaseModel):
    ingredients: list[str]
    cuisine_preference: Optional[str] = None
    dietary_preference: Optional[str] = None

    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, v: list[str]) -> list[str]:
        if len(v) < 1:
            raise ValueError("At least 1 ingredient is required")
        if len(v) > 20:
            raise ValueError("Maximum 20 ingredients allowed")
        return [i.strip() for i in v if i.strip()]


class ExtractIngredientsRequest(BaseModel):
    dish_name: str

    @field_validator("dish_name")
    @classmethod
    def validate_dish_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Dish name must be at least 2 characters")
        if len(v) > 100:
            raise ValueError("Dish name must be at most 100 characters")
        return v


class RecipeOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    ingredients: list[Ingredient]
    instructions: list[str]
    cooking_time: Optional[int] = None
    difficulty: Optional[str] = None
    cuisine_type: Optional[str] = None
    is_vegetarian: bool
    calories: Optional[int] = None
    source: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecipeListOut(BaseModel):
    recipes: list[RecipeOut]
    total: int


class ExtractIngredientsResponse(BaseModel):
    dish_name: str
    ingredients: list[Ingredient]
    serving_size: Optional[str] = None
    notes: Optional[str] = None
