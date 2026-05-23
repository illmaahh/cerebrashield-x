"use client";

import type { AgentDef, AgentStatus } from "@/lib/types";

interface NeuralLinksProps {
  agents: AgentDef[];
  statuses: Record<string, AgentStatus>;
  trust: Record<string, number>;
}

export function NeuralLinks({
  agents,
  statuses,
  trust,
}: NeuralLinksProps) {
  return null;
}