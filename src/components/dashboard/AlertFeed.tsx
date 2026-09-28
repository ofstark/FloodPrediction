import { AlertTriangle, Info } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import type { AlertItem } from "@/types";
import { cn } from "@/lib/cn";

const sevColor: Record<string, string> = {
  LOW: "text-risk-low",
  MODERATE: "text-risk-moderate",
  HIGH: "text-risk-high",
  CRITICAL: "text-risk-critical",
  INFO: "text-accent-electric",
};

export default function AlertFeed({ alerts }: { alerts: AlertItem[] }) {
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Alerts
        </p>
        <span className="text-[11px] text-slate-500">{alerts.length} total</span>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 5).map((a) => {
          const Icon = a.severity === "INFO" ? Info : AlertTriangle;
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-xl border border-base-border bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
            >
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", sevColor[a.severity])} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">{a.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{a.location}</p>
              </div>
              <span className="shrink-0 text-[11px] text-slate-600">{a.timestamp}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
