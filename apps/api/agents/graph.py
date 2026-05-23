from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict
from .nodes import planner_node, research_node, memory_node, security_node, recovery_node, audit_node


class EcoState(TypedDict, total=False):
    task: str
    messages: List[dict]
    trust: Dict[str, float]
    anomalies: List[dict]
    quarantined: List[str]
    healed: List[str]
    phase: str
    audit_log: List[dict]


def _route(state: EcoState) -> str:
    if any(a["score"] >= 0.72 for a in state.get("anomalies", [])):
        return "recovery"
    return "audit"


def build_graph():
    g = StateGraph(EcoState)
    g.add_node("planner", planner_node)
    g.add_node("research", research_node)
    g.add_node("memory", memory_node)
    g.add_node("security", security_node)
    g.add_node("recovery", recovery_node)
    g.add_node("audit", audit_node)

    g.set_entry_point("planner")
    g.add_edge("planner", "research")
    g.add_edge("research", "memory")
    g.add_edge("memory", "security")
    g.add_conditional_edges("security", _route, {"recovery": "recovery", "audit": "audit"})
    g.add_edge("recovery", "audit")
    g.add_edge("audit", END)
    return g.compile()
