export type StageId = "foundation" | "building" | "exam";

export interface StageInfo {
  id: StageId;
  name: string;
  dayStart: number;
  dayEnd: number;
  wordsPerDay: number;
  description: string;
}

// There is always exactly one settings row, with id = 1.
export interface Settings {
  id: number;
  startDate: string; // "YYYY-MM-DD" — the date Day 1 begins
  dailyMinutes: number; // how many minutes the user plans to study each day
  darkMode: boolean;
  notificationTime: string | null; // "HH:MM" 24h, or null if reminders are off
  whyReason: string | null; // "Why I started" — my reason, written on first launch
  whyGoal: string | null; // "Why I started" — my goal, written on first launch
  milestonesSeen: number[]; // streak milestones (7/30/60/...) whose special screen was shown
}

// The 9 steps of the fixed daily mission, always in this order.
export type StepKey =
  | "warmup"
  | "watch"
  | "grammar"
  | "reading"
  | "vocabulary"
  | "writing"
  | "speaking"
  | "extra"
  | "endOfDay";

export type TaskKey =
  | "warmupDone"
  | "watchDone"
  | "grammarDone"
  | "readingDone"
  | "vocabularyDone"
  | "writingDone"
  | "speakingDone"
  | "extraDone"
  | "endOfDayDone";

// One row per calendar date. Created the first time any step for that
// date is touched.
export interface DailyProgress {
  date: string; // "YYYY-MM-DD", primary key
  dayNumber: number; // which day of the 180 this date was, when recorded
  warmupDone: boolean;
  watchDone: boolean;
  grammarDone: boolean;
  readingDone: boolean;
  vocabularyDone: boolean;
  writingDone: boolean;
  speakingDone: boolean;
  extraDone: boolean;
  endOfDayDone: boolean;
  completedAt?: string; // ISO datetime, set once the day's required steps are done
}
