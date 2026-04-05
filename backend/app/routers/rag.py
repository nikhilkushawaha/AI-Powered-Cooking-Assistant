import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.rag import (
    AskDocumentRequest,
    AskDocumentResponse,
    DocumentListResponse,
    UploadDocumentResponse,
)
from app.services.rag_service import RAGService

router = APIRouter(prefix="/api/rag", tags=["rag"])

rag_service = RAGService()

CurrentUser = Annotated[User, Depends(get_current_user)]
DB = Annotated[AsyncSession, Depends(get_db)]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload", response_model=UploadDocumentResponse)
async def upload_document(
    current_user: CurrentUser,
    db: DB,
    file: UploadFile = File(...),
):
    """Upload and process a document (PDF/TXT) using RAG."""
    filename = file.filename or "unknown"
    ext = filename.lower().split(".")[-1]
    
    if ext not in ["pdf", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")

    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File must be smaller than 10MB")
        
    doc = await rag_service.upload_document(
        file_bytes=file_bytes,
        original_filename=filename,
        file_type=ext,
        file_size=file_size,
        user_id=current_user.id,
        db=db,
    )
    
    return {
        "id": doc.id,
        "filename": doc.filename,
        "original_filename": doc.original_filename,
        "file_type": doc.file_type,
        "file_size": doc.file_size,
        "chunks_count": doc.chunks_count,
        "status": doc.status,
        "created_at": doc.created_at,
        "message": f"Document uploaded successfully! {doc.chunks_count} chunks processed."
    }


@router.post("/ask", response_model=AskDocumentResponse)
async def ask_document(
    data: AskDocumentRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Ask a question based on uploaded documents."""
    result = await rag_service.ask_document(
        query=data.query,
        user_id=current_user.id,
        document_id=data.document_id,
        db=db,
    )
    return result


@router.get("/documents", response_model=DocumentListResponse)
async def get_documents(
    current_user: CurrentUser,
    db: DB,
):
    """Get all documents uploaded by the current user."""
    docs, total = await rag_service.get_user_documents(
        user_id=current_user.id,
        db=db,
    )
    return {"documents": docs, "total": total}


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """Delete a document from DB and ChromaDB."""
    await rag_service.delete_document(
        document_id=document_id,
        user_id=current_user.id,
        db=db,
    )
    return {"message": "Document deleted successfully"}
