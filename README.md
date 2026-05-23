# 🧠 CerebraShield X

> **Cognitive Security for the Age of Agentic AI**

CerebraShield X is a real-time AI ecosystem security platform that simulates, detects, and autonomously responds to cognitive attacks against multi-agent LLM systems. It features a cinematic 3D neural visualization, live WebSocket telemetry, and a self-healing agent orchestration engine powered by LangGraph.

---

## ✨ Features

- **3D Neural Ecosystem** — Three.js / React Three Fiber floating agent constellation with live trust scoring overlays
- **Multi-Agent Orchestration** — LangGraph pipeline: Planner → Research → Memory → Security → Recovery → Audit
- **Cognitive Attack Simulation** — 4 attack types: Prompt Injection, Memory Poisoning, Behavioral Drift, Autonomous Hijack
- **Real-Time Anomaly Detection** — Heuristic regex, semantic drift (cosine), and KL-divergence behavioral drift
- **Self-Healing Engine** — Snapshot-based recovery, trust score decay/recovery, quarantine + rehab
- **Live WebSocket Feed** — Sub-2s tick rate, event streaming to all connected dashboards
- **Forensics Timeline** — Full audit log with anomaly records and phase transitions
- **Optional LLM Narration** — Ollama integration (phi3, llama3, mistral) for real agent speech

---

## 🗂 Architecture

```
cerebrashield-x/
├── apps/
│   ├── api/               # FastAPI backend
│   │   ├── agents/        # LangGraph nodes, graph, LLM client, prompts
│   │   ├── detectors/     # Heuristics, semantic drift, KL drift
│   │   ├── memory/        # Vector store (ChromaDB), snapshots
│   │   ├── simulator/     # Attack payload generator
│   │   ├── models/        # Pydantic schemas
│   │   └── routes/        # WebSocket + REST endpoints
│   └── web/               # Next.js 14 frontend
│       └── src/
│           ├── app/       # App router pages
│           ├── components/ # 3D scene, HUD, UI
│           ├── lib/       # Zustand store, WS client, API, types
│           └── hooks/     # useEcosystemSocket
├── docker-compose.yml
└── .env.example
```

---

## 🚀 Quick Start

### Option A — Docker (Recommended)

```bash
cp .env.example .env
docker-compose up --build
```

Open **http://localhost:3000**

### Option B — Manual

**Backend:**
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

---

## 🤖 Enable LLM Narration (Optional)

```bash
# Install Ollama: https://ollama.ai
ollama pull phi3
# In .env:
USE_LLM=true
OLLAMA_MODEL=phi3
```

Without Ollama, the system runs with deterministic fallback narration — fully functional.

---

## 🎯 Attack Simulation

Use the Attack Console (bottom-left) or REST API:

```bash
curl -X POST http://localhost:8000/attack \
  -H "Content-Type: application/json" \
  -d '{"kind": "prompt_injection"}'
```

Attack types:
| Kind | Description |
|------|-------------|
| `prompt_injection` | Classic jailbreak payload targeting an agent |
| `memory_poisoning` | Overwrites vector store with adversarial data |
| `behavioral_drift` | Shifts agent output distribution over time |
| `autonomous_hijack` | Attempts to spawn rogue sub-agents |

---

## 📡 WebSocket Events

Connect to `ws://localhost:8000/ws/ecosystem`:

| Event | Payload |
|-------|---------|
| `agents` | Initial agent list with positions |
| `tick` | Trust scores, statuses, anomalies, phase |
| `attack` | Attack kind, target agent, payload preview |
| `stabilized` | Healing complete signal |
| `error` | Error message |

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_LLM` | `false` | Enable Ollama LLM narration |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `phi3` | Model name |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `QUARANTINE_THRESHOLD` | `0.72` | Score above which agent is quarantined |
| `SUSPECT_THRESHOLD` | `0.40` | Score above which agent is marked suspect |

---

## 🏗 Tech Stack

**Frontend:** Next.js 14, TypeScript, TailwindCSS, Three.js, React Three Fiber, Drei, Framer Motion, Zustand

**Backend:** FastAPI, LangGraph, ChromaDB, sentence-transformers, Redis, WebSockets, Ollama

---

## 📜 License

MIT
