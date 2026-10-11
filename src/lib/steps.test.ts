import { describe, expect, it } from "vitest";
import type { DailyProgress } from "../db/types";
import { buildStepStates, getActiveStep, isDayFullyDone, STEP_ORDER } from "./steps";

const SUNDAY = "2023-01-01"; // extra is required this day
const MONDAY = "2023-01-02"; // extra is optional this day

function emptyProgress(date: string): DailyProgress {
  return {
    date,
    dayNumber: 1,
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
}

describe("task locking", () => {
  it("with no progress, only the first step is active and the rest are locked", () => {
    const states = buildStepStates(MONDAY, undefined);
    expect(states[0].status).toBe("active");
    for (const s of states.slice(1)) {
      expect(s.status).toBe("locked");
    }
  });

  it("finishing a step unlocks exactly the next one", () => {
    const progress = { ...emptyProgress(MONDAY), warmupDone: true };
    const states = buildStepStates(MONDAY, progress);
    expect(states[0].status).toBe("done");
    expect(states[1].status).toBe("active");
    expect(states[2].status).toBe("locked");
  });

  it("cannot skip ahead: the mentor screen still points at the earliest unfinished step", () => {
    // grammarDone is true but warmup never happened. The UI only ever
    // acts on getActiveStep(), so it must still point at warmup, not
    // let the user jump to (or past) grammar out of order.
    const progress = { ...emptyProgress(MONDAY), grammarDone: true };
    const states = buildStepStates(MONDAY, progress);
    expect(getActiveStep(states)?.key).toBe("warmup");
  });

  it("on a weekday, extra is not required and doesn't block end-of-day from becoming active", () => {
    const allButExtra = STEP_ORDER.filter((s) => s.key !== "extra" && s.key !== "endOfDay").reduce(
      (acc, def) => ({ ...acc, [def.taskField]: true }),
      emptyProgress(MONDAY),
    );
    const states = buildStepStates(MONDAY, allButExtra);
    const extra = states.find((s) => s.key === "extra")!;
    const endOfDay = states.find((s) => s.key === "endOfDay")!;
    expect(extra.required).toBe(false);
    expect(extra.status).toBe("active"); // still offered, just skippable
    expect(endOfDay.status).toBe("active"); // not blocked by the skippable extra step
    expect(getActiveStep(states)?.key).toBe("extra"); // but the mentor screen shows extra first
  });

  it("on a Sunday, extra is required and blocks end-of-day until done", () => {
    const allButExtra = STEP_ORDER.filter((s) => s.key !== "extra" && s.key !== "endOfDay").reduce(
      (acc, def) => ({ ...acc, [def.taskField]: true }),
      emptyProgress(SUNDAY),
    );
    const states = buildStepStates(SUNDAY, allButExtra);
    const extra = states.find((s) => s.key === "extra")!;
    const endOfDay = states.find((s) => s.key === "endOfDay")!;
    expect(extra.required).toBe(true);
    expect(endOfDay.status).toBe("locked");
  });

  it("a day is only fully done once every required step is done", () => {
    const allDone = STEP_ORDER.reduce(
      (acc, def) => ({ ...acc, [def.taskField]: true }),
      emptyProgress(MONDAY),
    );
    const states = buildStepStates(MONDAY, allDone);
    expect(isDayFullyDone(states)).toBe(true);
  });

  it("a day is not done while a required step is missing", () => {
    const states = buildStepStates(MONDAY, emptyProgress(MONDAY));
    expect(isDayFullyDone(states)).toBe(false);
  });
});
