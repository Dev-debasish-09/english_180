import { NavLink } from "react-router-dom";
import { useMissionSteps } from "../hooks/useMissionSteps";
import type { StepKey } from "../db/types";

interface NavItem {
  to: string;
  label: string;
  stepKey?: StepKey; // if set, this link is locked until that step is reachable today
}

const links: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/watch", label: "Watch", stepKey: "watch" },
  { to: "/grammar", label: "Grammar", stepKey: "grammar" },
  { to: "/reading", label: "Reading", stepKey: "reading" },
  { to: "/vocabulary", label: "Vocabulary", stepKey: "vocabulary" },
  { to: "/writing", label: "Writing", stepKey: "writing" },
  { to: "/speaking", label: "Speaking", stepKey: "speaking" },
  { to: "/resources", label: "Resources", stepKey: "extra" },
  { to: "/guide", label: "Guide" },
  { to: "/progress", label: "Progress" },
  { to: "/settings", label: "Settings" },
];

export function NavBar() {
  const mission = useMissionSteps();

  // A module link is reachable once its step is active or already done
  // today — not while it's still locked behind an earlier step.
  function isUnlocked(stepKey?: StepKey): boolean {
    if (!stepKey || !mission) return true;
    const step = mission.steps.find((s) => s.key === stepKey);
    return !!step && step.status !== "locked";
  }

  return (
    <nav className="sticky bottom-0 z-10 flex overflow-x-auto border-t border-slate-200 bg-white/95 backdrop-blur sm:static sm:border-b sm:border-t-0 sm:px-4 sm:py-2 dark:border-slate-800 dark:bg-slate-900/95">
      {links.map((link) => {
        const unlocked = isUnlocked(link.stepKey);
        if (!unlocked) {
          return (
            <span
              key={link.to}
              title="Locked until today's earlier steps are done"
              className="flex-1 px-2 py-3 text-center text-xs font-medium text-slate-300 sm:flex-none sm:px-4 sm:py-2 sm:text-sm dark:text-slate-700"
            >
              {link.label} 🔒
            </span>
          );
        }
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex-1 whitespace-nowrap px-2 py-3 text-center text-xs font-medium sm:flex-none sm:rounded-md sm:px-4 sm:py-2 sm:text-sm ${
                isActive
                  ? "text-indigo-600 sm:bg-indigo-100 dark:text-indigo-400 dark:sm:bg-indigo-900"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
