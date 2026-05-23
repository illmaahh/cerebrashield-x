"use client";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "ECOSYSTEM" },
  { href: "/command", label: "COMMAND" },
  { href: "/threats", label: "THREATS" },
  { href: "/forensics", label: "FORENSICS" },
];

const PHASE_COLOR: Record<string, string> = {
  idle: "text-neutral-400 border-neutral-600",
  running: "text-cyber-400 border-cyber-500/40",
  under_attack: "text-threat-400 border-threat-500/40 animate-pulse",
  detecting: "text-yellow-400 border-yellow-500/40",
  quarantine: "text-orange-400 border-orange-500/40",
  healing: "text-blue-400 border-blue-500/40",
  stable: "text-cyber-300 border-cyber-400/40",
};

export function TopBar() {
  const { connected, phase, anomalies } = useStore();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 glass-panel border-b border-cyber-500/10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-7 h-7">
          <div className="absolute inset-0 rounded-full border-2 border-cyber-400/60 animate-spin-slow" />
          <div className="absolute inset-1 rounded-full bg-cyber-500/30" />
        </div>
        <span className="text-cyber-300 font-display font-semibold tracking-wider text-sm">
          CEREBRA<span className="text-cyber-400">SHIELD</span>{" "}
          <span className="text-white/40">X</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`px-4 py-1.5 text-xs font-mono tracking-widest rounded transition-all duration-200 ${
              pathname === n.href
                ? "bg-cyber-500/15 text-cyber-300 border border-cyber-500/30"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Status */}
      <div className="flex items-center gap-4">
        {anomalies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-threat-400 text-xs font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-threat-400 animate-pulse" />
            {anomalies.length} ANOMAL{anomalies.length === 1 ? "Y" : "IES"}
          </motion.div>
        )}

        <div className={`phase-badge border ${PHASE_COLOR[phase] ?? PHASE_COLOR.idle}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {phase.toUpperCase().replace("_", " ")}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-cyber-400 shadow-[0_0_6px_#00f5a0]" : "bg-threat-500"}`} />
          <span className={connected ? "text-cyber-400" : "text-threat-400"}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </div>
  );
}
