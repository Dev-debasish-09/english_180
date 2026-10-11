import type { HeatmapDay } from "../lib/stats";

const levelClasses: Record<HeatmapDay["level"], string> = {
  none: "bg-slate-200 dark:bg-slate-800",
  partial: "bg-indigo-300 dark:bg-indigo-700",
  full: "bg-indigo-600 dark:bg-indigo-500",
};

interface HeatmapProps {
  days: HeatmapDay[];
}

// Simple calendar heatmap: one column per week, one cell per day,
// oldest week on the left. `days` must already be in chronological order.
export function Heatmap({ days }: HeatmapProps) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className={`h-3.5 w-3.5 rounded-sm ${levelClasses[day.level]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
