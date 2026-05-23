from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, time, random
from ws_manager import manager
from agents.graph import build_graph
from simulator.attacks import attack_payload

router = APIRouter()
graph = build_graph()

AGENTS = [
    {"id": "planner",  "role": "Planner",  "position": [0, 3.2, 0]},
    {"id": "research", "role": "Research", "position": [3.2, 1.0, 0]},
    {"id": "memory",   "role": "Memory",   "position": [2.0, -2.6, 0]},
    {"id": "security", "role": "Security", "position": [-2.0, -2.6, 0]},
    {"id": "recovery", "role": "Recovery", "position": [-3.2, 1.0, 0]},
    {"id": "audit",    "role": "Audit",    "position": [0, 0, -3.0]},
]

def initial_state():
    return {
        "task": "monitor ecosystem",
        "messages": [],
        "trust": {a["id"]: 1.0 for a in AGENTS},
        "anomalies": [],
        "quarantined": [],
        "healed": [],
        "phase": "running",
        "audit_log": [],
    }

STATE = initial_state()
PENDING_ATTACKS = []


async def _ecosystem_loop():
    global STATE
    await manager.broadcast({"type": "agents", "payload": AGENTS})
    while True:
        try:
            while PENDING_ATTACKS:
                atk = PENDING_ATTACKS.pop(0)
                target = atk.get("agent_id") or random.choice(
                    [a["id"] for a in AGENTS if a["id"] != "security"]
                )
                payload = attack_payload(atk["kind"])
                STATE["messages"].append({"agent_id": target, "content": payload})
                STATE["phase"] = "under_attack"
                await manager.broadcast({
                    "type": "attack",
                    "payload": {"kind": atk["kind"], "agent_id": target, "payload": payload},
                })

            STATE["messages"] = STATE["messages"][-12:]
            STATE = await graph.ainvoke(STATE)

            statuses = {}
            for aid, trust in STATE["trust"].items():
                if aid in STATE["quarantined"] and aid in STATE.get("healed", []):
                    statuses[aid] = "healing"
                elif aid in STATE["quarantined"]:
                    statuses[aid] = "quarantined"
                elif trust < 0.45:
                    statuses[aid] = "corrupted"
                elif trust < 0.8:
                    statuses[aid] = "suspect"
                else:
                    statuses[aid] = "healthy"

            await manager.broadcast({
                "type": "tick",
                "payload": {
                    "trust": STATE["trust"],
                    "statuses": statuses,
                    "anomalies": STATE["anomalies"],
                    "phase": STATE["phase"],
                    "messages": STATE["messages"][-6:],
                },
            })

            if STATE["phase"] == "healing":
                STATE["phase"] = "stable"
                STATE["quarantined"] = []
                STATE["healed"] = []
                await manager.broadcast({"type": "stabilized", "payload": {}})

            await asyncio.sleep(2.0)
        except Exception as e:
            await manager.broadcast({"type": "error", "payload": {"message": str(e)}})
            await asyncio.sleep(2.0)


@router.websocket("/ws/ecosystem")
async def ecosystem_ws(ws: WebSocket):
    await manager.connect(ws)
    try:
        await ws.send_json({"type": "agents", "payload": AGENTS, "ts": time.time()})
        await ws.send_json({"type": "hello", "payload": {"msg": "Connected to CerebraShield X"}, "ts": time.time()})
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(ws)
    except Exception:
        await manager.disconnect(ws)


def queue_attack(kind: str, agent_id: str | None = None):
    PENDING_ATTACKS.append({"kind": kind, "agent_id": agent_id})


def get_loop_task():
    return _ecosystem_loop
