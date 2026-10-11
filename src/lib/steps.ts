import type { DailyProgress, StageId, StepKey, TaskKey } from "../db/types";
import type { DayContent } from "../content/types";
import { isExtraRequired } from "./date";

export interface StepDef {
  key: StepKey;
  taskField: TaskKey;
  label: string;
  minutesHint: number;
  navPath: string | null; // null = no dedicated module page yet (Phase 1)
}

export const STEP_ORDER: StepDef[] = [
  { key: "warmup", taskField: "warmupDone", label: "Warm-up", minutesHint: 10, navPath: null },
  { key: "watch", taskField: "watchDone", label: "Watch and learn", minutesHint: 13, navPath: "/watch" },
  { key: "grammar", taskField: "grammarDone", label: "Grammar", minutesHint: 15, navPath: "/grammar" },
  { key: "reading", taskField: "readingDone", label: "Reading", minutesHint: 20, navPath: "/reading" },
  { key: "vocabulary", taskField: "vocabularyDone", label: "Vocabulary", minutesHint: 10, navPath: "/vocabulary" },
  { key: "writing", taskField: "writingDone", label: "Writing", minutesHint: 20, navPath: "/writing" },
  { key: "speaking", taskField: "speakingDone", label: "Speaking", minutesHint: 10, navPath: "/speaking" },
  { key: "extra", taskField: "extraDone", label: "Today's Extra", minutesHint: 10, navPath: "/resources" },
  { key: "endOfDay", taskField: "endOfDayDone", label: "End-of-day card", minutesHint: 5, navPath: null },
];

// Plain-language fallback description for a step, used until that day's
// content file (day-NNN.json) exists. Once content exists, callers should
// prefer pulling a real title/prompt from it.
export function getStepFallbackDescription(key: StepKey, stage: StageId): string {
  const byStage: Record<StepKey, Record<StageId, string>> = {
    warmup: {
      foundation: "Review your flashcards and any error-bank sentences from past days.",
      building: "Review your flashcards and any error-bank sentences from past days.",
      exam: "Review your flashcards and any error-bank sentences from past days.",
    },
    watch: {
      foundation: "Watch a short video matched to today's grammar topic (Hindi-explained, e.g. Dear Sir).",
      building: "Watch a short video matched to today's grammar topic (English only, e.g. engVid, English with Lucy).",
      exam: "Watch a short video matched to today's grammar topic (exam-focused, e.g. GMAT Ninja).",
    },
    grammar: {
      foundation: "Today's grammar lesson: parts of speech and sentence basics, with exercises.",
      building: "Today's grammar lesson: clauses, connectors, and sentence patterns, with exercises.",
      exam: "Today's grammar: GMAT Sentence Correction style error-spotting practice.",
    },
    reading: {
      foundation: "Read a short, simple passage (150-250 words) and answer questions on it.",
      building: "Read an editorial-style passage (300-450 words) and answer questions on it.",
      exam: "Read a GMAT Reading Comprehension style passage (350-500 words), timed.",
    },
    vocabulary: {
      foundation: "Learn 10 new words with meanings in English, Hindi, and Odia.",
      building: "Learn 15 new words with meanings in English, Hindi, and Odia.",
      exam: "Learn 20 GMAT-level words with meanings in English, Hindi, and Odia.",
    },
    writing: {
      foundation: "Write a short paragraph (100-150 words), then compare with the model answer.",
      building: "Write a 250-word answer or a precis, then compare with the model answer.",
      exam: "Write a UPSC Mains answer or a full essay, timed, then compare with the model answer.",
    },
    speaking: {
      foundation: "Shadow or read aloud a short passage, then check your transcript.",
      building: "Practice an IELTS Part 1 and Part 2 (cue card) speaking task.",
      exam: "Do a full IELTS mock speaking test (Parts 1, 2, and 3).",
    },
    extra: {
      foundation: "Visit today's recommended free resource (optional on weekdays, required on Sunday).",
      building: "Visit today's recommended free resource (optional on weekdays, required on Sunday).",
      exam: "Visit today's recommended free resource (optional on weekdays, required on Sunday).",
    },
    endOfDay: {
      foundation: "See today's scores and mistakes, and tomorrow's focus.",
      building: "See today's scores and mistakes, and tomorrow's focus.",
      exam: "See today's scores and mistakes, and tomorrow's focus.",
    },
  };
  return byStage[key][stage];
}

// Pulls a short, real description from the day's content file when one
// exists, otherwise falls back to the generic by-stage text above.
export function getStepDescription(
  key: StepKey,
  stage: StageId,
  content: DayContent | null,
): string {
  if (!content) return getStepFallbackDescription(key, stage);

  switch (key) {
    case "watch":
      return `${content.watch.channel}: ${content.watch.topic} (${content.watch.minMinutes} min)`;
    case "grammar":
      return content.grammar.topic;
    case "reading":
      return `Passage: read it, answer 5 questions, then write a summary.`;
    case "vocabulary":
      return `${content.vocabulary.length} new words today.`;
    case "writing":
      return content.writing.prompt;
    case "speaking":
      return content.speaking.prompt;
    case "extra":
      return content.extra.task;
    default:
      return getStepFallbackDescription(key, stage);
  }
}

export type StepStatus = "done" | "active" | "locked";

export interface StepState extends StepDef {
  done: boolean;
  // false only for "extra" on a non-Sunday: it can be skipped without
  // blocking the rest of the day.
  required: boolean;
  status: StepStatus;
}

// Builds the ordered list of today's 9 steps with their lock state, given
// today's progress record (or undefined if nothing has been touched yet).
// A step that isn't required (the weekday "extra") doesn't block the next
// step from becoming active even while it's still undone — but it still
// shows as "active" itself first, since getActiveStep() always returns
// the earliest active step in order, with a "Skip for today" option.
export function buildStepStates(date: string, progress: DailyProgress | undefined): StepState[] {
  let previousDone = true; // step 1 is always unlocked

  return STEP_ORDER.map((def) => {
    const done = progress ? progress[def.taskField] : false;
    const required = def.key !== "extra" || isExtraRequired(date);

    const status: StepStatus = done ? "done" : previousDone ? "active" : "locked";
    // Only clears for the next step if this one was actually reachable
    // (previousDone) AND either done, or not required (skippable). A
    // locked, non-required step must stay locked — it doesn't un-block
    // the chain just because it's optional.
    previousDone = previousDone && (done || !required);

    return { ...def, done, required, status };
  });
}

export function getActiveStep(states: StepState[]): StepState | null {
  return states.find((s) => s.status === "active") ?? null;
}

export function isDayFullyDone(states: StepState[]): boolean {
  return states.every((s) => s.done || !s.required);
}
