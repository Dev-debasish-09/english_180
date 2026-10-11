import type { DailyProgress, StageId, StepKey, TaskKey } from "../db/types";
import type { DayContent } from "../content/types";

export type TaskKind = "in-app" | "link";

export interface StepDef {
  key: StepKey;
  taskField: TaskKey;
  label: string;
  minutesHint: number;
  kind: TaskKind;
  // Only for "in-app" tasks: the dedicated page to open.
  navPath: string | null;
}

// Suggested order for the day - not locked. You can do these in any order.
export const STEP_ORDER: StepDef[] = [
  { key: "warmup", taskField: "warmupDone", label: "Warm-up", minutesHint: 10, kind: "in-app", navPath: null },
  { key: "watch", taskField: "watchDone", label: "Watch", minutesHint: 10, kind: "link", navPath: null },
  { key: "grammar", taskField: "grammarDone", label: "Grammar", minutesHint: 15, kind: "in-app", navPath: "/grammar" },
  { key: "reading", taskField: "readingDone", label: "Read", minutesHint: 15, kind: "link", navPath: "/reading" },
  { key: "vocabulary", taskField: "vocabularyDone", label: "Vocabulary", minutesHint: 10, kind: "in-app", navPath: "/vocabulary" },
  { key: "listen", taskField: "listenDone", label: "Listen", minutesHint: 10, kind: "link", navPath: null },
  { key: "writing", taskField: "writingDone", label: "Write", minutesHint: 15, kind: "in-app", navPath: "/writing" },
  { key: "speaking", taskField: "speakingDone", label: "Speak", minutesHint: 10, kind: "in-app", navPath: "/speaking" },
];

export function getTaskNumber(key: StepKey): number {
  return STEP_ORDER.findIndex((s) => s.key === key) + 1;
}

// Plain-language fallback description, used until that day's content
// file (day-NNN.json) exists.
export function getStepFallbackDescription(key: StepKey, stage: StageId): string {
  const byStage: Record<StepKey, Record<StageId, string>> = {
    warmup: {
      foundation: "Review yesterday's words and any error-bank sentences.",
      building: "Review yesterday's words and any error-bank sentences.",
      exam: "Review yesterday's words and any error-bank sentences.",
    },
    watch: {
      foundation: "Watch a short video matched to today's grammar topic (Hindi-explained, e.g. Dear Sir).",
      building: "Watch a short video matched to today's grammar topic (English only, e.g. engVid).",
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
    listen: {
      foundation: "Listen to a short talk or episode, then write 5 sentences about what the speaker said.",
      building: "Listen to a short talk or episode, then write 5 sentences about what the speaker said.",
      exam: "Listen to a short talk or episode, then write 5 sentences about what the speaker said.",
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
  };
  return byStage[key][stage];
}

// Pulls a short, real one-line description from the day's content file
// when one exists, otherwise falls back to the generic by-stage text.
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
      return `Today's article, plus a built-in passage and 5 questions.`;
    case "vocabulary":
      return `${content.vocabulary.length} new words today.`;
    case "listen":
      return `${content.listen.channel}: ${content.listen.theme} (${content.listen.minMinutes} min)`;
    case "writing":
      return content.writing.prompt;
    case "speaking":
      return content.speaking.prompt;
    default:
      return getStepFallbackDescription(key, stage);
  }
}

export function countDoneTasks(progress: DailyProgress | undefined): number {
  if (!progress) return 0;
  return STEP_ORDER.filter((s) => progress[s.taskField]).length;
}

export function isDayFullyDone(progress: DailyProgress | undefined): boolean {
  if (!progress) return false;
  return STEP_ORDER.every((s) => progress[s.taskField]);
}
