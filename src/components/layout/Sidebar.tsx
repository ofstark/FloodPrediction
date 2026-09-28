import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  BellRing,
  History,
  Database,
  Activity,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/cn";
import StatusIndicator from "@/components/common/StatusIndicator";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const overview: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Risk Map", icon: Map },
  { to: "/predictions", label: "Predictions", icon: BrainCircuit },
];

const monitoring: NavItem[] = [
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/historical", label: "Historical Events", icon: History },
  { to: "/data-sources", label: "Data Sources", icon: Database },
];

const system: NavItem[] = [
  { to: "/system", label: "System Status", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavGroup({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {title}
        </p>
      )}
      <div className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-blue/15 text-accent-electric shadow-glow-sm border border-accent-blue/25"
                  : "text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-200"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed z-40 flex h-screen flex-col border-r border-base-border bg-base-900/95 backdrop-blur-xl transition-all duration-300 lg:static lg:translate-x-0",
          collapsed ? "w-[76px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-base-border px-4 py-5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
              <Waves className="h-4.5 w-4.5 text-accent-cyan" />
            </div>
            {!collapsed && (
              <span className="truncate font-display text-lg font-bold tracking-wide text-white">
                FLOODGUARD
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-300 lg:flex"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <NavGroup title="Overview" items={overview} collapsed={collapsed} />
          <NavGroup title="Monitoring" items={monitoring} collapsed={collapsed} />
          <NavGroup title="System" items={system} collapsed={collapsed} />
        </nav>

        <div className="border-t border-base-border px-4 py-4">
          <StatusIndicator label="System Online" color="green" />
          {!collapsed && (
            <p className="mt-2 text-[11px] text-slate-600">Team Astra</p>
          )}
        </div>
      </aside>
    </>
  );
}
