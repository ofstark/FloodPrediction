import { riskColorMap } from "@/lib/risk";

const items: { label: string; risk: keyof typeof riskColorMap }[] = [
  { label: "Low", risk: "LOW" },
  { label: "Moderate", risk: "MODERATE" },
  { label: "High", risk: "HIGH" },
  { label: "Critical", risk: "CRITICAL" },
];

export default function MapLegend() {
  return (
    <div className="rounded-xl border border-base-border bg-base-900/90 p-3 backdrop-blur-xl">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Risk Legend
      </p>
      <div className="space-y-1.5">
        {items.map((i) => (
          <div key={i.risk} className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: riskColorMap[i.risk] }}
            />
            {i.label}
          </div>
        ))}
      </div>
    </div>
  );
}
