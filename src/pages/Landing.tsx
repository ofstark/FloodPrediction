import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Waves,
  BrainCircuit,
  Map,
  CloudRain,
  ShieldAlert,
  History,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

const capabilities = [
  { icon: BrainCircuit, title: "AI Risk Prediction", desc: "Machine-learning driven flood probability scoring." },
  { icon: Map, title: "GIS Intelligence", desc: "Spatial risk mapping across terrain and river basins." },
  { icon: CloudRain, title: "Environmental Monitoring", desc: "Rainfall, river level and soil moisture tracking." },
  { icon: ShieldAlert, title: "Early Warning", desc: "Automated alerts for elevated flood-risk conditions." },
  { icon: Sparkles, title: "Explainable Risk", desc: "Transparent contributing-factor breakdowns." },
  { icon: History, title: "Historical Analysis", desc: "Pattern review from past flood events." },
];

const pipeline = ["Rainfall", "Weather", "River", "Terrain", "Soil", "Satellite"];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-950 text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-grid-fine bg-[size:48px_48px] opacity-30" />
      <div className="pointer-events-none fixed inset-0 bg-radial-glow" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
            <Waves className="h-4.5 w-4.5 text-accent-cyan" />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-white">FLOODGUARD AI</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#capabilities" className="hover:text-white">Capabilities</a>
          <a href="#pipeline" className="hover:text-white">How it works</a>
        </nav>
        <Link
          to="/login"
          className="rounded-lg border border-base-border bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          Sign In
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-10 text-center sm:pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-cyan">
            AI-Powered Flash Flood Prediction
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
            FLOODGUARD AI
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-300 sm:text-xl">
            Predict Early. Warn Faster. Support Disaster Preparedness.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-400 sm:text-base">
            An AI-powered environmental intelligence platform designed to analyze rainfall, water
            levels, terrain, soil moisture and historical flood patterns to support localized
            flash-flood risk assessment.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-accent-blue px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/map"
              className="flex items-center gap-2 rounded-xl border border-base-border bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-transform hover:-translate-y-0.5 hover:bg-white/10"
            >
              Explore Risk Map
            </Link>
          </div>
        </motion.div>

        <motion.div
          id="pipeline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <GlassCard className="py-8">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:gap-3 sm:text-sm">
              {pipeline.map((p) => (
                <span key={p} className="rounded-lg border border-base-border bg-white/5 px-3 py-1.5">
                  {p}
                </span>
              ))}
            </div>
            <div className="my-4 flex justify-center text-slate-600">↓</div>
            <div className="flex justify-center">
              <span className="rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-accent-cyan">
                AI Engine
              </span>
            </div>
            <div className="my-4 flex justify-center text-slate-600">↓</div>
            <div className="flex justify-center">
              <span className="rounded-lg border border-risk-high/40 bg-risk-high/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-risk-high">
                Flood Probability
              </span>
            </div>
            <div className="my-4 flex justify-center text-slate-600">↓</div>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold uppercase tracking-wide">
              <span className="rounded-lg border border-base-border bg-white/5 px-3 py-1.5 text-slate-300">
                Risk Map
              </span>
              <span className="rounded-lg border border-risk-critical/40 bg-risk-critical/10 px-3 py-1.5 text-risk-critical">
                Early Warning
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section id="capabilities" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <GlassCard hoverable className="h-full">
                <c.icon className="h-5 w-5 text-accent-cyan" />
                <p className="mt-3 text-sm font-semibold text-white">{c.title}</p>
                <p className="mt-1 text-xs text-slate-400">{c.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-base-border px-6 py-8 text-center text-xs text-slate-600">
        FloodGuard AI — an experimental early-warning tool. Not a substitute for official
        emergency alerts from local disaster-management authorities.
      </footer>
    </div>
  );
}
