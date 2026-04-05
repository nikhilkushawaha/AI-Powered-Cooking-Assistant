from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.grocery import GroceryListResponse, GroceryRequest
from app.services.grocery_service import GroceryService

router = APIRouter(prefix="/api/grocery", tags=["Grocery"])


@router.post("/generate", response_model=GroceryListResponse)
async def generate_grocery_list(
    request: GroceryRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = GroceryService()
    return await service.generate_grocery_list(request.recipe_ids, current_user.id, db)
