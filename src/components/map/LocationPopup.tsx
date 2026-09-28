import type { MonitoringZone } from "@/types";
import Badge from "@/components/common/Badge";

export default function LocationPopup({ zone }: { zone: MonitoringZone }) {
  return (
    <div className="min-w-[180px] font-sans text-slate-800">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Location
      </p>
      <p className="mb-2 text-sm font-bold">{zone.name}</p>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Flood Risk
        </span>
        <Badge risk={zone.risk}>{zone.risk}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div>
          <p className="text-slate-500">Probability</p>
          <p className="font-semibold">{zone.probability}%</p>
        </div>
        <div>
          <p className="text-slate-500">Confidence</p>
          <p className="font-semibold">{zone.confidence != null ? `${zone.confidence}%` : "—"}</p>
        </div>
        <div>
          <p className="text-slate-500">Rainfall</p>
          <p className="font-semibold">{zone.rainfall} mm</p>
        </div>
        <div>
          <p className="text-slate-500">River Signal</p>
          <p className="font-semibold">{zone.riverLevel} m³/s</p>
        </div>
        <div>
          <p className="text-slate-500">Soil Moisture</p>
          <p className="font-semibold">{zone.soilMoisture}%</p>
        </div>
      </div>

      <p className="mt-2 border-t border-slate-200 pt-1.5 text-[10px] italic text-slate-400">
        Model estimate — refreshed periodically
      </p>
    </div>
  );
}
