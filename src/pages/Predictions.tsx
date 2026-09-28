import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import Badge from "@/components/common/Badge";
import { getPredictions } from "@/services/predictions";
import type { FloodPrediction, RiskLevel } from "@/types";
import { cn } from "@/lib/cn";

const filters: ("All" | RiskLevel)[] = ["All", "LOW", "MODERATE", "HIGH", "CRITICAL"];

type SortKey = "probability" | "rainfall" | "riverLevel" | "soilMoisture";

export default function Predictions() {
  const [data, setData] = useState<FloodPrediction[]>([]);
  const [filter, setFilter] = useState<"All" | RiskLevel>("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("probability");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    getPredictions().then(setData);
  }, []);

  const filtered = useMemo(() => {
    let rows = data;
    if (filter !== "All") rows = rows.filter((r) => r.risk === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) => r.location.toLowerCase().includes(q) || r.region.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => (sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
  }, [data, filter, query, sortKey, sortDesc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-2xl font-bold text-white">PREDICTION CENTER</p>
        <p className="mt-1 text-sm text-slate-400">
          AI-generated flash-flood risk assessments across monitored locations.
        </p>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-accent-blue/40 bg-accent-blue/15 text-accent-electric"
                    : "border-base-border text-slate-400 hover:bg-white/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-base-border bg-white/[0.03] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full bg-transparent text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none sm:w-48"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-base-border text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Risk</th>
                {(
                  [
                    ["probability", "Probability"],
                    ["rainfall", "Rainfall"],
                    ["riverLevel", "River"],
                    ["soilMoisture", "Soil"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th key={key} className="pb-3 font-medium">
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center gap-1 hover:text-slate-300"
                    >
                      {label} <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                ))}
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-base-border/60 hover:bg-white/[0.02]">
                  <td className="py-3">
                    <p className="font-medium text-slate-200">{p.location}</p>
                    <p className="text-xs text-slate-500">{p.region}</p>
                  </td>
                  <td className="py-3">
                    <Badge risk={p.risk}>{p.risk}</Badge>
                  </td>
                  <td className="py-3 font-medium text-slate-200">{p.probability}%</td>
                  <td className="py-3 text-slate-400">{p.rainfall} mm</td>
                  <td className="py-3 text-slate-400">{p.riverLevel} m³/s</td>
                  <td className="py-3 text-slate-400">{p.soilMoisture}%</td>
                  <td className="py-3 text-slate-400">{p.confidence != null ? `${p.confidence}%` : "—"}</td>
                  <td className="py-3 text-xs text-slate-500">{p.updatedAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-slate-500">
                    No locations match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <p className="text-center text-[11px] text-slate-600">
        Probabilities are model estimates from live environmental data — not a certified forecast.
      </p>
    </div>
  );
}
