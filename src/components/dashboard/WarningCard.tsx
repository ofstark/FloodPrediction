import { TriangleAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MonitoringZone } from "@/types";

function reasonsFor(zone: MonitoringZone): string[] {
  const reasons: string[] = [];
  if (zone.rainfall > 50) reasons.push("Elevated accumulated rainfall");
  if (zone.riverLevel > 3) reasons.push("Rising river discharge");
  if (zone.soilMoisture > 60) reasons.push("High soil moisture / saturation");
  if (reasons.length === 0) reasons.push("Conditions trending upward");
  return reasons;
}

export default function WarningCard({ zone }: { zone: MonitoringZone | null }) {
  const isElevated = zone && (zone.risk === "HIGH" || zone.risk === "CRITICAL");

  if (!isElevated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-risk-low/30 bg-gradient-to-br from-risk-low/10 via-base-900/60 to-base-900/60 p-5 shadow-card"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-risk-low/40 bg-risk-low/15">
            <CheckCircle2 className="h-4.5 w-4.5 text-risk-low" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-risk-low">No Active Warning</p>
            <p className="mt-1 text-sm text-slate-300">
              All monitored locations are currently within normal risk thresholds.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-risk-high/30 bg-gradient-to-br from-risk-high/10 via-base-900/60 to-base-900/60 p-5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-risk-high/40 bg-risk-high/15">
          <TriangleAlert className="h-4.5 w-4.5 text-risk-high" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-risk-high">Early Warning</p>
          <p className="mt-1 text-sm text-slate-200">
            Elevated flood risk detected in <span className="font-semibold">{zone.name}</span>.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {reasonsFor(zone).map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-risk-high/30 bg-risk-high/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-risk-high">
              Warning Active
            </span>
            <Link
              to="/map"
              className="flex items-center gap-1 text-xs font-medium text-accent-electric hover:text-accent-cyan"
            >
              View Risk Area <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
