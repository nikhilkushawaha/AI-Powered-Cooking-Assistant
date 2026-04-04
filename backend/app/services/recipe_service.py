import json
import logging
import uuid
from typing import ClassVar, Optional

from fastapi import HTTPException, status
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.recipe import Recipe

logger = logging.getLogger(__name__)


class RecipeService:
    """
    Handles AI-powered recipe generation, ingredient extraction,
    and CRUD operations for user recipes.
    """

    _llm: ClassVar[ChatGroq | None] = None

    @classmethod
    def _get_llm(cls) -> ChatGroq:
        """Singleton — create once, reuse."""
        if cls._llm is None:
            cls._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile",
                temperature=0.7,
            )
        return cls._llm

    # ── METHOD 1: generate_recipe ─────────────────────────────────────────────
    async def generate_recipe(
        self,
        ingredients: list[str],
        cuisine_preference: Optional[str],
        dietary_preference: Optional[str],
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> Recipe:
        """
        Use LLM to generate a recipe from provided ingredients, then save to DB.
        """
        ingredients_str = ", ".join(ingredients)
        cuisine_str = cuisine_preference or "any"
        dietary_str = dietary_preference or "any"

        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                """You are a professional chef. Generate a complete recipe using ONLY or MOSTLY the provided ingredients.
You may add basic pantry staples (salt, pepper, oil, water, basic spices).

Provided ingredients: {ingredients}
Cuisine preference: {cuisine_preference}
Dietary preference: {dietary_preference}

Respond ONLY with a valid JSON object (no preamble, no extra text, no markdown code blocks):
{{
  "name": "Recipe Name",
  "description": "One line description",
  "ingredients": [
    {{"name": "ingredient", "quantity": "amount"}}
  ],
  "instructions": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "cooking_time": 30,
  "difficulty": "easy",
  "cuisine_type": "Italian",
  "is_vegetarian": false,
  "calories": 450
}}""",
            )
        ])

        try:
            chain = prompt | self._get_llm()
            response = await chain.ainvoke({
                "ingredients": ingredients_str,
                "cuisine_preference": cuisine_str,
                "dietary_preference": dietary_str,
            })
            raw = response.content.strip()

            # Strip markdown code blocks if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

        except Exception as e:
            logger.error(f"Groq API error during generate_recipe: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. Please try again.",
            )

        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"JSON parse error in generate_recipe: {e} | raw: {raw[:500]}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI returned invalid response. Please try again.",
            )

        # Validate required fields
        required_fields = ["name", "ingredients", "instructions"]
        for field in required_fields:
            if field not in data or not data[field]:
                logger.error(f"Missing field '{field}' in LLM response")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="AI returned invalid response. Please try again.",
                )

        try:
            recipe = Recipe(
                user_id=user_id,
                name=str(data.get("name", "Untitled Recipe")),
                description=data.get("description"),
                ingredients=data.get("ingredients", []),
                instructions=data.get("instructions", []),
                cooking_time=int(data["cooking_time"]) if data.get("cooking_time") else None,
                difficulty=data.get("difficulty"),
                cuisine_type=data.get("cuisine_type"),
                is_vegetarian=bool(data.get("is_vegetarian", False)),
                calories=int(data["calories"]) if data.get("calories") else None,
                source="ai_generated",
            )
            db.add(recipe)
            await db.commit()
            await db.refresh(recipe)
            return recipe

        except Exception as e:
            await db.rollback()
            logger.error(f"DB error saving recipe: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save recipe. Please try again.",
            )

    # ── METHOD 2: extract_ingredients ─────────────────────────────────────────
    async def extract_ingredients(
        self,
        dish_name: str,
        db: AsyncSession,
    ) -> dict:
        """
        Use LLM to extract ingredients for a given dish name.
        Does NOT persist to DB — returns structured data only.
        """
        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                """You are a professional chef with encyclopedic knowledge of recipes worldwide.

For the dish: {dish_name}

Respond ONLY with a valid JSON object (no preamble, no extra text, no markdown code blocks):
{{
  "dish_name": "{dish_name}",
  "ingredients": [
    {{"name": "ingredient", "quantity": "amount"}}
  ],
  "serving_size": "4 servings",
  "notes": "Any special notes about the dish"
}}""",
            )
        ])

        try:
            chain = prompt | self._get_llm()
            response = await chain.ainvoke({"dish_name": dish_name})
            raw = response.content.strip()

            # Strip markdown code blocks if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()

        except Exception as e:
            logger.error(f"Groq API error during extract_ingredients: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. Please try again.",
            )

        try:
            data = json.loads(raw)
            return data
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"JSON parse error in extract_ingredients: {e} | raw: {raw[:500]}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI returned invalid response. Please try again.",
            )

    # ── METHOD 3: get_user_recipes ────────────────────────────────────────────
    async def get_user_recipes(
        self,
        user_id: uuid.UUID,
        skip: int = 0,
        limit: int = 10,
        db: AsyncSession = None,
    ) -> tuple[list[Recipe], int]:
        """
        Paginated list of user's recipes ordered by most recent first.
        """
        # Total count
        count_result = await db.execute(
            select(func.count(Recipe.id)).where(Recipe.user_id == user_id)
        )
        total = count_result.scalar_one()

        # Paginated list
        result = await db.execute(
            select(Recipe)
            .where(Recipe.user_id == user_id)
            .order_by(Recipe.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        recipes = result.scalars().all()
        return list(recipes), total

    # ── METHOD 4: get_recipe_by_id ────────────────────────────────────────────
    async def get_recipe_by_id(
        self,
        recipe_id: uuid.UUID,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> Recipe:
        """Fetch a recipe, enforcing ownership."""
        result = await db.execute(
            select(Recipe).where(Recipe.id == recipe_id)
        )
        recipe = result.scalar_one_or_none()

        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found.",
            )
        if recipe.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this recipe.",
            )
        return recipe

    # ── METHOD 5: delete_recipe ───────────────────────────────────────────────
    async def delete_recipe(
        self,
        recipe_id: uuid.UUID,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> None:
        """Delete a recipe after verifying ownership."""
        recipe = await self.get_recipe_by_id(recipe_id, user_id, db)
        try:
            await db.delete(recipe)
            await db.commit()
        except Exception as e:
            await db.rollback()
            logger.error(f"DB error deleting recipe {recipe_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete recipe. Please try again.",
            )
