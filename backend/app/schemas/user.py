from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    dietary_preference: str = "any"


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    dietary_preference: str
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    token: str
    user: UserOut
    message: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PreferencesUpdate(BaseModel):
    dietary_preference: str
