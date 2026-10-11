import { describe, expect, it } from "vitest";
import { loadDayContent } from "../content/types";
import { getClampedDayNumber, getStageForDay } from "./plan";
import { READING_SITE_BY_STAGE } from "./resourceLinks";
import { buildYouTubeSearchUrl } from "./youtube";

// Proves the Day 1 / 61 / 121 / 180 behaviour end-to-end using the same
// functions Home.tsx calls, rather than hand-describing what "should"
// happen.
describe("day content + resource wiring", () => {
  it("Day 1 (Foundation) has real content with working Watch/Listen links", () => {
    const content = loadDayContent(1);
    expect(content).not.toBeNull();
    if (!content) return;

    expect(content.grammar.topic).toBe("Parts of Speech (overview)");
    expect(buildYouTubeSearchUrl(content.watch.channel, content.watch.topic)).toBe(
      "https://www.youtube.com/results?search_query=Dear+Sir+parts+of+speech+in+English+grammar",
    );
    expect(buildYouTubeSearchUrl(content.listen.channel, content.listen.theme)).toBe(
      "https://www.youtube.com/results?search_query=BBC+6+Minute+English+introducing+yourself+in+English",
    );
    expect(READING_SITE_BY_STAGE[getStageForDay(1).id].url).toBe(
      "https://learningenglish.voanews.com/",
    );
    expect(content.vocabulary.length).toBe(10);
  });

  it("Day 61 (first day of Building) has no content yet, but stage logic and reading link still work", () => {
    expect(loadDayContent(61)).toBeNull();
    const stage = getStageForDay(61);
    expect(stage.id).toBe("building");
    expect(READING_SITE_BY_STAGE[stage.id].name).toBe("The Hindu Editorials");
  });

  it("Day 121 (first day of Exam) has no content yet, but stage logic and reading link still work", () => {
    expect(loadDayContent(121)).toBeNull();
    const stage = getStageForDay(121);
    expect(stage.id).toBe("exam");
    expect(READING_SITE_BY_STAGE[stage.id].name).toBe("Aeon");
  });

  it("Day 180 (last day) resolves correctly even with a start date far in the past", () => {
    expect(getClampedDayNumber("2020-01-01", "2026-10-11")).toBe(180);
    expect(getStageForDay(180).id).toBe("exam");
    expect(loadDayContent(180)).toBeNull();
  });
});
