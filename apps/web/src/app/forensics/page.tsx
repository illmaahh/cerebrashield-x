"use client";
import { useEcosystemSocket } from "@/hooks/useEcosystemSocket";
import { TopBar } from "@/components/hud/TopBar";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

const PHASE_COLOR: Record<string, string> = {
  idle: "#555",
  running: "#00f5a0",
  under_attack: "#ff5050",
  detecting: "#fbbf24",
  quarantine: "#a855f7",
  healing: "#60a5fa",
  stable: "#00f5a0",
};

export default function ForensicsPage() {
  useEcosystemSocket();
  const { forensicsLog, events } = useStore();

  const allEvents = [...events].reverse();

  return (
    <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse at center, #040f1a 0%, #020810 70%)" }}>
      <TopBar />
      <div className="pt-16 px-6 pb-4 h-full overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6 mt-4">

          <h2 className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">Forensic Timeline</h2>

          {/* Timeline */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">Phase Transition Log</h3>
            {forensicsLog.length === 0 ? (
              <p className="text-white/20 text-xs font-mono text-center py-8">No forensic entries yet — run an attack to generate data</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-4 pl-10">
                  {[...forensicsLog].reverse().map((entry, i) => {
                    const color = PHASE_COLOR[entry.phase] ?? "#555";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="relative"
                      >
                        <div
                          className="absolute -left-7 top-1.5 w-2.5 h-2.5 rounded-full border-2"
                          style={{ background: `${color}30`, borderColor: color }}
                        />
                        <div className="glass-panel rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-mono font-semibold" style={{ color }}>
                              {entry.phase.toUpperCase().replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] font-mono text-white/30">
                              {new Date(entry.ts * 1000).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-4 text-[10px] font-mono text-white/40">
                            <span>⚠ {entry.anomalies} anomal{entry.anomalies === 1 ? "y" : "ies"}</span>
                            {entry.quarantined.length > 0 && (
                              <span className="text-purple-400">⬡ quarantined: {entry.quarantined.join(", ")}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Full Event Log */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">
              Complete Event Log
              <span className="ml-2 text-white/20">{events.length} entries</span>
            </h3>
            <div className="space-y-px max-h-80 overflow-y-auto font-mono text-[11px]">
              {allEvents.length === 0 && <p className="text-white/20">No events yet</p>}
              {allEvents.map((e) => {
                const sevColor = e.severity === "critical" ? "#ff5050" : e.severity === "warn" ? "#fbbf24" : "#00f5a040";
                return (
                  <div key={e.id} className="flex items-start gap-3 py-1 border-b border-white/[0.03]">
                    <span className="text-white/20 w-20 flex-shrink-0">
                      {new Date(e.ts * 1000).toLocaleTimeString("en", { hour12: false })}
                    </span>
                    <span className="w-16 flex-shrink-0 text-white/30 uppercase">{e.type}</span>
                    <span style={{ color: sevColor }}>{e.message}</span>
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
