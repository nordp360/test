# Future annotations disabled - causes Pydantic ForwardRef issues

import logging

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.pii import sanitize_pii
from app.core.config import settings
from app.services.context_store import ContextStore
from app.services.gemini import GeminiService


router = APIRouter()

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

_context_store = ContextStore(settings.redis_url)
_gemini = GeminiService(settings.gemini_api_key)
_logger = logging.getLogger(__name__)


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=20000)
    session_id: str = Field(default="default", min_length=1, max_length=128)


class GenerateResponse(BaseModel):
    text: str


@router.post("/generate", response_model=GenerateResponse)
@limiter.limit("10/minute")
async def generate(req: GenerateRequest, request: Request) -> GenerateResponse:
    try:
        sanitized = sanitize_pii(req.prompt)
        context = _context_store.get_last_messages(req.session_id, limit=5)
        text = _gemini.generate(sanitized, context=context)
        _context_store.append_message(req.session_id, role="user", text=sanitized, keep_last=10)
        _context_store.append_message(req.session_id, role="model", text=text, keep_last=10)
        return GenerateResponse(text=text)
    except Exception as e:
        _logger.exception("AI generation failed")
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {type(e).__name__}: {e}",
        ) from e
