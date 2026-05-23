"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

export function ConsciousnessCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const { phase } = useStore();

  const isAttack = phase === "under_attack" || phase === "detecting";

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.2;
      const s = 1 + Math.sin(Date.now() * 0.002) * 0.08;
      glowRef.current.scale.setScalar(s);
    }
  });

  const color = isAttack ? "#ff3030" : phase === "healing" ? "#60a5fa" : "#00f5a0";

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Core icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isAttack ? 1.2 : 0.6}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Inner solid */}
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Point light */}
      <pointLight color={color} intensity={isAttack ? 3 : 1.5} distance={6} />
    </group>
  );
}
