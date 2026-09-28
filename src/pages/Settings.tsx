import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/common/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-accent-blue" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function SettingRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-base-border py-3.5 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [highRisk, setHighRisk] = useState(true);
  const [critical, setCritical] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("5 minutes");

  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-2xl font-bold text-white">SETTINGS</p>
        <p className="mt-1 text-sm text-slate-400">Manage your FloodGuard AI preferences.</p>
      </div>

      <GlassCard>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Appearance</p>
        <SettingRow label="Dark Mode" description="FloodGuard AI is optimized for dark mode." checked={darkMode} onChange={() => setDarkMode((d) => !d)} />
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Notifications</p>
        <SettingRow label="High-risk alerts" description="Notify when a location reaches HIGH risk." checked={highRisk} onChange={() => setHighRisk((d) => !d)} />
        <SettingRow label="Critical alerts" description="Notify immediately for CRITICAL risk events." checked={critical} onChange={() => setCritical((d) => !d)} />
      </GlassCard>

      <GlassCard>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Monitoring</p>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-slate-200">Refresh interval</p>
            <p className="mt-0.5 text-xs text-slate-500">How often dashboard data refreshes.</p>
          </div>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            className="rounded-lg border border-base-border bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option>1 minute</option>
            <option>5 minutes</option>
            <option>15 minutes</option>
            <option>30 minutes</option>
          </select>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</p>
        <div className="flex items-center justify-between border-b border-base-border py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-200">Profile</p>
            <p className="mt-0.5 text-xs text-slate-500">{user?.username ?? "Astra"} · Team Astra</p>
          </div>
          <button className="rounded-lg border border-base-border px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">
            Edit
          </button>
        </div>
        <div className="flex items-center justify-between border-b border-base-border py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-200">Security</p>
            <p className="mt-0.5 text-xs text-slate-500">Password & two-factor authentication.</p>
          </div>
          <button className="rounded-lg border border-base-border px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">
            Manage
          </button>
        </div>
        <div className="flex items-center justify-between py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-200">Sign out</p>
            <p className="mt-0.5 text-xs text-slate-500">End your current session.</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-risk-critical/30 bg-risk-critical/10 px-3 py-1.5 text-xs font-medium text-risk-critical hover:bg-risk-critical/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </GlassCard>

      <p className="text-center text-[11px] text-slate-600">
        Appearance and notification preferences are session-only for now — persistence is on the
        roadmap.
      </p>
    </div>
  );
}
