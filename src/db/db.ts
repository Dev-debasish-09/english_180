import Dexie, { type Table } from "dexie";
import type { DailyProgress, Settings, TaskKey } from "./types";
import { isExtraRequired, todayISO } from "../lib/date";

export const SETTINGS_ID = 1;

class English180DB extends Dexie {
  settings!: Table<Settings, number>;
  dailyProgress!: Table<DailyProgress, string>;

  constructor() {
    super("english180");
    this.version(1).stores({
      settings: "id",
      dailyProgress: "date, dayNumber",
    });
    // v1 shipped with a 4-flag dailyProgress shape (vocabDone/writingDone/
    // speakingDone/reviewDone). v2 moves to the 8-step locked mission.
    // No real progress data exists from v1 yet, so we just reset the
    // table shape instead of migrating old rows.
    this.version(2)
      .stores({
        settings: "id",
        dailyProgress: "date, dayNumber",
      })
      .upgrade((tx) => tx.table("dailyProgress").clear());
  }
}

export const db = new English180DB();

// Makes sure the single settings row exists. Call once on app startup.
export async function ensureSettings(): Promise<Settings> {
  const existing = await db.settings.get(SETTINGS_ID);
  if (existing) return existing;

  const defaults: Settings = {
    id: SETTINGS_ID,
    startDate: todayISO(),
    dailyMinutes: 60,
    darkMode: false,
    notificationTime: null,
    whyReason: null,
    whyGoal: null,
    milestonesSeen: [],
  };
  await db.settings.put(defaults);
  return defaults;
}

export async function updateSettings(changes: Partial<Omit<Settings, "id">>): Promise<void> {
  await db.settings.update(SETTINGS_ID, changes);
}

export async function getOrCreateDailyProgress(
  date: string,
  dayNumber: number,
): Promise<DailyProgress> {
  const existing = await db.dailyProgress.get(date);
  if (existing) return existing;

  const fresh: DailyProgress = {
    date,
    dayNumber,
    warmupDone: false,
    watchDone: false,
    grammarDone: false,
    readingDone: false,
    vocabularyDone: false,
    writingDone: false,
    speakingDone: false,
    extraDone: false,
    endOfDayDone: false,
  };
  await db.dailyProgress.put(fresh);
  return fresh;
}

function isDayComplete(p: DailyProgress): boolean {
  const extraOk = p.extraDone || !isExtraRequired(p.date);
  return (
    p.warmupDone &&
    p.watchDone &&
    p.grammarDone &&
    p.readingDone &&
    p.vocabularyDone &&
    p.writingDone &&
    p.speakingDone &&
    extraOk &&
    p.endOfDayDone
  );
}

export async function setTaskDone(
  date: string,
  dayNumber: number,
  task: TaskKey,
  done: boolean,
): Promise<DailyProgress> {
  const existing = await getOrCreateDailyProgress(date, dayNumber);
  const updated: DailyProgress = { ...existing, [task]: done };
  updated.completedAt = isDayComplete(updated) ? new Date().toISOString() : undefined;

  await db.dailyProgress.put(updated);
  return updated;
}
