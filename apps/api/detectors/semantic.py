import numpy as np
from typing import List

_model = None

def _get_model():
    global _model
    if _model is not None:
        return _model
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    except Exception:
        _model = False
    return _model


def _hash_embed(text: str, dim: int = 64) -> np.ndarray:
    vec = np.zeros(dim, dtype=np.float32)
    for i, ch in enumerate(text.encode("utf-8")):
        vec[(ch + i) % dim] += 1.0
    n = np.linalg.norm(vec)
    return vec / n if n > 0 else vec


def embed(text: str) -> np.ndarray:
    m = _get_model()
    if m:
        return m.encode(text, normalize_embeddings=True)
    return _hash_embed(text)


def semantic_drift(current: str, baseline: List[str]) -> float:
    if not baseline:
        return 0.0
    v = embed(current)
    base = np.stack([embed(b) for b in baseline])
    sims = base @ v
    return float(max(0.0, 1.0 - sims.max()))
