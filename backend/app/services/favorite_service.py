from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.favorite import Favorite
from app.models.recipe import Recipe
from app.schemas.favorite import FavoriteStatusResponse


class FavoriteService:
    async def add_favorite(
        self,
        recipe_id: UUID,
        user_id: UUID,
        db: AsyncSession,
    ) -> FavoriteStatusResponse:
        # Check recipe exists
        query_recipe = select(Recipe).where(Recipe.id == recipe_id)
        result_recipe = await db.execute(query_recipe)
        recipe = result_recipe.scalar_one_or_none()
        
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        if recipe.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to favorite this recipe")

        # Check if already favorited
        query_fav = select(Favorite).where(
            Favorite.user_id == user_id, Favorite.recipe_id == recipe_id
        )
        result_fav = await db.execute(query_fav)
        existing_fav = result_fav.scalar_one_or_none()

        if existing_fav:
            return FavoriteStatusResponse(
                recipe_id=recipe_id,
                is_favorited=True,
                message="already favorited"
            )

        # Create
        new_fav = Favorite(user_id=user_id, recipe_id=recipe_id)
        db.add(new_fav)
        await db.commit()

        return FavoriteStatusResponse(
            recipe_id=recipe_id,
            is_favorited=True,
            message="Recipe added to favorites ❤️"
        )


    async def remove_favorite(
        self,
        recipe_id: UUID,
        user_id: UUID,
        db: AsyncSession,
    ) -> FavoriteStatusResponse:
        query_fav = select(Favorite).where(
            Favorite.user_id == user_id, Favorite.recipe_id == recipe_id
        )
        result_fav = await db.execute(query_fav)
        existing_fav = result_fav.scalar_one_or_none()

        if not existing_fav:
            raise HTTPException(status_code=404, detail="Favorite not found")

        await db.delete(existing_fav)
        await db.commit()

        return FavoriteStatusResponse(
            recipe_id=recipe_id,
            is_favorited=False,
            message="Recipe removed from favorites"
        )

    async def get_user_favorites(
        self,
        user_id: UUID,
        skip: int,
        limit: int,
        db: AsyncSession,
    ) -> tuple[list, int]:
        # Get count
        count_query = select(func.count(Favorite.id)).where(Favorite.user_id == user_id)
        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        # Get paginated data
        query = (
            select(Favorite)
            .options(selectinload(Favorite.recipe))
            .where(Favorite.user_id == user_id)
            .order_by(Favorite.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        favorites = result.scalars().all()

        return list(favorites), total

    async def is_favorited(
        self,
        recipe_id: UUID,
        user_id: UUID,
        db: AsyncSession,
    ) -> bool:
        query = select(Favorite).where(
            Favorite.user_id == user_id, Favorite.recipe_id == recipe_id
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None

    async def get_favorite_recipe_names(
        self,
        user_id: UUID,
        db: AsyncSession,
        limit: int = 10,
    ) -> list[str]:
        query = (
            select(Recipe.name)
            .join(Favorite, Favorite.recipe_id == Recipe.id)
            .where(Favorite.user_id == user_id)
            .order_by(Favorite.created_at.desc())
            .limit(limit)
        )
        result = await db.execute(query)
        return list(result.scalars().all())
