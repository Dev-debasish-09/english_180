import { useLiveQuery } from "dexie-react-hooks";
import { db, setTaskDone } from "../db/db";
import type { TaskKey } from "../db/types";

// Live progress record for one date (undefined until any task on that
// date is touched, or while loading).
export function useDailyProgress(date: string) {
  return useLiveQuery(() => db.dailyProgress.get(date), [date]);
}

// All progress records, for streaks / heatmap / skill-progress stats.
export function useAllProgress() {
  return useLiveQuery(() => db.dailyProgress.toArray(), []);
}

export function toggleTask(date: string, dayNumber: number, task: TaskKey, done: boolean) {
  return setTaskDone(date, dayNumber, task, done);
}
