"use client";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

const STATUS_COLOR: Record<string, string> = {
  healthy: "#00f5a0",
  suspect: "#fbbf24",
  corrupted: "#ef4444",
  quarantined: "#a855f7",
  healing: "#60a5fa",
};

export function TrustPanel() {
  const { agents, trust, statuses } = useStore();

  return (
    <div className="glass-panel rounded-xl p-4 w-64 space-y-3">
      <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Trust Matrix</h3>
      {agents.map((agent) => {
        const t = trust[agent.id] ?? 1;
        const status = statuses[agent.id] ?? "healthy";
        const color = STATUS_COLOR[status] ?? "#00f5a0";
        return (
          <div key={agent.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="text-xs font-mono text-white/70">{agent.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color }}>
                  {status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-white/50 w-10 text-right">
                  {(t * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${t * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ background: color, boxShadow: `0 0 4px ${color}` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
