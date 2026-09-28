import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";

const steps = [
  "Data pipeline",
  "GIS engine",
  "AI engine",
  "Dashboard",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDone((d) => {
        if (d >= steps.length) {
          clearInterval(interval);
          setTimeout(onDone, 350);
          return d;
        }
        return d + 1;
      });
    }, 260);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-950 bg-grid-fine bg-[size:36px_36px]">
      <div className="absolute inset-0 bg-radial-glow" />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10 shadow-glow">
          <Waves className="h-7 w-7 text-accent-cyan" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-wide text-white">
          FLOODGUARD AI
        </h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          Environmental Intelligence
        </p>

        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-accent-cyan/70"
              style={{
                animation: `pulseRing 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">Initializing monitoring system...</p>

        <div className="mt-8 w-64 space-y-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center justify-between text-xs">
              <span className={i < done ? "text-slate-300" : "text-slate-600"}>{step}</span>
              <span className={i < done ? "text-accent-cyan" : "text-slate-700"}>
                {i < done ? "✓" : "…"}
              </span>
            </div>
          ))}
        </div>

        {done >= steps.length && (
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-cyan">
            System Ready
          </p>
        )}
      </motion.div>
    </div>
  );
}
