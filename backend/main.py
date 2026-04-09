from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_tables
from app.routers import auth, chat, recipe, rag, favorite, grocery, recommendation
from app.core.config import settings

import logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting Chef AI in {settings.ENVIRONMENT} mode")
    await create_tables()
    logger.info("Database tables ready")
    yield
    logger.info("Shutting down Chef AI")


app = FastAPI(
    title="Chef AI API",
    description="AI-Powered Cooking Assistant Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Parse comma-separated origins from env
allowed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip()
]

# Always include localhost for development
if settings.ENVIRONMENT == "development":
    allowed_origins.extend([
        "http://localhost:5173",
        "http://localhost:3000",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(recipe.router)
app.include_router(rag.router)
app.include_router(favorite.router)
app.include_router(grocery.router)
app.include_router(recommendation.router)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "service": "Chef AI Backend",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {"status": "ok", "service": "Chef AI Backend"}
