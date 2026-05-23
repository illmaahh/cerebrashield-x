"use client";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS: Record<string, { label: string; color: string; bg: string }> = {
  under_attack: { label: "⚡ COGNITIVE ATTACK DETECTED", color: "#ff3030", bg: "rgba(255,30,30,0.1)" },
  detecting: { label: "🔍 ANOMALY ANALYSIS IN PROGRESS", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  healing: { label: "✦ SELF-HEALING INITIATED", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  stable: { label: "✓ SYSTEM STABILIZED", color: "#00f5a0", bg: "rgba(0,245,160,0.1)" },
};

export function PhaseBanner() {
  const { phase } = useStore();
  const banner = BANNERS[phase];

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -20, scaleX: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-8 py-2.5 rounded-full border font-mono text-sm font-semibold tracking-wider"
          style={{
            color: banner.color,
            background: banner.bg,
            borderColor: `${banner.color}40`,
            boxShadow: `0 0 30px ${banner.color}30`,
          }}
        >
          {banner.label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
