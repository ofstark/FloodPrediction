import { useEffect, useMemo, useState } from "react";
import { Layers, MapPin, Search } from "lucide-react";
import RiskMap from "@/components/map/RiskMap";
import MapLegend from "@/components/map/MapLegend";
import GlassCard from "@/components/common/GlassCard";
import Badge from "@/components/common/Badge";
import StatusIndicator from "@/components/common/StatusIndicator";
import { getMonitoringZones } from "@/services/locations";
import { getGeography } from "@/services/geography";
import type { MonitoringZone, GeographyData } from "@/types";
import { cn } from "@/lib/cn";

const layerOptions = [
  { key: "riskZones", label: "Risk Zones", defaultOn: true },
  { key: "rivers", label: "Rivers", defaultOn: true },
  { key: "roads", label: "Roads", defaultOn: true },
  { key: "settlements", label: "Settlements", defaultOn: true },
  { key: "monitoringStations", label: "Monitoring Stations", defaultOn: true },
] as const;

export default function RiskMapPage() {
  const [zones, setZones] = useState<MonitoringZone[]>([]);
  const [geography, setGeography] = useState<GeographyData | null>(null);
  const [selected, setSelected] = useState<MonitoringZone | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(layerOptions.map((l) => [l.key, l.defaultOn]))
  );

  useEffect(() => {
    Promise.all([getMonitoringZones(), getGeography()]).then(([zonesRes, geoRes]) => {
      setZones(zonesRes);
      setGeography(geoRes);
      setLoading(false);
    });
  }, []);

  function toggleLayer(key: string) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const filteredZones = useMemo(() => {
    const sorted = [...zones].sort((a, b) => b.probability - a.probability);
    if (!query.trim()) return sorted;
    return sorted.filter((z) => z.name.toLowerCase().includes(query.toLowerCase()));
  }, [zones, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold text-white">RISK MAP</p>
          <p className="mt-1 text-sm text-slate-400">
            GIS-based flash-flood risk visualization across {zones.length || "the"} monitored
            locations.
          </p>
        </div>
        <StatusIndicator label={loading ? "Syncing" : "Live"} color={loading ? "amber" : "cyan"} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="relative h-[600px] overflow-hidden rounded-2xl border border-base-border xl:col-span-3">
          <div className="absolute left-4 top-4 z-[400] w-56">
            <GlassCard className="mb-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5" /> Map Layers
              </div>
              <div className="space-y-2">
                {layerOptions.map((l) => (
                  <label key={l.key} className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers[l.key]}
                      onChange={() => toggleLayer(l.key)}
                      className="h-3.5 w-3.5 rounded border-base-border bg-transparent accent-accent-blue"
                    />
                    {l.label}
                  </label>
                ))}
              </div>
            </GlassCard>
            <MapLegend />
          </div>

          <RiskMap
            zones={zones}
            geography={geography}
            activeLayers={layers as any}
            onSelectZone={setSelected}
            flyToZone={selected}
            className="h-full w-full"
          />
        </div>

        <GlassCard className="flex h-[600px] flex-col xl:col-span-1" padded={false}>
          <div className="border-b border-base-border p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monitored Locations
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-base-border bg-white/[0.03] px-3 py-2">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
            {filteredZones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelected(z)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  selected?.id === z.id
                    ? "border-accent-blue/40 bg-accent-blue/10"
                    : "border-transparent hover:bg-white/5"
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate text-xs font-medium text-slate-200">{z.name}</span>
                </div>
                <Badge risk={z.risk} className="shrink-0">
                  {z.probability}%
                </Badge>
              </button>
            ))}
            {filteredZones.length === 0 && (
              <p className="p-4 text-center text-xs text-slate-500">No locations match.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {selected && (
        <GlassCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selected Location
              </p>
              <p className="text-lg font-bold text-white">{selected.name}</p>
            </div>
            <Badge risk={selected.risk}>{selected.risk} Risk</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-slate-500">Probability</p>
              <p className="text-lg font-semibold text-white">{selected.probability}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Confidence</p>
              <p className="text-lg font-semibold text-white">
                {selected.confidence != null ? `${selected.confidence}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Rainfall</p>
              <p className="text-lg font-semibold text-white">{selected.rainfall} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">River Signal</p>
              <p className="text-lg font-semibold text-white">{selected.riverLevel} m³/s</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Soil Moisture</p>
              <p className="text-lg font-semibold text-white">{selected.soilMoisture}%</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
