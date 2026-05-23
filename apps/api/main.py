import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes.ecosystem import router as eco_router, get_loop_task
from routes.attack import router as attack_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(get_loop_task()())
    try:
        yield
    finally:
        task.cancel()

app = FastAPI(title="CerebraShield X API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(eco_router)
app.include_router(attack_router)

@app.get("/")
def root():
    return {"service": "CerebraShield X", "status": "online", "use_llm": settings.USE_LLM}

@app.get("/health")
def health():
    return {"ok": True}
