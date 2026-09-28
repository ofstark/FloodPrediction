import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, CircleUser, LogOut, ChevronDown } from "lucide-react";
import StatusIndicator from "@/components/common/StatusIndicator";
import { useAuth } from "@/context/AuthContext";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/map": "Risk Map",
  "/predictions": "Predictions",
  "/alerts": "Alerts",
  "/historical": "Historical Events",
  "/data-sources": "Data Sources",
  "/system": "System Status",
  "/settings": "Settings",
};

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = titles[pathname] ?? "Dashboard";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-base-border bg-base-900/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-sm text-slate-400">
          <span className="text-slate-600">FloodGuard /</span>{" "}
          <span className="font-medium text-slate-200">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-base-border bg-white/[0.03] px-3 py-1.5 md:flex">
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <input
            placeholder="Search locations, alerts..."
            className="w-40 bg-transparent text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none lg:w-56"
          />
        </div>

        <StatusIndicator label="Live Monitoring" color="cyan" className="hidden sm:flex" />

        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-critical ring-2 ring-base-900" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-base-border py-1 pl-1 pr-2 hover:bg-white/5"
          >
            <CircleUser className="h-6 w-6 text-slate-400" />
            <span className="hidden text-xs font-medium text-slate-300 sm:inline">
              {user?.username ?? "Astra"}
            </span>
            <ChevronDown className="hidden h-3 w-3 text-slate-500 sm:inline" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-base-border bg-base-900/95 p-1.5 shadow-card backdrop-blur-xl">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
