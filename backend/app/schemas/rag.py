from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UploadDocumentResponse(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    chunks_count: int
    status: str
    created_at: datetime
    message: str


class AskDocumentRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)
    document_id: Optional[UUID] = None


class SourceChunk(BaseModel):
    content: str
    document_name: str
    relevance: float


class AskDocumentResponse(BaseModel):
    query: str
    answer: str
    sources: list[SourceChunk]
    documents_searched: int


class DocumentOut(BaseModel):
    id: UUID
    original_filename: str
    file_type: str
    file_size: int
    chunks_count: int
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DocumentListResponse(BaseModel):
    documents: list[DocumentOut]
    total: int
