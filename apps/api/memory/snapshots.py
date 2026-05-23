from typing import Dict, List
import time, copy

_snapshots: Dict[str, List[dict]] = {}


def take_snapshot(agent_id: str, state: dict):
    _snapshots.setdefault(agent_id, []).append({
        "ts": time.time(),
        "state": copy.deepcopy(state),
    })
    if len(_snapshots[agent_id]) > 10:
        _snapshots[agent_id] = _snapshots[agent_id][-10:]


def latest_clean(agent_id: str) -> dict | None:
    snaps = _snapshots.get(agent_id, [])
    return snaps[0]["state"] if snaps else None
