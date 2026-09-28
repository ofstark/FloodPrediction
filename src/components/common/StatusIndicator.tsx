import { cn } from "@/lib/cn";

interface StatusIndicatorProps {
  label: string;
  color?: "green" | "cyan" | "amber" | "red";
  pulse?: boolean;
  className?: string;
}

const colorClass: Record<string, string> = {
  green: "bg-risk-low",
  cyan: "bg-accent-cyan",
  amber: "bg-risk-moderate",
  red: "bg-risk-critical",
};

export default function StatusIndicator({
  label,
  color = "green",
  pulse = true,
  className,
}: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-pulse-ring rounded-full",
              colorClass[color]
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", colorClass[color])} />
      </span>
      {label}
    </div>
  );
}
