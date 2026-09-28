import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padded?: boolean;
}

export default function GlassCard({
  children,
  hoverable = false,
  padded = true,
  className,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-base-border bg-white/[0.03] backdrop-blur-xl shadow-card transition-all duration-300",
        padded && "p-5",
        hoverable &&
          "hover:-translate-y-0.5 hover:border-accent-cyan/30 hover:shadow-glow",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
