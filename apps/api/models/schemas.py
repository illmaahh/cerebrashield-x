from pydantic import BaseModel, Field
from typing import List, Dict, Literal, Optional
from datetime import datetime

AgentStatus = Literal["healthy", "suspect", "corrupted", "quarantined", "healing"]
AttackKind = Literal["prompt_injection", "memory_poisoning", "behavioral_drift", "autonomous_hijack"]
Phase = Literal["idle", "running", "under_attack", "detecting", "quarantine", "healing", "stable"]


class Agent(BaseModel):
    id: str
    role: str
    trust: float = 1.0
    status: AgentStatus = "healthy"
    position: List[float]


class Anomaly(BaseModel):
    agent_id: str
    score: float
    kind: str
    detail: str
    ts: float


class EventMsg(BaseModel):
    type: str
    payload: Dict
    ts: float


class AttackRequest(BaseModel):
    kind: AttackKind
    agent_id: Optional[str] = None
