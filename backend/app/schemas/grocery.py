from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GroceryRequest(BaseModel):
    recipe_ids: list[UUID]


class GroceryItem(BaseModel):
    name: str
    total_quantity: str
    unit: str | None
    recipes: list[str]


class GroceryListResponse(BaseModel):
    items: list[GroceryItem]
    total_items: int
    recipe_names: list[str]
    generated_at: datetime
