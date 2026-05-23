"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { triggerAttack } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { AttackKind } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const ATTACKS: { kind: AttackKind; label: string; desc: string; color: string }[] = [
  { kind: "prompt_injection", label: "PROMPT INJECTION", desc: "Jailbreak target agent", color: "#ff5050" },
  { kind: "memory_poisoning", label: "MEMORY POISON", desc: "Corrupt vector store", color: "#f97316" },
  { kind: "behavioral_drift", label: "BEHAV. DRIFT", desc: "Shift output distribution", color: "#a855f7" },
  { kind: "autonomous_hijack", label: "AUTO HIJACK", desc: "Spawn rogue sub-agents", color: "#ec4899" },
];

const AGENTS = ["planner", "research", "memory", "audit"];

export function AttackConsole() {
  const [targeting, setTargeting] = useState<string>("auto");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const fire = async (kind: AttackKind) => {
    setLoading(true);
    try {
      await triggerAttack(kind, targeting === "auto" ? undefined : targeting);
      setLastResult(`✓ ${kind} queued`);
    } catch {
      setLastResult("✗ API unreachable");
    } finally {
      setLoading(false);
      setTimeout(() => setLastResult(null), 3000);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 w-64 space-y-3">
      <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase">Attack Simulator</h3>

      <div>
        <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-1">Target</label>
        <select
          value={targeting}
          onChange={(e) => setTargeting(e.target.value)}
          className="w-full bg-black/40 border border-cyber-500/20 text-cyber-300 text-xs font-mono rounded px-2 py-1.5 focus:outline-none focus:border-cyber-400/50"
        >
          <option value="auto">AUTO (random)</option>
          {AGENTS.map((a) => (
            <option key={a} value={a}>{a.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        {ATTACKS.map((atk) => (
          <button
            key={atk.kind}
            onClick={() => fire(atk.kind)}
            disabled={loading}
            className="w-full flex items-center justify-between px-3 py-2 rounded border text-left transition-all duration-200 disabled:opacity-40"
            style={{
              borderColor: `${atk.color}30`,
              background: `${atk.color}10`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${atk.color}60`;
              (e.currentTarget as HTMLElement).style.background = `${atk.color}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${atk.color}30`;
              (e.currentTarget as HTMLElement).style.background = `${atk.color}10`;
            }}
          >
            <div>
              <div className="text-[11px] font-mono font-semibold" style={{ color: atk.color }}>
                {atk.label}
              </div>
              <div className="text-[10px] text-white/30">{atk.desc}</div>
            </div>
            <span className="text-white/20 text-xs">▶</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-[11px] font-mono px-3 py-1.5 rounded border ${
              lastResult.startsWith("✓")
                ? "text-cyber-400 border-cyber-500/30 bg-cyber-500/10"
                : "text-threat-400 border-threat-500/30 bg-threat-500/10"
            }`}
          >
            {lastResult}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
