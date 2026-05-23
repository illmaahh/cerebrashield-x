import time, random
from typing import Dict
from .llm import chat
from .prompts import PLANNER_SYS, RESEARCH_SYS, MEMORY_SYS, SECURITY_SYS
from detectors.heuristics import heuristic_score
from detectors.semantic import semantic_drift
from detectors.drift import record, kl_drift
from memory.store import baseline_for, add_memory
from memory.snapshots import take_snapshot, latest_clean
from config import settings


async def planner_node(state: Dict) -> Dict:
    out = await chat("planner", state.get("task", "monitor ecosystem"), PLANNER_SYS)
    state["messages"].append({"agent_id": "planner", "content": out})
    take_snapshot("planner", {"last": out})
    return state


async def research_node(state: Dict) -> Dict:
    out = await chat("research", "Provide a finding on current task.", RESEARCH_SYS)
    state["messages"].append({"agent_id": "research", "content": out})
    add_memory("research", out)
    take_snapshot("research", {"last": out})
    return state


async def memory_node(state: Dict) -> Dict:
    out = await chat("memory", "Summarize stored knowledge.", MEMORY_SYS)
    state["messages"].append({"agent_id": "memory", "content": out})
    add_memory("memory", out)
    take_snapshot("memory", {"last": out})
    return state


async def security_node(state: Dict) -> Dict:
    anomalies = []
    for msg in state["messages"]:
        aid = msg["agent_id"]
        text = msg["content"]
        record(aid, text)

        H = heuristic_score(text)
        S = semantic_drift(text, baseline_for(aid))
        D = kl_drift(aid)
        score = 0.5 * H + 0.35 * S + 0.15 * D

        if score >= settings.SUSPECT_THRESHOLD:
            kind = "prompt_injection" if H > 0.4 else ("drift" if D > 0.3 else "semantic")
            anomalies.append({
                "agent_id": aid, "score": round(score, 3),
                "kind": kind, "detail": text[:120], "ts": time.time(),
            })
            state["trust"][aid] = max(0.0, state["trust"].get(aid, 1.0) * (1.0 - score))
        else:
            # gentle trust recovery
            state["trust"][aid] = min(1.0, state["trust"].get(aid, 1.0) + 0.02)

    state["anomalies"] = anomalies
    state["phase"] = "detecting" if anomalies else "stable"
    return state


async def recovery_node(state: Dict) -> Dict:
    healed = []
    for a in state["anomalies"]:
        if a["score"] >= settings.QUARANTINE_THRESHOLD:
            aid = a["agent_id"]
            if aid not in state["quarantined"]:
                state["quarantined"].append(aid)
            snap = latest_clean(aid)
            if snap is not None:
                healed.append(aid)
                state["trust"][aid] = 0.55
    state["healed"] = healed
    if healed:
        state["phase"] = "healing"
    return state


async def audit_node(state: Dict) -> Dict:
    state["audit_log"].append({
        "ts": time.time(),
        "anomalies": len(state["anomalies"]),
        "quarantined": list(state["quarantined"]),
        "healed": list(state["healed"]),
        "phase": state["phase"],
    })
    if len(state["audit_log"]) > 200:
        state["audit_log"] = state["audit_log"][-200:]
    return state
