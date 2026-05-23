export type AgentStatus = "healthy" | "suspect" | "corrupted" | "quarantined" | "healing";
export type AttackKind = "prompt_injection" | "memory_poisoning" | "behavioral_drift" | "autonomous_hijack";
export type Phase = "idle" | "running" | "under_attack" | "detecting" | "quarantine" | "healing" | "stable";

export interface AgentDef {
  id: string;
  role: string;
  position: [number, number, number];
}

export interface Anomaly {
  agent_id: string;
  score: number;
  kind: string;
  detail: string;
  ts: number;
}

export interface TickPayload {
  trust: Record<string, number>;
  statuses: Record<string, AgentStatus>;
  anomalies: Anomaly[];
  phase: Phase;
  messages: Array<{ agent_id: string; content: string }>;
}

export interface AttackEvent {
  kind: AttackKind;
  agent_id: string;
  payload: string;
}

export interface WSEvent {
  type: string;
  payload: unknown;
  ts: number;
}
