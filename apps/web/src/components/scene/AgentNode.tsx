"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import type { AgentDef, AgentStatus } from "@/lib/types";

interface AgentNodeProps {
  agent: AgentDef;
  trust: number;
  status: AgentStatus;
}

const STATUS_COLOR: Record<AgentStatus, string> = {
  healthy: "#00f5a0",
  suspect: "#fbbf24",
  corrupted: "#ef4444",
  quarantined: "#a855f7",
  healing: "#60a5fa",
};

export function AgentNode({ agent, trust, status }: AgentNodeProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const color = STATUS_COLOR[status] ?? "#00f5a0";
  const isWarning = status !== "healthy";

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * (isWarning ? 1.5 : 0.5);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      const s = 1 + Math.sin(Date.now() * 0.003 + agent.id.length) * 0.04;
      ringRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={agent.position as [number, number, number]}>
      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isWarning ? 1.5 : 0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Core node */}
      <mesh
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isWarning ? 1.0 : 0.4}
          wireframe={status === "corrupted"}
        />
      </mesh>

      {/* Glow */}
      <pointLight color={color} intensity={isWarning ? 1.2 : 0.4} distance={2.5} />

      {/* Label */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div
            style={{
              color,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textShadow: `0 0 8px ${color}`,
              whiteSpace: "nowrap",
              userSelect: "none",
              marginTop: "40px",
            }}
          >
            {agent.role.toUpperCase()}
            <br />
            <span style={{ opacity: 0.6, fontSize: "9px" }}>{(trust * 100).toFixed(0)}%</span>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}
