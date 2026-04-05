from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.favorite import FavoriteListResponse, FavoriteStatusResponse
from app.services.favorite_service import FavoriteService

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


@router.post("/{recipe_id}", response_model=FavoriteStatusResponse)
async def add_favorite(
    recipe_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = FavoriteService()
    return await service.add_favorite(recipe_id, current_user.id, db)


@router.delete("/{recipe_id}", response_model=FavoriteStatusResponse)
async def remove_favorite(
    recipe_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = FavoriteService()
    return await service.remove_favorite(recipe_id, current_user.id, db)


@router.get("", response_model=FavoriteListResponse)
async def get_favorites(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=100),
):
    service = FavoriteService()
    favorites, total = await service.get_user_favorites(current_user.id, skip, limit, db)
    return FavoriteListResponse(favorites=favorites, total=total)


@router.get("/check/{recipe_id}")
async def check_favorite(
    recipe_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = FavoriteService()
    is_fav = await service.is_favorited(recipe_id, current_user.id, db)
    return {"recipe_id": recipe_id, "is_favorited": is_fav}
