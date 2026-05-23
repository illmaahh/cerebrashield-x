"use client";
import { useEcosystemSocket } from "@/hooks/useEcosystemSocket";
import { TopBar } from "@/components/hud/TopBar";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const KIND_COLOR: Record<string, string> = {
  prompt_injection: "#ff5050",
  memory_poisoning: "#f97316",
  behavioral_drift: "#a855f7",
  autonomous_hijack: "#ec4899",
  semantic: "#fbbf24",
  drift: "#60a5fa",
};

const KIND_ICON: Record<string, string> = {
  prompt_injection: "⚡",
  memory_poisoning: "☠",
  behavioral_drift: "〜",
  autonomous_hijack: "⬡",
  semantic: "◈",
  drift: "≋",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 0.72 ? "#ff5050" : score >= 0.4 ? "#fbbf24" : "#00f5a0";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{ background: color }}
        />
      </div>
      <span className="text-[11px] font-mono w-10 text-right" style={{ color }}>
        {score.toFixed(3)}
      </span>
    </div>
  );
}

export default function ThreatsPage() {
  useEcosystemSocket();
  const { anomalies, events, phase, statuses } = useStore();

  const threatEvents = events.filter((e) => e.type === "anomaly" || e.type === "attack");

  return (
    <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse at center, #040f1a 0%, #020810 70%)" }}>
      <TopBar />
      <div className="pt-16 px-6 pb-4 h-full overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6 mt-4">

          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">Threat Intelligence</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-white/30">
              <span className="w-2 h-2 rounded-full bg-threat-400 animate-pulse" />
              {anomalies.length} active anomal{anomalies.length === 1 ? "y" : "ies"}
            </div>
          </div>

          {/* Active Anomalies */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Active Anomalies</h3>
            <AnimatePresence>
              {anomalies.length === 0 ? (
                <p className="text-white/20 text-xs font-mono py-4 text-center">No active anomalies — system nominal</p>
              ) : (
                anomalies.map((a, i) => {
                  const color = KIND_COLOR[a.kind] ?? "#ff5050";
                  const icon = KIND_ICON[a.kind] ?? "⚠";
                  return (
                    <motion.div
                      key={`${a.agent_id}-${a.ts}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-3 p-3 rounded-lg border"
                      style={{ borderColor: `${color}30`, background: `${color}08` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ color }}>{icon}</span>
                          <span className="text-sm font-mono font-semibold" style={{ color }}>
                            {a.kind.toUpperCase().replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-mono text-white/40">→ {a.agent_id}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/30">
                          {new Date(a.ts * 1000).toLocaleTimeString()}
                        </span>
                      </div>
                      <ScoreBar score={a.score} />
                      <p className="mt-2 text-[11px] font-mono text-white/40 truncate">{a.detail}</p>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Threat History */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Threat History</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {threatEvents.length === 0 && <p className="text-white/20 text-xs font-mono">No threat events yet</p>}
              {threatEvents.map((e) => {
                const isAttack = e.type === "attack";
                return (
                  <div key={e.id} className="flex items-start gap-3 py-1.5 border-b border-white/5">
                    <span className="text-[10px] font-mono text-white/20 w-20 flex-shrink-0">
                      {new Date(e.ts * 1000).toLocaleTimeString()}
                    </span>
                    <span className={`text-[11px] font-mono ${isAttack ? "text-threat-400" : "text-yellow-400/80"}`}>
                      {isAttack ? "☠" : "⚠"} {e.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Risk Summary */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Agent Risk Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(statuses).map(([id, status]) => {
                const color = status === "healthy" ? "#00f5a0" : status === "suspect" ? "#fbbf24" : status === "corrupted" ? "#ef4444" : status === "quarantined" ? "#a855f7" : "#60a5fa";
                return (
                  <div key={id} className="flex items-center justify-between px-3 py-2 rounded border" style={{ borderColor: `${color}25` }}>
                    <span className="text-xs font-mono text-white/50 uppercase">{id}</span>
                    <span className="text-[10px] font-mono" style={{ color }}>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
