import { NavLink } from "react-router-dom";

// Fixed order: Today, Grammar, Reading, Vocabulary, Writing, Speaking,
// Resources, Progress, Settings. Nothing is locked - you can open any
// of these at any time. "Watch" and "Listen" don't have their own nav
// entry; they live as link+note cards on the Home screen.
const links = [
  { to: "/", label: "Today" },
  { to: "/grammar", label: "Grammar" },
  { to: "/reading", label: "Reading" },
  { to: "/vocabulary", label: "Vocabulary" },
  { to: "/writing", label: "Writing" },
  { to: "/speaking", label: "Speaking" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
  { to: "/settings", label: "Settings" },
];

export function NavBar() {
  return (
    <nav className="sticky bottom-0 z-10 flex overflow-x-auto border-t border-slate-200 bg-white/95 backdrop-blur sm:static sm:border-b sm:border-t-0 sm:px-4 sm:py-2 dark:border-slate-800 dark:bg-slate-900/95">
      {links.map((link) => (
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
      ))}
    </nav>
  );
}
