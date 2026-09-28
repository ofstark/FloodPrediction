import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import { getModelMetrics } from "@/services/model";
import type { ModelMetrics } from "@/types";
import { cn } from "@/lib/cn";

const components = [
  { name: "Frontend", status: "Operational" },
  { name: "Prediction Engine", status: "Operational" },
  { name: "GIS Engine", status: "Operational" },
  { name: "Alert Store", status: "In-Memory" },
  { name: "Auth Service", status: "Operational" },
];

const statusColor: Record<string, string> = {
  Operational: "text-risk-low",
  "In-Memory": "text-risk-moderate",
  "Not Connected": "text-slate-500",
};

function pct(n?: number) {
  return n != null ? `${Math.round(n * 100)}%` : "—";
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    getModelMetrics().then(setMetrics);
  }, []);

  const hasMetrics = metrics && !metrics.error;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-2xl font-bold text-white">SYSTEM STATUS</p>
        <p className="mt-1 text-sm text-slate-400">Technical monitoring for the FloodGuard AI stack.</p>
      </div>

      <GlassCard>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-risk-low" />
          <div>
            <p className="text-xs text-slate-500">Overall Status</p>
            <p className="text-lg font-bold text-risk-low">OPERATIONAL</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {components.map((c) => (
          <GlassCard key={c.name} hoverable className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{c.name}</span>
            <span className={cn("flex items-center gap-1.5 text-xs font-semibold uppercase", statusColor[c.status])}>
              <Circle className="h-2 w-2 fill-current" /> {c.status}
            </span>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Model Validation Metrics
          </p>
          {hasMetrics && (
            <span className="text-[11px] text-slate-500">{metrics!.model_type}</span>
          )}
        </div>

        {!metrics && <p className="text-sm text-slate-500">Loading model metrics...</p>}

        {metrics?.error && (
          <p className="text-sm text-risk-moderate">{metrics.error}</p>
        )}

        {hasMetrics && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
              <div>
                <p className="text-xs text-slate-500">Accuracy</p>
                <p className="mt-0.5 font-semibold text-white">{pct(metrics!.accuracy)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Precision</p>
                <p className="mt-0.5 font-semibold text-white">{pct(metrics!.precision)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Recall</p>
                <p className="mt-0.5 font-semibold text-white">{pct(metrics!.recall)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">F1 Score</p>
                <p className="mt-0.5 font-semibold text-white">{pct(metrics!.f1_score)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ROC-AUC</p>
                <p className="mt-0.5 font-semibold text-white">{metrics!.roc_auc?.toFixed(2) ?? "—"}</p>
              </div>
            </div>

            {metrics!.feature_importances && (
              <div className="mt-5 border-t border-base-border pt-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Feature Importance
                </p>
                <div className="space-y-2">
                  {Object.entries(metrics!.feature_importances)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3 text-xs">
                        <span className="w-28 shrink-0 capitalize text-slate-400">
                          {name.replace("_", " ")}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right text-slate-300">
                          {Math.round(value * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <p className="mt-4 border-t border-base-border pt-4 text-[11px] text-slate-500">
              Trained on {metrics!.n_train?.toLocaleString()} samples, validated on{" "}
              {metrics!.n_test?.toLocaleString()}. {metrics!.trained_on} — these metrics reflect
              how well the model learned that dataset, not a validated real-world flood forecast.
              River signal is a discharge-based proxy, not a direct gauge reading. See the backend
              README for the full model training methodology.
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
