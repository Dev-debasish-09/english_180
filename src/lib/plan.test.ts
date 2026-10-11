import { describe, expect, it } from "vitest";
import { getClampedDayNumber, getRawDayNumber, getStageForDay, STAGES } from "./plan";

describe("day number calculation", () => {
  it("day 1 is the start date itself", () => {
    expect(getRawDayNumber("2026-01-01", "2026-01-01")).toBe(1);
  });

  it("counts forward correctly", () => {
    expect(getRawDayNumber("2026-01-01", "2026-01-10")).toBe(10);
    expect(getRawDayNumber("2026-01-01", "2026-04-10")).toBe(100);
  });

  it("is negative/zero before the start date", () => {
    expect(getRawDayNumber("2026-01-10", "2026-01-01")).toBe(-8);
  });

  it("clamps to the 1-180 range", () => {
    expect(getClampedDayNumber("2026-01-10", "2026-01-01")).toBe(1);
    expect(getClampedDayNumber("2026-01-01", "2027-01-01")).toBe(180);
  });
});

describe("stage lookup", () => {
  it("day 1, 61, and 121 are the first day of each stage", () => {
    expect(getStageForDay(1).id).toBe("foundation");
    expect(getStageForDay(60).id).toBe("foundation");
    expect(getStageForDay(61).id).toBe("building");
    expect(getStageForDay(120).id).toBe("building");
    expect(getStageForDay(121).id).toBe("exam");
    expect(getStageForDay(180).id).toBe("exam");
  });

  it("the 3 stages cover all 180 days with no gaps or overlaps", () => {
    for (let day = 1; day <= 180; day++) {
      const matches = STAGES.filter((s) => day >= s.dayStart && day <= s.dayEnd);
      expect(matches.length).toBe(1);
    }
  });
});
