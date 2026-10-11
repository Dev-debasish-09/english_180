import { Outlet } from "react-router-dom";
import { DayStageBadge } from "./DayStageBadge";
import { NavBar } from "./NavBar";
import { useSettings } from "../hooks/useSettings";
import { updateSettings } from "../db/db";

export function Layout() {
  const settings = useSettings();

  function toggleDarkMode() {
    if (!settings) return;
    updateSettings({ darkMode: !settings.darkMode });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-bold">English180</h1>
        <div className="flex items-center gap-3">
          <DayStageBadge />
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700"
            aria-label="Toggle dark mode"
          >
            {settings?.darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </header>

      <div className="sm:flex sm:flex-1">
        <NavBar />
        <main className="flex-1 p-4 pb-20 sm:pb-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
