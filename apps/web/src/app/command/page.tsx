"use client";
import { useEcosystemSocket } from "@/hooks/useEcosystemSocket";
import { TopBar } from "@/components/hud/TopBar";
import { AttackConsole } from "@/components/hud/AttackConsole";
import { TrustPanel } from "@/components/hud/TrustPanel";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function CommandPage() {
  useEcosystemSocket();
  const { agents, trust, statuses, phase, anomalies, messages } = useStore();

  return (
    <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse at center, #040f1a 0%, #020810 70%)" }}>
      <TopBar />
      <div className="pt-16 px-6 pb-4 h-full overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6 mt-4">

          <h2 className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">Command Center</h2>

          {/* Agent Grid */}
          <div className="grid grid-cols-3 gap-4">
            {agents.map((agent) => {
              const t = trust[agent.id] ?? 1;
              const s = statuses[agent.id] ?? "healthy";
              const color = s === "healthy" ? "#00f5a0" : s === "suspect" ? "#fbbf24" : s === "corrupted" ? "#ef4444" : s === "quarantined" ? "#a855f7" : "#60a5fa";
              return (
                <motion.div
                  key={agent.id}
                  className="glass-panel rounded-xl p-4 space-y-3"
                  style={{ borderColor: `${color}25` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold" style={{ color }}>{agent.role.toUpperCase()}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                      {s.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1">
                      <span>TRUST</span>
                      <span style={{ color }}>{(t * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${t * 100}%` }}
                        transition={{ duration: 0.6 }}
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/20">
                    ID: {agent.id} · pos ({agent.position.map((v: number) => v.toFixed(1)).join(", ")})
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Messages */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Agent Message Bus</h3>
            <div className="space-y-2">
              {messages.length === 0 && <p className="text-white/20 text-xs font-mono">No messages yet…</p>}
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3 text-xs font-mono border-b border-white/5 pb-2">
                  <span className="text-cyber-400/60 flex-shrink-0 uppercase w-20">{m.agent_id}</span>
                  <span className="text-white/50 truncate">{m.content}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
