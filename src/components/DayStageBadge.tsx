import { useToday } from "../hooks/useToday";

// Small badge showing "Day X / 180 - Stage name". Used in the header so
// it is visible on every page.
export function DayStageBadge() {
  const today = useToday();
  if (!today) return null;

  const { dayNumber, stage, notStartedYet, planFinished } = today;

  let label = `Day ${dayNumber} / 180`;
  if (notStartedYet) label = "Not started yet";
  if (planFinished) label = "Day 180 / 180 - Done!";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
        {label}
      </span>
      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {stage.name}
      </span>
    </div>
  );
}
