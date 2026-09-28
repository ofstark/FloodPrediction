import { useEffect, useMemo, useState } from "react";
import { CloudRain, Waves, Droplets, ShieldAlert } from "lucide-react";
import RiskCard from "@/components/dashboard/RiskCard";
import PredictionPanel from "@/components/dashboard/PredictionPanel";
import EnvironmentalCharts from "@/components/dashboard/EnvironmentalCharts";
import AlertFeed from "@/components/dashboard/AlertFeed";
import WarningCard from "@/components/dashboard/WarningCard";
import RiskMap from "@/components/map/RiskMap";
import MapLegend from "@/components/map/MapLegend";
import GlassCard from "@/components/common/GlassCard";
import StatusIndicator from "@/components/common/StatusIndicator";
import { getAlerts } from "@/services/alerts";
import { getMonitoringZones } from "@/services/locations";
import { getGeography } from "@/services/geography";
import type { AlertItem, MonitoringZone, GeographyData } from "@/types";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [zones, setZones] = useState<MonitoringZone[]>([]);
  const [geography, setGeography] = useState<GeographyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAlerts(), getMonitoringZones(), getGeography()]).then(
      ([alertsRes, zonesRes, geoRes]) => {
        if (cancelled) return;
        setAlerts(alertsRes);
        setZones(zonesRes);
        setGeography(geoRes);
        setLastUpdated(new Date());
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // Focus the top summary cards on the highest-risk monitored location —
  // this is what an operator most needs to see at a glance.
  const focusZone = useMemo(() => {
    if (zones.length === 0) return null;
    return [...zones].sort((a, b) => b.probability - a.probability)[0];
  }, [zones]);

  const timeLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-2xl font-bold text-white sm:text-[28px]">
            FLOODGUARD AI COMMAND CENTER
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Environmental intelligence &amp; flash-flood risk monitoring
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">
            Last updated <span className="text-slate-300">{timeLabel}</span>
          </p>
          <p className="mt-0.5 text-xs font-medium text-risk-low">● System Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RiskCard
          icon={ShieldAlert}
          title={focusZone ? focusZone.name : "Flood Risk"}
          statusLabel={focusZone?.risk ?? "—"}
          statusColorClass="border-risk-high/30 bg-risk-high/10 text-risk-high"
          value={focusZone?.probability ?? 0}
          valueSuffix="% Probability"
          trendLabel="Highest-risk monitored location"
          accentColorClass="border-risk-high/30 bg-risk-high/10 text-risk-high"
          delay={0}
        />
        <RiskCard
          icon={CloudRain}
          title="Rainfall"
          statusLabel={focusZone && focusZone.rainfall > 60 ? "HIGH" : "MODERATE"}
          statusColorClass="border-risk-high/30 bg-risk-high/10 text-risk-high"
          value={focusZone?.rainfall ?? 0}
          valueSuffix="mm · Last 6h"
          decimals={1}
          trendLabel="Live from Open-Meteo"
          accentColorClass="border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
          delay={0.08}
        />
        <RiskCard
          icon={Waves}
          title="River Signal"
          statusLabel={focusZone && focusZone.riverLevel > 3 ? "RISING" : "STEADY"}
          statusColorClass="border-accent-blue/30 bg-accent-blue/10 text-accent-electric"
          value={focusZone?.riverLevel ?? 0}
          valueSuffix="m³/s"
          decimals={1}
          trendLabel="Discharge proxy, Open-Meteo Flood API"
          accentColorClass="border-accent-blue/30 bg-accent-blue/10 text-accent-electric"
          delay={0.16}
        />
        <RiskCard
          icon={Droplets}
          title="Soil Moisture"
          statusLabel={focusZone && focusZone.soilMoisture > 60 ? "HIGH" : "MODERATE"}
          statusColorClass="border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate"
          value={focusZone?.soilMoisture ?? 0}
          valueSuffix="% Saturation"
          decimals={1}
          trendLabel="Live from Open-Meteo"
          accentColorClass="border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate"
          delay={0.24}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard className="relative h-[460px] p-2 xl:col-span-2" padded={false}>
          <div className="absolute left-4 top-4 z-[400]">
            <MapLegend />
          </div>
          <div className="absolute right-4 top-4 z-[400] rounded-full border border-base-border bg-base-900/90 px-3 py-1">
            <StatusIndicator label={loading ? "Syncing" : "Live"} color={loading ? "amber" : "cyan"} />
          </div>
          <RiskMap zones={zones} geography={geography} className="h-full w-full overflow-hidden rounded-2xl" />
        </GlassCard>

        <PredictionPanel zone={focusZone} />
      </div>

      <EnvironmentalCharts />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AlertFeed alerts={alerts} />
        </div>
        <WarningCard zone={focusZone} />
      </div>

      <p className="pb-2 text-center text-[11px] text-slate-600">
        FloodGuard AI is an experimental early-warning tool — not an official emergency alert
        service. Always follow guidance from local disaster-management authorities.
      </p>
    </div>
  );
}
