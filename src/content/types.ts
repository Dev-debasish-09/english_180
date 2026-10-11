// Shape of one day's authored content file: /src/content/day-NNN.json.

export interface WatchContent {
  channel: string; // e.g. "Dear Sir", "engVid", "GMAT Ninja"
  topic: string; // e.g. "articles a an the"
  minMinutes: number;
}

export interface GrammarExercise {
  type: "fill-blank" | "correct-error" | "rewrite" | "translate";
  prompt: string;
  answer: string;
  explanation: string;
}

export interface GrammarContent {
  topic: string;
  rule: string;
  examples: string[];
  odiaNote: string; // the common mistake Odia speakers make here, and why
  exercises: GrammarExercise[];
}

export interface ReadingQuestion {
  type: "main-idea" | "inference" | "tone" | "detail" | "vocab-in-context";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanations: string[]; // one explanation per option, same length as options
}

export interface ReadingContent {
  passage: string;
  wordCount: number;
  questions: ReadingQuestion[]; // 5 items
  summaryKeyPoints: string[];
  modelSummary: string;
}

export interface VocabularyWord {
  word: string;
  partOfSpeech: string;
  meaningEnglish: string;
  meaningHindi: string;
  meaningOdia: string;
  rootOrTrick: string;
  examples: string[]; // 2 items
  synonyms: string[];
  antonyms: string[];
}

export type WritingType = "sentence" | "paragraph" | "precis" | "upsc-answer" | "essay";

export interface WritingContent {
  prompt: string;
  type: WritingType;
  minWords: number;
  maxWords: number;
  timerMinutes?: number;
  modelAnswer: string;
  selfCheckList: string[];
}

export type SpeakingType = "shadowing" | "read-aloud" | "ielts-part1" | "ielts-part2" | "ielts-part3";

export interface SpeakingContent {
  type: SpeakingType;
  prompt: string;
  modelAnswerText: string; // read aloud via speech synthesis
  minSeconds: number;
  selfCheckList: string[];
}

export interface ListenContent {
  theme: string; // e.g. "ordering food at a restaurant"
  channel: string; // e.g. "BBC 6 Minute English", "TED-Ed"
  minMinutes: number;
}

export interface DayContent {
  day: number;
  stage: "foundation" | "building" | "exam";
  watch: WatchContent;
  grammar: GrammarContent;
  reading: ReadingContent;
  vocabulary: VocabularyWord[];
  listen: ListenContent;
  writing: WritingContent;
  speaking: SpeakingContent;
}

// Loads every day-NNN.json that exists yet. Using eager + import.meta.glob
// means this works even with zero content files and needs no changes as
// files are added in later phases.
const dayModules = import.meta.glob<{ default: DayContent }>("./day-*.json", {
  eager: true,
});

function dayFileKey(dayNumber: number): string {
  return `./day-${String(dayNumber).padStart(3, "0")}.json`;
}

// Returns the authored content for a day, or null if it hasn't been
// written yet.
export function loadDayContent(dayNumber: number): DayContent | null {
  const mod = dayModules[dayFileKey(dayNumber)];
  return mod ? mod.default : null;
}
