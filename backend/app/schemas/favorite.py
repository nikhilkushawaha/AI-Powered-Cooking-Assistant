from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from app.schemas.recipe import RecipeOut


class FavoriteOut(BaseModel):
    id: UUID
    recipe_id: UUID
    created_at: datetime
    recipe: RecipeOut

    model_config = ConfigDict(from_attributes=True)


class FavoriteListResponse(BaseModel):
    favorites: list[FavoriteOut]
    total: int


class FavoriteStatusResponse(BaseModel):
    recipe_id: UUID
    is_favorited: bool
    message: str
