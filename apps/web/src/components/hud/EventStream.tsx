"use client";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const SEV_COLOR: Record<string, string> = {
  info: "text-cyber-400/70",
  warn: "text-yellow-400/80",
  critical: "text-threat-400",
};

const TYPE_ICON: Record<string, string> = {
  system: "◈",
  anomaly: "⚠",
  attack: "☠",
  heal: "✦",
  error: "✕",
};

function ts(t: number) {
  return new Date(t * 1000).toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function EventStream() {
  const { events } = useStore();

  return (
    <div className="glass-panel rounded-xl p-4 w-[420px] h-52 flex flex-col">
      <h3 className="text-xs font-mono text-white/40 tracking-widest uppercase mb-3 flex-shrink-0">
        Live Event Stream
      </h3>
      <div className="flex-1 overflow-y-auto space-y-0.5 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {events.slice(0, 40).map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 py-0.5"
            >
              <span className="text-white/20 flex-shrink-0 w-16">{ts(e.ts)}</span>
              <span className={`flex-shrink-0 ${SEV_COLOR[e.severity]}`}>
                {TYPE_ICON[e.type] ?? "·"}
              </span>
              <span className={SEV_COLOR[e.severity]}>{e.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <p className="text-white/20 text-[11px]">Waiting for events…</p>
        )}
      </div>
    </div>
  );
}
