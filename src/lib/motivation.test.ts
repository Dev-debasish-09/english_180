import { describe, expect, it } from "vitest";
import type { DailyProgress } from "../db/types";
import { countMissedDaysBeforeToday, getNewlyReachedMilestone, MILESTONES } from "./motivation";
import { getMentorMessage } from "../content/mentorMessages";

function completedDay(date: string, dayNumber: number): DailyProgress {
  return {
    date,
    dayNumber,
    warmupDone: true,
    watchDone: true,
    grammarDone: true,
    readingDone: true,
    vocabularyDone: true,
    writingDone: true,
    speakingDone: true,
    extraDone: true,
    endOfDayDone: true,
    completedAt: `${date}T20:00:00.000Z`,
  };
}

describe("countMissedDaysBeforeToday", () => {
  it("is 0 on Day 1 (nothing before it to miss)", () => {
    expect(countMissedDaysBeforeToday([], "2026-01-01", 1)).toBe(0);
  });

  it("is 0 if yesterday was completed", () => {
    const records = [completedDay("2026-01-09", 9)];
    expect(countMissedDaysBeforeToday(records, "2026-01-10", 10)).toBe(0);
  });

  it("counts consecutive incomplete days immediately before today", () => {
    const records = [completedDay("2026-01-07", 7)];
    // day 8 and 9 have no completed record -> 2 missed days before day 10
    expect(countMissedDaysBeforeToday(records, "2026-01-10", 10)).toBe(2);
  });
});

describe("milestones", () => {
  it("covers streak 7 through 180 and matches the plan's round numbers", () => {
    expect(MILESTONES.map((m) => m.day)).toEqual([7, 30, 60, 90, 120, 150, 180]);
  });

  it("fires only once per milestone", () => {
    expect(getNewlyReachedMilestone(7, [])?.day).toBe(7);
    expect(getNewlyReachedMilestone(7, [7])).toBeNull();
    expect(getNewlyReachedMilestone(8, [])).toBeNull();
  });
});

describe("mentor messages", () => {
  it("produces a non-empty English and Hindi line for every day of the plan", () => {
    for (let day = 1; day <= 180; day++) {
      const stage = day <= 60 ? "foundation" : day <= 120 ? "building" : "exam";
      const msg = getMentorMessage(day, stage);
      expect(msg.en.length).toBeGreaterThan(0);
      expect(msg.hi.length).toBeGreaterThan(0);
    }
  });

  it("every day's message is textually distinct (day number is always embedded)", () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 180; day++) {
      const stage = day <= 60 ? "foundation" : day <= 120 ? "building" : "exam";
      const msg = getMentorMessage(day, stage);
      expect(seen.has(msg.en)).toBe(false);
      seen.add(msg.en);
    }
  });
});
