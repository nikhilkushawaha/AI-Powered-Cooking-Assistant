import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Index
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ingredients: Mapped[list] = mapped_column(JSON, nullable=False)
    # [{"name": "chicken", "quantity": "500g"}, ...]
    instructions: Mapped[list] = mapped_column(JSON, nullable=False)
    # ["Step 1: ...", "Step 2: ...", ...]
    cooking_time: Mapped[int | None] = mapped_column(Integer, nullable=True)
    difficulty: Mapped[str | None] = mapped_column(String(20), nullable=True)
    # "easy" | "medium" | "hard"
    cuisine_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_vegetarian: Mapped[bool] = mapped_column(Boolean, default=False)
    calories: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source: Mapped[str] = mapped_column(String(50), default="ai_generated")
    # "ai_generated" | "manual"
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    # Relationship back to User
    user = relationship("User", back_populates="recipes")
    favorited_by = relationship("Favorite", back_populates="recipe", cascade="all, delete-orphan")
