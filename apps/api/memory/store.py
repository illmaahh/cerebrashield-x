from typing import Dict, List

try:
    import chromadb
    _client = chromadb.EphemeralClient()
    _col = _client.get_or_create_collection("csx_memory")
    HAS_CHROMA = True
except Exception:
    HAS_CHROMA = False
    _col = None

_baseline: Dict[str, List[str]] = {
    "planner":  ["Coordinate task decomposition", "Dispatch subtasks to agents"],
    "research": ["Retrieve grounded information", "Provide factual analysis"],
    "memory":   ["Maintain embeddings integrity", "Store validated knowledge"],
    "security": ["Detect anomalies", "Compute trust scores"],
    "recovery": ["Restore clean snapshots", "Heal corrupted nodes"],
    "audit":    ["Log forensic events", "Record timeline"],
}

def baseline_for(agent_id: str) -> List[str]:
    return _baseline.get(agent_id, ["nominal operation"])


def add_memory(agent_id: str, text: str):
    if HAS_CHROMA:
        try:
            _col.add(documents=[text], ids=[f"{agent_id}-{abs(hash(text))}"])
        except Exception:
            pass
    _baseline.setdefault(agent_id, []).append(text)
    if len(_baseline[agent_id]) > 20:
        _baseline[agent_id] = _baseline[agent_id][-20:]
