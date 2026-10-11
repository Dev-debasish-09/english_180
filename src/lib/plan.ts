import type { StageId, StageInfo } from "../db/types";
import { diffInDays, todayISO } from "./date";

export const TOTAL_DAYS = 180;

export const STAGES: StageInfo[] = [
  {
    id: "foundation",
    name: "Foundation",
    dayStart: 1,
    dayEnd: 60,
    wordsPerDay: 10,
    description:
      "Grammar basics, sentence building, short speaking answers, and 100-150 word paragraphs.",
  },
  {
    id: "building",
    name: "Building",
    dayStart: 61,
    dayEnd: 120,
    wordsPerDay: 15,
    description:
      "IELTS Part 1 and 2 speaking, 250-word answers, and precis writing.",
  },
  {
    id: "exam",
    name: "Exam level",
    dayStart: 121,
    dayEnd: 180,
    wordsPerDay: 20,
    description:
      "GMAT-level words, full IELTS mock speaking tests, and UPSC essays and timed Mains answers.",
  },
];

// Raw day number: can be below 1 (plan hasn't started) or above 180
// (plan is finished). Callers decide how to handle those cases.
export function getRawDayNumber(startDate: string, today: string = todayISO()): number {
  return diffInDays(startDate, today) + 1;
}

// Day number clamped to the valid 1-180 range, for display and lookups.
export function getClampedDayNumber(startDate: string, today: string = todayISO()): number {
  const raw = getRawDayNumber(startDate, today);
  return Math.min(Math.max(raw, 1), TOTAL_DAYS);
}

export function getStageForDay(dayNumber: number): StageInfo {
  const clamped = Math.min(Math.max(dayNumber, 1), TOTAL_DAYS);
  return (
    STAGES.find((s) => clamped >= s.dayStart && clamped <= s.dayEnd) ??
    STAGES[STAGES.length - 1]
  );
}

export function getStageById(id: StageId): StageInfo {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage id: ${id}`);
  return stage;
}
