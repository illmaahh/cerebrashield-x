import { create } from "zustand";
import type { AgentDef, Anomaly, AgentStatus, Phase, AttackKind } from "./types";

interface EventEntry {
  id: string;
  ts: number;
  type: string;
  message: string;
  severity: "info" | "warn" | "critical";
}

interface EcosystemStore {
  // Connection
  connected: boolean;
  setConnected: (v: boolean) => void;

  // Agents
  agents: AgentDef[];
  setAgents: (a: AgentDef[]) => void;

  // Live state
  trust: Record<string, number>;
  statuses: Record<string, AgentStatus>;
  anomalies: Anomaly[];
  phase: Phase;
  messages: Array<{ agent_id: string; content: string }>;

  applyTick: (payload: {
    trust: Record<string, number>;
    statuses: Record<string, AgentStatus>;
    anomalies: Anomaly[];
    phase: Phase;
    messages: Array<{ agent_id: string; content: string }>;
  }) => void;

  // Events
  events: EventEntry[];
  pushEvent: (e: Omit<EventEntry, "id">) => void;

  // Attack
  lastAttack: { kind: AttackKind; agent_id: string; payload: string } | null;
  setLastAttack: (a: { kind: AttackKind; agent_id: string; payload: string } | null) => void;

  // Forensics
  forensicsLog: Array<{ ts: number; anomalies: number; quarantined: string[]; phase: Phase }>;
  pushForensics: (entry: { ts: number; anomalies: number; quarantined: string[]; phase: Phase }) => void;
}

export const useStore = create<EcosystemStore>((set) => ({
  connected: false,
  setConnected: (v) => set({ connected: v }),

  agents: [],
  setAgents: (agents) => set({ agents }),

  trust: {},
  statuses: {},
  anomalies: [],
  phase: "idle",
  messages: [],

  applyTick: (payload) =>
    set((s) => ({
      trust: payload.trust,
      statuses: payload.statuses,
      anomalies: payload.anomalies,
      phase: payload.phase,
      messages: payload.messages,
      forensicsLog: payload.anomalies.length > 0
        ? [
            ...s.forensicsLog.slice(-199),
            {
              ts: Date.now() / 1000,
              anomalies: payload.anomalies.length,
              quarantined: Object.entries(payload.statuses)
                .filter(([, v]) => v === "quarantined")
                .map(([k]) => k),
              phase: payload.phase,
            },
          ]
        : s.forensicsLog,
    })),

  events: [],
  pushEvent: (e) =>
    set((s) => ({
      events: [
        { ...e, id: `${Date.now()}-${Math.random()}` },
        ...s.events.slice(0, 99),
      ],
    })),

  lastAttack: null,
  setLastAttack: (a) => set({ lastAttack: a }),

  forensicsLog: [],
  pushForensics: (entry) =>
    set((s) => ({ forensicsLog: [...s.forensicsLog.slice(-199), entry] })),
}));
