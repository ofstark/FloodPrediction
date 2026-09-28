import { motion } from "framer-motion";
import GlassCard from "@/components/common/GlassCard";
import Badge from "@/components/common/Badge";
import type { MonitoringZone } from "@/types";

const CIRC = 2 * Math.PI * 54;

interface PredictionPanelProps {
  zone: MonitoringZone | null;
}

function buildFactors(zone: MonitoringZone | null) {
  if (!zone) {
    return [
      { label: "Rainfall", value: 0, tag: "—" },
      { label: "River Signal", value: 0, tag: "—" },
      { label: "Soil Moisture", value: 0, tag: "—" },
    ];
  }
  return [
    { label: "Rainfall", value: Math.min((zone.rainfall / 120) * 100, 100), tag: zone.rainfall > 60 ? "HIGH" : "MODERATE" },
    { label: "River Signal", value: Math.min((zone.riverLevel / 6) * 100, 100), tag: zone.riverLevel > 3 ? "RISING" : "STEADY" },
    { label: "Soil Moisture", value: zone.soilMoisture, tag: zone.soilMoisture > 60 ? "HIGH" : "MODERATE" },
  ];
}

export default function PredictionPanel({ zone }: PredictionPanelProps) {
  const probability = zone?.probability ?? 0;
  const offset = CIRC - (probability / 100) * CIRC;
  const factors = buildFactors(zone);

  return (
    <GlassCard className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          AI Risk Assessment
        </p>
        {zone && <Badge risk={zone.risk}>{zone.risk} Risk</Badge>}
      </div>

      {zone && (
        <p className="mt-1 text-sm font-medium text-slate-300">{zone.name}</p>
      )}

      <div className="mt-6 flex items-center justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(148,178,219,0.1)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display text-3xl font-bold text-white">
              {probability}%
            </span>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">
              Flood Probability
            </span>
          </div>
        </div>
      </div>

      {zone?.confidence != null && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <span className="text-slate-500">Model Confidence</span>
          <span className="font-semibold text-accent-electric">{zone.confidence}%</span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Contributing Factors
        </p>
        {factors.map((f) => (
          <div key={f.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-300">{f.label}</span>
              <span className="font-medium text-slate-500">{f.tag}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={
                  f.value > 80
                    ? "h-full rounded-full bg-risk-critical"
                    : f.value > 60
                    ? "h-full rounded-full bg-risk-high"
                    : "h-full rounded-full bg-risk-moderate"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-base-border pt-4 text-xs">
        <div>
          <p className="text-slate-500">Model Status</p>
          <p className="mt-0.5 font-medium text-risk-low">Operational</p>
        </div>
        <div>
          <p className="text-slate-500">Model</p>
          <p className="mt-0.5 font-medium text-slate-300">Random Forest v1</p>
        </div>
      </div>
    </GlassCard>
  );
}
