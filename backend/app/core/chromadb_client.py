import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

# Create persistent ChromaDB client (stores on disk)
# This runs LOCALLY — no external service needed
def get_chroma_client() -> chromadb.ClientAPI:
    client = chromadb.PersistentClient(
        path=settings.CHROMA_PERSIST_DIR,
    )
    return client

# Singleton client instance
_chroma_client: chromadb.ClientAPI | None = None

def get_chroma_singleton() -> chromadb.ClientAPI:
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = get_chroma_client()
    return _chroma_client

def get_user_collection_name(user_id: str) -> str:
    # Each user gets their own isolated ChromaDB collection
    # Collection name must be alphanumeric + underscores only
    return f"user_{str(user_id).replace('-', '_')}_recipes"
