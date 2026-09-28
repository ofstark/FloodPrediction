import type { RiskLevel } from "@/types";

export const riskColorMap: Record<RiskLevel, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export const riskTextClass: Record<RiskLevel, string> = {
  LOW: "text-risk-low",
  MODERATE: "text-risk-moderate",
  HIGH: "text-risk-high",
  CRITICAL: "text-risk-critical",
};

export const riskBgClass: Record<RiskLevel, string> = {
  LOW: "bg-risk-low/15 text-risk-low border-risk-low/30",
  MODERATE: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
  HIGH: "bg-risk-high/15 text-risk-high border-risk-high/30",
  CRITICAL: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export function riskDotClass(risk: RiskLevel): string {
  return (
    {
      LOW: "bg-risk-low",
      MODERATE: "bg-risk-moderate",
      HIGH: "bg-risk-high",
      CRITICAL: "bg-risk-critical",
    }[risk] ?? "bg-slate-400"
  );
}
