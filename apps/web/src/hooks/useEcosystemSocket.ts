"use client";
import { useEffect } from "react";
import { connectWS } from "@/lib/ws";

export function useEcosystemSocket() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/ecosystem";
    connectWS(url);
  }, []);
}
