import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { RiskLevel } from "@/types";
import { riskBgClass } from "@/lib/risk";

interface BadgeProps {
  children: ReactNode;
  risk?: RiskLevel;
  tone?: "neutral" | "info" | "success" | "danger";
  className?: string;
}

const toneClass: Record<string, string> = {
  neutral: "bg-white/5 text-slate-300 border-white/10",
  info: "bg-accent-blue/15 text-accent-electric border-accent-blue/30",
  success: "bg-risk-low/15 text-risk-low border-risk-low/30",
  danger: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export default function Badge({ children, risk, tone = "neutral", className }: BadgeProps) {
  const cls = risk ? riskBgClass[risk] : toneClass[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        cls,
        className
      )}
    >
      {children}
    </span>
  );
}
