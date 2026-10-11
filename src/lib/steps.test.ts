import { describe, expect, it } from "vitest";
import type { DailyProgress } from "../db/types";
import { countDoneTasks, isDayFullyDone, STEP_ORDER } from "./steps";

function emptyProgress(): DailyProgress {
  return {
    date: "2026-01-01",
    dayNumber: 1,
    warmupDone: false,
    watchDone: false,
    grammarDone: false,
    readingDone: false,
    vocabularyDone: false,
    listenDone: false,
    writingDone: false,
    speakingDone: false,
  };
}

describe("task completion (no locking)", () => {
  it("there are exactly 8 tasks", () => {
    expect(STEP_ORDER.length).toBe(8);
  });

  it("counts 0 done tasks with no progress", () => {
    expect(countDoneTasks(undefined)).toBe(0);
    expect(countDoneTasks(emptyProgress())).toBe(0);
  });

  it("counts done tasks regardless of order", () => {
    const progress = { ...emptyProgress(), speakingDone: true, warmupDone: true };
    expect(countDoneTasks(progress)).toBe(2);
  });

  it("a day is fully done only once all 8 tasks are true", () => {
    expect(isDayFullyDone(emptyProgress())).toBe(false);

    const allDone = STEP_ORDER.reduce(
      (acc, def) => ({ ...acc, [def.taskField]: true }),
      emptyProgress(),
    );
    expect(isDayFullyDone(allDone)).toBe(true);
  });
});
