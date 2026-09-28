import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Waves, User, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import GlassCard from "@/components/common/GlassCard";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-base-950">
      <div className="pointer-events-none fixed inset-0 bg-grid-fine bg-[size:44px_44px] opacity-30" />
      <div className="pointer-events-none fixed inset-0 bg-radial-glow" />

      <div className="relative z-10 hidden flex-1 flex-col justify-between border-r border-base-border p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
            <Waves className="h-4.5 w-4.5 text-accent-cyan" />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-white">FLOODGUARD AI</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="font-display max-w-md text-3xl font-bold leading-tight text-white">
            Environmental intelligence for flash-flood early warning.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Monitor rainfall, river levels, soil moisture and AI-driven risk assessments across
            hilly terrain regions in one command center.
          </p>
        </motion.div>
        <p className="text-xs text-slate-600">Team Astra · Operator Access</p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
              <Waves className="h-4.5 w-4.5 text-accent-cyan" />
            </div>
            <span className="font-display text-lg font-bold text-white">FLOODGUARD AI</span>
          </div>

          <GlassCard>
            <h1 className="text-xl font-bold text-white">Sign in</h1>
            <p className="mt-1 text-sm text-slate-500">Access the command center dashboard.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Username</label>
                <div className="flex items-center gap-2 rounded-lg border border-base-border bg-white/[0.03] px-3 py-2.5 focus-within:border-accent-cyan/40">
                  <User className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Astra"
                    className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
                <div className="flex items-center gap-2 rounded-lg border border-base-border bg-white/[0.03] px-3 py-2.5 focus-within:border-accent-cyan/40">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-risk-critical/30 bg-risk-critical/10 px-3 py-2.5 text-xs text-risk-critical">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </GlassCard>

          <p className="mt-4 text-center text-[11px] text-slate-600">
            FloodGuard AI — restricted access, Team Astra operators only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
