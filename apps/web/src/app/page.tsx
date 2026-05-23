"use client";
import dynamic from "next/dynamic";
import { useEcosystemSocket } from "@/hooks/useEcosystemSocket";
import { TopBar } from "@/components/hud/TopBar";
import { TrustPanel } from "@/components/hud/TrustPanel";
import { AttackConsole } from "@/components/hud/AttackConsole";
import { EventStream } from "@/components/hud/EventStream";
import { PhaseBanner } from "@/components/hud/PhaseBanner";

const EcosystemCanvas = dynamic(
  () => import("@/components/scene/EcosystemCanvas").then((m) => m.EcosystemCanvas),
  { ssr: false }
);

export default function HomePage() {
  useEcosystemSocket();

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at center, #040f1a 0%, #020810 70%)" }}>
      <TopBar />
      <PhaseBanner />

      {/* Full-screen 3D canvas */}
      <div className="absolute inset-0 pt-14">
        <EcosystemCanvas />
      </div>

      {/* Left panel — Trust Matrix */}
      <div className="absolute left-4 top-20 z-30">
        <TrustPanel />
      </div>

      {/* Right panel — Attack Console */}
      <div className="absolute right-4 top-20 z-30">
        <AttackConsole />
      </div>

      {/* Bottom — Event Stream */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <EventStream />
      </div>
    </div>
  );
}
