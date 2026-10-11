import type { DailyProgress, TaskKey } from "../db/types";
import { addDays, toISODate, parseISODate } from "./date";
import { countDoneTasks, STEP_ORDER } from "./steps";

// How many of the day's 8 tasks are done (out of 8 - there's no longer
// an optional/required distinction between tasks).
export function countStepsDone(rec: DailyProgress): { done: number; required: number } {
  return { done: countDoneTasks(rec), required: STEP_ORDER.length };
}

// Counts consecutive completed days ending today (or ending yesterday,
// if today is not finished yet — an unfinished "today" should not break
// a streak that is still in progress).
export function computeStreak(records: DailyProgress[], todayDate: string): number {
  const completedDates = new Set(
    records.filter((r) => r.completedAt).map((r) => r.date),
  );

  let cursor = todayDate;
  if (!completedDates.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (completedDates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Percentage of elapsed plan days (1..clampedDayNumber) where the given
// task was marked done. Used for the 3 skill progress bars.
export function computeSkillProgress(
  records: DailyProgress[],
  task: TaskKey,
  clampedDayNumber: number,
): number {
  if (clampedDayNumber <= 0) return 0;
  const doneCount = records.filter(
    (r) => r.dayNumber <= clampedDayNumber && r[task],
  ).length;
  return Math.round((doneCount / clampedDayNumber) * 100);
}

export type HeatmapLevel = "none" | "partial" | "full";

export interface HeatmapDay {
  date: string;
  level: HeatmapLevel;
}

// Builds the last `days` calendar days (oldest first) with a completion
// level for each, for the dashboard heatmap.
export function buildHeatmap(
  records: DailyProgress[],
  todayDate: string,
  days: number,
): HeatmapDay[] {
  const byDate = new Map(records.map((r) => [r.date, r]));
  const result: HeatmapDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(todayDate, -i);
    const rec = byDate.get(date);
    let level: HeatmapLevel = "none";
    if (rec) {
      const { done, required } = countStepsDone(rec);
      if (done >= required) level = "full";
      else if (done > 0) level = "partial";
    }
    result.push({ date, level });
  }
  return result;
}

export function weekdayLabel(date: string): string {
  return parseISODate(date).toLocaleDateString(undefined, { weekday: "short" });
}

export function isSameWeek(date: string, reference: string): boolean {
  const d = parseISODate(date);
  const r = parseISODate(reference);
  const dMonday = new Date(d);
  dMonday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const rMonday = new Date(r);
  rMonday.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return toISODate(dMonday) === toISODate(rMonday);
}
