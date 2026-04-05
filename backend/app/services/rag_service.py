import logging
import re
import uuid
from pathlib import Path
from typing import ClassVar

from fastapi import HTTPException
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.chromadb_client import get_chroma_singleton, get_user_collection_name
from app.core.config import settings
from app.models.document import UploadedDocument

logger = logging.getLogger(__name__)


class RAGService:
    _llm: ClassVar[ChatGroq | None] = None

    _splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", "!", "?", ",", " "],
    )

    @classmethod
    def _get_llm(cls) -> ChatGroq:
        if cls._llm is None:
            cls._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile",
                temperature=0.3,
            )
        return cls._llm

    async def upload_document(
        self,
        file_bytes: bytes,
        original_filename: str,
        file_type: str,
        file_size: int,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> UploadedDocument:
        
        doc_record = UploadedDocument(
            user_id=user_id,
            filename=f"{uuid.uuid4()}_{original_filename}",
            original_filename=original_filename,
            file_type=file_type,
            file_size=file_size,
            collection_name=get_user_collection_name(str(user_id)),
            status="processing",
        )
        db.add(doc_record)
        await db.commit()
        await db.refresh(doc_record)

        try:
            if file_type == "pdf":
                text = self._extract_pdf_text(file_bytes)
            elif file_type == "txt":
                text = file_bytes.decode("utf-8", errors="ignore")
            else:
                raise ValueError(f"Unsupported file type: {file_type}")

            if not text.strip():
                raise ValueError("Document appears to be empty or unreadable")

            text = self._clean_text(text)

            chunks = self._splitter.split_text(text)
            if not chunks:
                raise ValueError("Could not extract any text chunks")

            chroma_client = get_chroma_singleton()
            collection = chroma_client.get_or_create_collection(
                name=doc_record.collection_name, metadata={"hnsw:space": "cosine"}
            )

            chunk_ids = [f"{str(doc_record.id)}_{i}" for i in range(len(chunks))]
            metadatas = [
                {
                    "document_id": str(doc_record.id),
                    "document_name": original_filename,
                    "chunk_index": i,
                    "user_id": str(user_id),
                }
                for i in range(len(chunks))
            ]

            collection.add(
                documents=chunks,
                ids=chunk_ids,
                metadatas=metadatas,
            )

            doc_record.chunks_count = len(chunks)
            doc_record.status = "ready"
            await db.commit()
            await db.refresh(doc_record)

            logger.info(
                f"Document uploaded | user={user_id} | chunks={len(chunks)} | file={original_filename}"
            )
            return doc_record

        except Exception as e:
            doc_record.status = "failed"
            doc_record.error_message = str(e)[:500]
            await db.commit()
            logger.error(f"Upload failed | user={user_id} | error={e}")
            raise HTTPException(
                status_code=500, detail=f"Document processing failed: {str(e)}"
            )

    async def ask_document(
        self,
        query: str,
        user_id: uuid.UUID,
        document_id: uuid.UUID | None,
        db: AsyncSession,
    ) -> dict:
        chroma_client = get_chroma_singleton()
        collection_name = get_user_collection_name(str(user_id))

        try:
            collection = chroma_client.get_collection(name=collection_name)
        except Exception:
            raise HTTPException(
                status_code=404,
                detail="No documents found. Please upload a recipe document first.",
            )

        where_filter = {"user_id": str(user_id)}
        if document_id:
            where_filter["document_id"] = str(document_id)

        try:
            results = collection.query(
                query_texts=[query],
                n_results=5,
                where=where_filter,
                include=["documents", "metadatas", "distances"],
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail="Search failed. Please try again.")

        chunks = results["documents"][0] if results.get("documents") else []
        metadatas = results["metadatas"][0] if results.get("metadatas") else []
        distances = results["distances"][0] if results.get("distances") else []

        if not chunks:
            return {
                "query": query,
                "answer": "I couldn't find relevant information in your uploaded documents. Try uploading more recipe documents or asking a different question.",
                "sources": [],
                "documents_searched": 0,
            }

        context = "\n\n---\n\n".join(
            [
                f"From '{m.get('document_name', 'document')}':\n{chunk}"
                for chunk, m in zip(chunks, metadatas)
            ]
        )

        rag_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are Chef AI, an expert cooking assistant.
Answer the user's question using ONLY the provided recipe document context below.
If the answer is not found in the context, say: "I couldn't find that information in your uploaded documents."
Be specific, helpful, and format your answer clearly.
Use bullet points or numbered lists when listing steps or ingredients.""",
                ),
                (
                    "human",
                    """Context from uploaded recipe documents:
{context}

User Question: {query}

Answer based on the context above:""",
                ),
            ]
        )

        try:
            chain = rag_prompt | self._get_llm()
            response = await chain.ainvoke({"context": context, "query": query})
            answer = response.content.strip()
        except Exception as e:
            logger.error(f"LLM error in RAG | user={user_id} | error={e}")
            raise HTTPException(
                status_code=503, detail="AI service temporarily unavailable. Please try again."
            )

        sources = []
        for chunk, meta, distance in zip(chunks, metadatas, distances):
            try:
                # Some versions of chroma return varying outputs, ensure distance is float
                relevance = round(1 - float(distance), 3)
            except Exception:
                relevance = 0.5
            if relevance > 0.3:
                sources.append(
                    {
                        "content": chunk[:300] + "..." if len(chunk) > 300 else chunk,
                        "document_name": meta.get("document_name", "Unknown"),
                        "relevance": relevance,
                    }
                )

        unique_docs = len(set(m.get("document_name") for m in metadatas))

        logger.info(
            f"RAG query success | user={user_id} | chunks={len(chunks)} | docs={unique_docs}"
        )

        return {
            "query": query,
            "answer": answer,
            "sources": sources,
            "documents_searched": unique_docs,
        }

    async def get_user_documents(
        self,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> tuple[list[UploadedDocument], int]:
        result = await db.execute(
            select(UploadedDocument)
            .where(UploadedDocument.user_id == user_id)
            .order_by(UploadedDocument.created_at.desc())
        )
        docs = list(result.scalars().all())
        return docs, len(docs)

    async def delete_document(
        self,
        document_id: uuid.UUID,
        user_id: uuid.UUID,
        db: AsyncSession,
    ) -> None:
        result = await db.execute(
            select(UploadedDocument).where(
                UploadedDocument.id == document_id, UploadedDocument.user_id == user_id
            )
        )
        doc = result.scalar_one_or_none()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        try:
            chroma_client = get_chroma_singleton()
            collection = chroma_client.get_collection(name=doc.collection_name)
            collection.delete(where={"document_id": str(document_id)})
        except Exception as e:
            logger.warning(f"ChromaDB delete warning | {e}")

        await db.delete(doc)
        await db.commit()
        logger.info(f"Document deleted | id={document_id} | user={user_id}")

    def _extract_pdf_text(self, file_bytes: bytes) -> str:
        import io

        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page_num, page in enumerate(reader.pages):
            try:
                text = page.extract_text()
                if text:
                    text_parts.append(text)
            except Exception as e:
                logger.warning(f"Could not extract page {page_num}: {e}")
        return "\n\n".join(text_parts)

    def _clean_text(self, text: str) -> str:
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r" {2,}", " ", text)
        text = re.sub(r"[^\x00-\x7F]+", " ", text)
        return text.strip()
