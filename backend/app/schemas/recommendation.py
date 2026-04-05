from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    limit: int = Field(default=5, ge=1, le=10)


class RecommendationOut(BaseModel):
    name: str
    description: str
    cuisine_type: str
    difficulty: str
    cooking_time: int
    is_vegetarian: bool
    reason: str
    ingredients_preview: list[str]


class RecommendationResponse(BaseModel):
    recommendations: list[RecommendationOut]
    based_on: str
    dietary_preference: str
