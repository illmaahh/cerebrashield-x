import { useStore } from "./store";
import type { TickPayload, AttackEvent, AgentDef } from "./types";

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

export function connectWS(url: string) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(url);
  const store = useStore.getState();

  socket.onopen = () => {
    store.setConnected(true);
    store.pushEvent({ ts: Date.now() / 1000, type: "system", message: "WebSocket connected", severity: "info" });
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  socket.onclose = () => {
    store.setConnected(false);
    store.pushEvent({ ts: Date.now() / 1000, type: "system", message: "WebSocket disconnected — reconnecting…", severity: "warn" });
    reconnectTimer = setTimeout(() => connectWS(url), 3000);
  };

  socket.onerror = () => {
    store.pushEvent({ ts: Date.now() / 1000, type: "system", message: "WebSocket error", severity: "critical" });
  };

  socket.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      handleMessage(msg);
    } catch {}
  };
}

function handleMessage(msg: { type: string; payload: unknown; ts?: number }) {
  const store = useStore.getState();
  const ts = msg.ts ?? Date.now() / 1000;

  switch (msg.type) {
    case "agents":
      store.setAgents(msg.payload as AgentDef[]);
      break;
    case "tick": {
      const p = msg.payload as TickPayload;
      store.applyTick(p);
      if (p.anomalies.length > 0) {
        p.anomalies.forEach((a) => {
          store.pushEvent({
            ts,
            type: "anomaly",
            message: `[${a.agent_id.toUpperCase()}] ${a.kind} — score ${a.score.toFixed(3)}`,
            severity: a.score >= 0.72 ? "critical" : "warn",
          });
        });
      }
      break;
    }
    case "attack": {
      const p = msg.payload as AttackEvent;
      store.setLastAttack(p);
      store.pushEvent({
        ts,
        type: "attack",
        message: `ATTACK: ${p.kind} → ${p.agent_id}`,
        severity: "critical",
      });
      break;
    }
    case "stabilized":
      store.pushEvent({ ts, type: "heal", message: "System stabilized — quarantine lifted", severity: "info" });
      break;
    case "error":
      store.pushEvent({ ts, type: "error", message: (msg.payload as { message: string }).message, severity: "critical" });
      break;
  }
}

export function disconnectWS() {
  socket?.close();
  socket = null;
}
