from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.chat import ChatHistoryResponse, ChatRequest, ChatResponse, HistoryMessage
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def send_message(
    data: ChatRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = ChatService()
    reply = await service.chat(
        session_id=data.session_id,
        message=data.message,
        user_id=current_user.id,
        db=db,
    )
    return {"reply": reply, "session_id": data.session_id}


@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
async def get_history(
    session_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = ChatService()
    history = await service.get_history(session_id=session_id, db=db)
    return {
        "session_id": session_id,
        "history": [HistoryMessage(**msg) for msg in history],
    }


@router.delete("/session/{session_id}")
async def clear_session(
    session_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = ChatService()
    await service.clear_session(
        session_id=session_id, user_id=current_user.id, db=db
    )
    return {"status": "cleared", "session_id": session_id}
