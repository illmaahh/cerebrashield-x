"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

export function MemoryWeb() {
  const ref = useRef<THREE.Group>(null!);
  const { phase } = useStore();

  const nodes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 18);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.6 + Math.random() * 0.4;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    });
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
      ref.current.rotation.x += delta * 0.03;
    }
  });

  const isAttack = phase === "under_attack" || phase === "detecting";
  const color = isAttack ? "#a855f7" : "#4d70ff";

  return (
    <group ref={ref}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {nodes.map((from, i) =>
        nodes.slice(i + 1, i + 3).map((to, j) => {
          const points = [from, to];
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`${i}-${j}`} geometry={geo}>
              <lineBasicMaterial color={color} transparent opacity={0.15} />
            </line>
          );
        })
      )}
    </group>
  );
}
