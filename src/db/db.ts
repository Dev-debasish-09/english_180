import Dexie, { type Table } from "dexie";
import type { DailyProgress, Settings, TaskKey } from "./types";
import { todayISO } from "../lib/date";

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
    // v2: moved from a 4-flag dailyProgress shape to an 8/9-step one.
    this.version(2)
      .stores({ settings: "id", dailyProgress: "date, dayNumber" })
      .upgrade((tx) => tx.table("dailyProgress").clear());
    // v3: removed the locked "extra"/"endOfDay" steps in favour of 8
    // unlocked tasks (added "listen", dropped "extra" and "endOfDay").
    this.version(3)
      .stores({ settings: "id", dailyProgress: "date, dayNumber" })
      .upgrade((tx) => tx.table("dailyProgress").clear());
  }
}

export const db = new English180DB();

const SETTINGS_DEFAULTS: Settings = {
  id: SETTINGS_ID,
  startDate: todayISO(),
  dailyMinutes: 60,
  darkMode: false,
  notificationTime: null,
  whyReason: null,
  whyGoal: null,
  milestonesSeen: [],
};

// Makes sure the single settings row exists, AND backfills any fields
// that were added after this row was first created (so an older,
// partial settings object never crashes code that expects a newer
// field to exist). Call once on app startup.
export async function ensureSettings(): Promise<Settings> {
  const existing = await db.settings.get(SETTINGS_ID);
  if (!existing) {
    await db.settings.put(SETTINGS_DEFAULTS);
    return SETTINGS_DEFAULTS;
  }

  const merged: Settings = { ...SETTINGS_DEFAULTS, ...existing };
  const wasMissingFields = Object.keys(SETTINGS_DEFAULTS).some((key) => !(key in existing));
  if (wasMissingFields) {
    await db.settings.put(merged);
  }
  return merged;
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
    listenDone: false,
    writingDone: false,
    speakingDone: false,
  };
  await db.dailyProgress.put(fresh);
  return fresh;
}

function isDayComplete(p: DailyProgress): boolean {
  return (
    p.warmupDone &&
    p.watchDone &&
    p.grammarDone &&
    p.readingDone &&
    p.vocabularyDone &&
    p.listenDone &&
    p.writingDone &&
    p.speakingDone
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

// Saves a note for a "link" task (Watch/Read/Listen) and ticks it only
// once the note is at least 20 words.
export async function saveTaskNote(
  date: string,
  dayNumber: number,
  noteField: "watchNote" | "readNote" | "listenNote",
  taskField: "watchDone" | "readingDone" | "listenDone",
  note: string,
): Promise<DailyProgress> {
  const existing = await getOrCreateDailyProgress(date, dayNumber);
  const wordCount = note.trim().split(/\s+/).filter(Boolean).length;
  const done = wordCount >= 20;

  const updated: DailyProgress = { ...existing, [noteField]: note, [taskField]: done };
  updated.completedAt = isDayComplete(updated) ? new Date().toISOString() : undefined;

  await db.dailyProgress.put(updated);
  return updated;
}
