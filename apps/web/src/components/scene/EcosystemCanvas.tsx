"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { useStore } from "@/lib/store";
import { ConsciousnessCore } from "./ConsciousnessCore";
import { AgentNode } from "./AgentNode";
import { NeuralLinks } from "./NeuralLinks";
import { MemoryWeb } from "./MemoryWeb";
import { Particles } from "./Particles";
import * as THREE from "three";

function SceneContent() {
  const { agents, trust, statuses } = useStore();

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} color="#4d70ff" />
      <Stars radius={80} depth={60} count={2000} factor={2} fade speed={0.5} />
      <Particles count={350} />
      <MemoryWeb />
      <ConsciousnessCore />
      <NeuralLinks agents={agents} statuses={statuses} trust={trust} />
      {agents.map((agent) => (
        <AgentNode
          key={agent.id}
          agent={agent}
          trust={trust[agent.id] ?? 1}
          status={statuses[agent.id] ?? "healthy"}
        />
      ))}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export function EcosystemCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
