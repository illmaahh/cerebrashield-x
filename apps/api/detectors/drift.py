from collections import defaultdict, deque
import math

_history = defaultdict(lambda: deque(maxlen=20))

def record(agent_id: str, text: str):
    _history[agent_id].append(text)


def _token_dist(texts):
    counts = {}
    total = 0
    for t in texts:
        for tok in t.lower().split():
            counts[tok] = counts.get(tok, 0) + 1
            total += 1
    return {k: v / total for k, v in counts.items()} if total else {}


def kl_drift(agent_id: str) -> float:
    h = list(_history[agent_id])
    if len(h) < 4:
        return 0.0
    mid = len(h) // 2
    p = _token_dist(h[:mid])
    q = _token_dist(h[mid:])
    keys = set(p) | set(q)
    eps = 1e-6
    kl = 0.0
    for k in keys:
        pv = p.get(k, eps)
        qv = q.get(k, eps)
        kl += pv * math.log(pv / qv)
    return float(min(1.0, max(0.0, kl / 4.0)))
