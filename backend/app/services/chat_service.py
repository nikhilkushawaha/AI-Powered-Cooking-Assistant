import logging
import uuid
from typing import ClassVar

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.chat import ChatHistory

# ── Logger ────────────────────────────────────────────────────────────────────
logger = logging.getLogger(__name__)

# ── System Prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are Chef AI, an expert and friendly cooking assistant.
You ONLY help with cooking-related topics including:
recipes, ingredients, cooking techniques, food substitutions,
meal planning, nutrition facts, kitchen tips, and food culture.
Always format recipes with clear sections:
📝 Ingredients, 👨‍🍳 Instructions, ⏱ Cooking Time, 📊 Difficulty.
Use emojis to make responses engaging and easy to read.
If asked about anything unrelated to cooking or food,
politely decline and redirect to cooking topics."""


class ChatService:
    """
    Handles all cooking chatbot logic.
    Uses LangChain LCEL (modern approach) with manual history management.
    One history list per session_id stored in memory.
    All conversations persisted to PostgreSQL.
    """

    # ── Class-level shared state ───────────────────────────────────────────────
    _session_histories: ClassVar[dict[str, list]] = {}
    _llm: ClassVar[ChatGroq | None] = None

    # ── LLM Singleton ─────────────────────────────────────────────────────────
    @classmethod
    def _get_llm(cls) -> ChatGroq:
        """Create ChatGroq instance once and reuse it (singleton pattern)."""
        if cls._llm is None:
            cls._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile",
                temperature=0.7,
            )
        return cls._llm

    # ── Build LCEL Chain ──────────────────────────────────────────────────────
    @classmethod
    def _get_chain(cls):
        """
        Build the LangChain LCEL chain.
        Uses modern approach: prompt | llm (no deprecated LLMChain).
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        return prompt | cls._get_llm()

    # ── Session History ───────────────────────────────────────────────────────
    def _get_session_history(self, session_id: str) -> list:
        """Get or initialize in-memory history for a session."""
        if session_id not in self._session_histories:
            self._session_histories[session_id] = []
        return self._session_histories[session_id]

    # ── Chat ──────────────────────────────────────────────────────────────────
    async def chat(
        self,
        session_id: str,
        message: str,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> str:
        """
        Process a user message and return AI reply.
        - Validates input
        - Calls Groq LLM with full session history
        - Saves both messages to PostgreSQL
        - Updates in-memory history
        """

        # ── Input validation ──────────────────────────────────────────────────
        message = message.strip()
        if not message:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Message cannot be empty."
            )
        if len(message) > 2000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Message too long. Maximum 2000 characters."
            )

        # ── Get session history ───────────────────────────────────────────────
        history = self._get_session_history(session_id)

        # ── Call LLM ─────────────────────────────────────────────────────────
        try:
            chain = self._get_chain()
            response = await chain.ainvoke({
                "history": history,
                "input": message,
            })
            reply = response.content.strip()

        except Exception as e:
            logger.error(
                f"Groq API error | session={session_id} | error={str(e)}"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. Please try again."
            )

        # ── Update in-memory history ──────────────────────────────────────────
        history.append(HumanMessage(content=message))
        history.append(AIMessage(content=reply))

        # ── Persist to PostgreSQL ─────────────────────────────────────────────
        try:
            db.add(ChatHistory(
                user_id=user_id,
                session_id=session_id,
                role="user",
                content=message,
            ))
            db.add(ChatHistory(
                user_id=user_id,
                session_id=session_id,
                role="assistant",
                content=reply,
            ))
            await db.commit()   # ✅ commit() not flush() — actually saves data

        except Exception as e:
            await db.rollback()
            logger.error(
                f"DB save error | session={session_id} | error={str(e)}"
            )
            # Still return reply even if DB save fails
            # Don't crash the user's chat over a logging issue

        logger.info(f"Chat success | session={session_id} | user={user_id}")
        return reply

    # ── Get History ───────────────────────────────────────────────────────────
    async def get_history(
        self,
        session_id: str,
        db: AsyncSession
    ) -> list[dict]:
        """
        Fetch full chat history for a session from PostgreSQL.
        Returns created_at as ISO string for safe JSON serialization.
        """
        try:
            result = await db.execute(
                select(ChatHistory)
                .where(ChatHistory.session_id == session_id)
                .order_by(ChatHistory.created_at.asc())
            )
            rows = result.scalars().all()

            return [
                {
                    "role": row.role,
                    "content": row.content,
                    "created_at": row.created_at.isoformat(),  # ✅ string not datetime object
                }
                for row in rows
            ]

        except Exception as e:
            logger.error(
                f"DB fetch error | session={session_id} | error={str(e)}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not fetch chat history."
            )

    # ── Clear Session ─────────────────────────────────────────────────────────
    async def clear_session(
        self,
        session_id: str,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> None:
        """
        Clear in-memory history and delete all DB records for a session.
        """
        # Clear in-memory
        if session_id in self._session_histories:
            del self._session_histories[session_id]
            logger.info(f"Cleared memory | session={session_id}")

        # Delete from DB
        try:
            await db.execute(
                delete(ChatHistory)
                .where(ChatHistory.session_id == session_id)
            )
            await db.commit()   # ✅ commit() not flush()

        except Exception as e:
            await db.rollback()
            logger.error(
                f"DB clear error | session={session_id} | error={str(e)}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not clear session."
            )