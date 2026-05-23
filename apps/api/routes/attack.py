from fastapi import APIRouter, HTTPException
from models.schemas import AttackRequest
from routes.ecosystem import queue_attack

router = APIRouter()

@router.post("/attack")
async def trigger_attack(req: AttackRequest):
    if req.kind not in {"prompt_injection", "memory_poisoning", "behavioral_drift", "autonomous_hijack"}:
        raise HTTPException(400, "Invalid attack kind")
    queue_attack(req.kind, req.agent_id)
    return {"ok": True, "queued": req.kind, "target": req.agent_id or "auto"}
