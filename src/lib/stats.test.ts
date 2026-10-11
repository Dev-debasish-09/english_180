import { describe, expect, it } from "vitest";
import type { DailyProgress } from "../db/types";
import { computeStreak } from "./stats";

function completedDay(date: string, dayNumber: number): DailyProgress {
  return {
    date,
    dayNumber,
    warmupDone: true,
    watchDone: true,
    grammarDone: true,
    readingDone: true,
    vocabularyDone: true,
    listenDone: true,
    writingDone: true,
    speakingDone: true,
    completedAt: `${date}T20:00:00.000Z`,
  };
}

describe("streak calculation", () => {
  it("is 0 with no history", () => {
    expect(computeStreak([], "2026-01-10")).toBe(0);
  });

  it("counts consecutive completed days ending yesterday if today isn't done yet", () => {
    const records = [
      completedDay("2026-01-08", 8),
      completedDay("2026-01-09", 9),
    ];
    expect(computeStreak(records, "2026-01-10")).toBe(2);
  });

  it("counts today too once today is completed", () => {
    const records = [
      completedDay("2026-01-08", 8),
      completedDay("2026-01-09", 9),
      completedDay("2026-01-10", 10),
    ];
    expect(computeStreak(records, "2026-01-10")).toBe(3);
  });

  it("a gap breaks the streak", () => {
    const records = [
      completedDay("2026-01-05", 5), // gap here
      completedDay("2026-01-08", 8),
      completedDay("2026-01-09", 9),
    ];
    expect(computeStreak(records, "2026-01-10")).toBe(2);
  });
});
