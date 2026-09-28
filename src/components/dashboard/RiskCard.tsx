import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import { cn } from "@/lib/cn";

interface RiskCardProps {
  icon: LucideIcon;
  title: string;
  statusLabel: string;
  statusColorClass: string;
  value: number;
  valueSuffix?: string;
  decimals?: number;
  trendLabel: string;
  trendDirection?: "up" | "down" | "flat";
  accentColorClass: string;
  delay?: number;
}

function useCountUp(target: number, decimals = 0, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(target * progress);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value.toFixed(decimals);
}

export default function RiskCard({
  icon: Icon,
  title,
  statusLabel,
  statusColorClass,
  value,
  valueSuffix = "",
  decimals = 0,
  trendLabel,
  trendDirection = "up",
  accentColorClass,
  delay = 0,
}: RiskCardProps) {
  const displayValue = useCountUp(value, decimals);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard hoverable className="group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
                accentColorClass
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </p>
          </div>
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", statusColorClass)}>
            {statusLabel}
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-white tabular-nums">
            {displayValue}
          </span>
          <span className="text-sm font-medium text-slate-500">{valueSuffix}</span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">
          {trendDirection === "up" && <ArrowUp className="h-3 w-3 text-risk-high" />}
          {trendDirection === "down" && <ArrowDown className="h-3 w-3 text-risk-low" />}
          <span>{trendLabel}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
