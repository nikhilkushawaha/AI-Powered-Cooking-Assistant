from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import LoginRequest, PreferencesUpdate, Token, UserCreate, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
async def signup(
    data: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = AuthService(db)
    user = await service.signup(data)
    token = await service.login(data.email, data.password)
    return {
        "token": token,
        "user": UserOut.model_validate(user),
        "message": f"Welcome to Chef AI, {user.full_name}! 🎉",
    }


@router.post("/login", response_model=Token)
async def login(
    data: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = AuthService(db)
    token = await service.login(data.email, data.password)
    # Get the user
    from jose import jwt as jose_jwt
    from app.core.config import settings as cfg
    payload = jose_jwt.decode(token, cfg.SECRET_KEY, algorithms=[cfg.ALGORITHM])
    user = await service.get_user_by_id(payload["sub"])
    return {
        "token": token,
        "user": UserOut.model_validate(user),
        "message": f"Welcome back, {user.full_name}! 👋",
    }


@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return UserOut.model_validate(current_user)


@router.put("/preferences", response_model=dict)
async def update_preferences(
    data: PreferencesUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = AuthService(db)
    user = await service.update_preferences(current_user, data.dietary_preference)
    return {
        "message": "Preferences updated successfully",
        "user": UserOut.model_validate(user),
    }
