import json
from uuid import UUID
from typing import ClassVar

from fastapi import HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.recipe import Recipe
from app.schemas.recommendation import RecommendationResponse, RecommendationOut
from app.services.favorite_service import FavoriteService


class RecommendationService:
    
    _llm: ClassVar[ChatGroq | None] = None

    @classmethod
    def _get_llm(cls) -> ChatGroq:
        if cls._llm is None:
            cls._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile",
                temperature=0.8,
            )
        return cls._llm

    async def get_recommendations(
        self,
        user_id: UUID,
        dietary_preference: str,
        limit: int,
        db: AsyncSession,
    ) -> RecommendationResponse:
        
        fav_service = FavoriteService()
        favorite_names = await fav_service.get_favorite_recipe_names(user_id=user_id, db=db, limit=5)

        # Get recently generated recipes for context
        q_recent = select(Recipe.name).where(Recipe.user_id == user_id).order_by(Recipe.created_at.desc()).limit(5)
        r_recent = await db.execute(q_recent)
        recent_names = list(r_recent.scalars().all())

        if favorite_names:
            based_on = f"Based on your {len(favorite_names)} favorite recipes and dietary preference"
        else:
            based_on = "Based on your dietary preference"

        prompt_template = """
        You are a world-class chef and nutrition expert.
        Generate {limit} personalized recipe recommendations.

        User Profile:
        - Dietary preference: {dietary_preference}
        - Favorite recipes: {favorite_names}
        - Recently made recipes: {recent_recipes}

        Requirements:
        - Match the dietary preference strictly!
        - Suggest variety (different cuisines, cooking methods)
        - Consider what they already like based on their favorites.
        - Include a mix of difficulty levels.
        - Each recipe must have a unique 'reason' explaining why it suits this specific user.
        - Respond ONLY with a valid JSON array, NO markdown blocks, NO extra text.

        Format:
        [
            {{
                "name": "Recipe Name",
                "description": "One compelling sentence",
                "cuisine_type": "Italian",
                "difficulty": "easy",
                "cooking_time": 25,
                "is_vegetarian": true,
                "reason": "Since you love pasta dishes...",
                "ingredients_preview": ["pasta","eggs","cheese","pepper"]
            }}
        ]
        """

        prompt = ChatPromptTemplate.from_template(prompt_template)
        llm = self._get_llm()

        try:
            chain = prompt | llm
            response_msg = await chain.ainvoke({
                "limit": limit,
                "dietary_preference": dietary_preference,
                "favorite_names": ", ".join(favorite_names) if favorite_names else "None yet",
                "recent_recipes": ", ".join(recent_names) if recent_names else "None yet"
            })

            content = response_msg.content.strip()
            # Handle potential markdown wrappers
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()

            data = json.loads(content)

            recommendations = []
            for item in data[:limit]:
                recommendations.append(RecommendationOut(**item))

            return RecommendationResponse(
                recommendations=recommendations,
                based_on=based_on,
                dietary_preference=dietary_preference
            )
        except Exception as e:
            import logging
            logging.error(f"Error generating recommendations: {e}")
            raise HTTPException(status_code=503, detail="Failed to generate recommendations from AI")
