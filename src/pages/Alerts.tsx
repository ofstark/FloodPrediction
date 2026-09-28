import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Info, Clock, MapPin } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import Badge from "@/components/common/Badge";
import { getAlerts } from "@/services/alerts";
import type { AlertItem } from "@/types";
import { cn } from "@/lib/cn";

const statusFilters = ["All", "ACTIVE", "MONITORING", "RESOLVED"] as const;

function AlertCard({ alert }: { alert: AlertItem }) {
  const Icon = alert.severity === "INFO" ? Info : AlertTriangle;
  return (
    <GlassCard hoverable>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
              alert.severity === "CRITICAL" && "border-risk-critical/30 bg-risk-critical/10 text-risk-critical",
              alert.severity === "HIGH" && "border-risk-high/30 bg-risk-high/10 text-risk-high",
              alert.severity === "MODERATE" && "border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate",
              alert.severity === "LOW" && "border-risk-low/30 bg-risk-low/10 text-risk-low",
              alert.severity === "INFO" && "border-accent-blue/30 bg-accent-blue/10 text-accent-electric"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{alert.title}</p>
            {alert.description && (
              <p className="mt-1 max-w-md text-xs text-slate-400">{alert.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {alert.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {alert.timestamp}
              </span>
            </div>
          </div>
        </div>
        <Badge tone={alert.status === "ACTIVE" ? "danger" : alert.status === "MONITORING" ? "info" : "success"}>
          {alert.status}
        </Badge>
      </div>
    </GlassCard>
  );
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  const filtered = useMemo(
    () => (status === "All" ? alerts : alerts.filter((a) => a.status === status)),
    [alerts, status]
  );

  const active = alerts.filter((a) => a.status === "ACTIVE");
  const resolved = alerts.filter((a) => a.status === "RESOLVED");

  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-2xl font-bold text-white">ALERT MANAGEMENT</p>
        <p className="mt-1 text-sm text-slate-400">
          Active alerts, resolved advisories, and full alert history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard>
          <p className="text-xs text-slate-500">Active Alerts</p>
          <p className="mt-1 text-2xl font-bold text-risk-critical">{active.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-risk-low">{resolved.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500">Total History</p>
          <p className="mt-1 text-2xl font-bold text-slate-200">{alerts.length}</p>
        </GlassCard>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              status === f
                ? "border-accent-blue/40 bg-accent-blue/15 text-accent-electric"
                : "border-base-border text-slate-400 hover:bg-white/5"
            )}
          >
            {f === "All" ? "Alert History" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No alerts in this category.</p>
        )}
      </div>
    </div>
  );
}
