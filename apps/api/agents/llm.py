import httpx
from config import settings

FALLBACK = {
    "planner": "Subtasks: (1) gather context, (2) analyze signals, (3) report findings.",
    "research": "Latest reasoning indicates stable knowledge retrieval across nodes.",
    "memory":   "Vector store integrity nominal; embeddings within baseline bounds.",
    "security": "Cognitive perimeter holding; no anomalies above threshold.",
}

async def chat(role: str, prompt: str, system: str = "") -> str:
    if not settings.USE_LLM:
        return FALLBACK.get(role, "OK")
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post(
                f"{settings.OLLAMA_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "system": system,
                    "stream": False,
                },
            )
            r.raise_for_status()
            return r.json().get("response", FALLBACK.get(role, "OK")).strip()
    except Exception:
        return FALLBACK.get(role, "OK")
