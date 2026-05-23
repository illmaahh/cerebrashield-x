"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AgentDef, AgentStatus } from "@/lib/types";

interface NeuralLinksProps {
  agents: AgentDef[];
  statuses: Record<string, AgentStatus>;
  trust: Record<string, number>;
}

const STATUS_COLOR: Record<AgentStatus, string> = {
  healthy: "#00f5a0",
  suspect: "#fbbf24",
  corrupted: "#ef4444",
  quarantined: "#a855f7",
  healing: "#60a5fa",
};

export function NeuralLinks({ agents, statuses, trust }: NeuralLinksProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    // no per-frame update needed for static lines
  });

  const links = useMemo(() => {
    const pairs: Array<{ from: AgentDef; to: AgentDef }> = [];
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        pairs.push({ from: agents[i], to: agents[j] });
      }
    }
    return pairs;
  }, [agents]);

  return (
    <group ref={groupRef}>
      {links.map(({ from, to }) => {
        const fromStatus = statuses[from.id] ?? "healthy";
        const toStatus = statuses[to.id] ?? "healthy";
        const avgTrust = ((trust[from.id] ?? 1) + (trust[to.id] ?? 1)) / 2;

        // Use the "worse" status for color
        const worstStatus =
          fromStatus === "corrupted" || toStatus === "corrupted"
            ? "corrupted"
            : fromStatus === "quarantined" || toStatus === "quarantined"
            ? "quarantined"
            : fromStatus === "suspect" || toStatus === "suspect"
            ? "suspect"
            : "healthy";

        const color = STATUS_COLOR[worstStatus] ?? "#00f5a0";
        const opacity = avgTrust * 0.25;

        const start = new THREE.Vector3(...(from.position as [number, number, number]));
        const end = new THREE.Vector3(...(to.position as [number, number, number]));
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={`${from.id}-${to.id}`} geometry={geometry}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}
