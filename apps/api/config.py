import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3")
    USE_LLM = os.getenv("USE_LLM", "false").lower() == "true"
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    QUARANTINE_THRESHOLD = float(os.getenv("QUARANTINE_THRESHOLD", "0.72"))
    SUSPECT_THRESHOLD = float(os.getenv("SUSPECT_THRESHOLD", "0.40"))

settings = Settings()
