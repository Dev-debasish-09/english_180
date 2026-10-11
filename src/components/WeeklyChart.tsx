import type { DailyProgress } from "../db/types";
import { countStepsDone, weekdayLabel } from "../lib/stats";

interface WeeklyChartProps {
  // The 7 dates of the current week ("YYYY-MM-DD"), in order.
  weekDates: string[];
  records: DailyProgress[];
}

// Simple bar chart (no charting library yet) showing how many of the
// 4 daily tasks were completed on each day of the current week.
// A fuller chart library gets added during polish in Phase 5.
export function WeeklyChart({ weekDates, records }: WeeklyChartProps) {
  const byDate = new Map(records.map((r) => [r.date, r]));

  return (
    <div className="flex items-end gap-3" style={{ height: 120 }}>
      {weekDates.map((date) => {
        const rec = byDate.get(date);
        const { done, required } = rec ? countStepsDone(rec) : { done: 0, required: 8 };
        const heightPercent = (done / required) * 100;

        return (
          <div key={date} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-20 w-full items-end">
              <div
                className="w-full rounded-t-md bg-indigo-500 transition-all dark:bg-indigo-400"
                style={{ height: `${heightPercent}%` }}
                title={`${done} / ${required} steps`}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {weekdayLabel(date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
