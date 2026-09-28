import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import GlassCard from "@/components/common/GlassCard";
import {
  rainfallSeries,
  riverLevelSeries,
  soilMoistureSeries,
  temperatureSeries,
} from "@/data/dashboard";

const tooltipStyle = {
  background: "#0d1424",
  border: "1px solid rgba(148,178,219,0.15)",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};

function ChartCard({
  title,
  unit,
  data,
  color,
  type = "line",
}: {
  title: string;
  unit: string;
  data: { time: string; value: number }[];
  color: string;
  type?: "line" | "area";
}) {
  return (
    <GlassCard hoverable>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <span className="text-[11px] text-slate-500">{unit}</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,178,219,0.06)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${title})`} strokeWidth={2} isAnimationActive />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,178,219,0.06)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default function EnvironmentalCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ChartCard title="Rainfall Trend" unit="mm / hr · 24h" data={rainfallSeries} color="#22d3ee" type="area" />
      <ChartCard title="River Signal" unit="m³/s · 24h" data={riverLevelSeries} color="#3b82f6" />
      <ChartCard title="Soil Moisture" unit="% · 24h" data={soilMoistureSeries} color="#f97316" type="area" />
      <ChartCard title="Temperature" unit="°C · 24h" data={temperatureSeries} color="#a78bfa" />
    </div>
  );
}
