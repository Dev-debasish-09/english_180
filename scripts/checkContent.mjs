#!/usr/bin/env node
// Checks every /src/content/day-NNN.json file (and resources.json, once it
// exists) for completeness and obvious mistakes. Run with:
//   npm run check:content
//
// This never touches the network (resource links are checked for valid
// URL syntax only, not reachability), so it works offline.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "src", "content");
const TOTAL_DAYS = 180;

const STAGE_RULES = [
  { id: "foundation", dayStart: 1, dayEnd: 60, minWords: 150, maxWords: 250 },
  { id: "building", dayStart: 61, dayEnd: 120, minWords: 300, maxWords: 450 },
  { id: "exam", dayStart: 121, dayEnd: 180, minWords: 350, maxWords: 500 },
];

function stageForDay(day) {
  return STAGE_RULES.find((s) => day >= s.dayStart && day <= s.dayEnd);
}

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function dayFileName(day) {
  return `day-${String(day).padStart(3, "0")}.json`;
}

// Recursively collects every string value in an object/array, for
// placeholder-text scanning.
function collectStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

const PLACEHOLDER_PATTERNS = [/\btodo\b/i, /\blorem\b/i, /\bipsum\b/i, /\btbd\b/i, /\bxxx\b/i, /\bplaceholder\b/i];

function checkPlaceholders(day, content) {
  const strings = collectStrings(content);
  for (const s of strings) {
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(s)) {
        fail(`Day ${day}: placeholder text found (matches ${pattern}): "${s.slice(0, 60)}"`);
      }
    }
  }
  for (const s of strings) {
    if (s.trim() === "") {
      fail(`Day ${day}: an empty string was found somewhere in the content.`);
      break;
    }
  }
}

function checkSections(day, content) {
  const required = ["watch", "grammar", "reading", "vocabulary", "writing", "speaking", "extra"];
  for (const key of required) {
    if (content[key] === undefined || content[key] === null) {
      fail(`Day ${day}: missing section "${key}".`);
    }
  }
}

function checkGrammarExercises(day, content) {
  const exercises = content.grammar?.exercises ?? [];
  if (exercises.length < 10 || exercises.length > 15) {
    warn(`Day ${day}: grammar has ${exercises.length} exercises (expected 10-15).`);
  }
  exercises.forEach((ex, i) => {
    if (!ex.answer || !ex.explanation) {
      fail(`Day ${day}: grammar exercise ${i + 1} is missing an answer or explanation.`);
    }
  });
}

function checkReadingQuestions(day, content) {
  const questions = content.reading?.questions ?? [];
  if (questions.length !== 5) {
    warn(`Day ${day}: reading has ${questions.length} questions (expected 5).`);
  }
  questions.forEach((q, i) => {
    const options = q.options ?? [];
    const explanations = q.explanations ?? [];
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= options.length) {
      fail(`Day ${day}: reading question ${i + 1} has no valid single correct answer (correctIndex out of range).`);
    }
    if (explanations.length !== options.length) {
      fail(
        `Day ${day}: reading question ${i + 1} needs one explanation per option (${options.length} options, ${explanations.length} explanations).`,
      );
    }
  });
}

function checkPassageLength(day, content, stage) {
  const reading = content.reading;
  if (!reading) return;
  if (reading.wordCount < stage.minWords || reading.wordCount > stage.maxWords) {
    fail(
      `Day ${day}: reading.wordCount (${reading.wordCount}) is outside the ${stage.id} range (${stage.minWords}-${stage.maxWords}).`,
    );
  }
  if (typeof reading.passage === "string") {
    const actualWords = reading.passage.trim().split(/\s+/).filter(Boolean).length;
    if (Math.abs(actualWords - reading.wordCount) > reading.wordCount * 0.15) {
      warn(
        `Day ${day}: declared wordCount (${reading.wordCount}) doesn't match the actual passage length (${actualWords} words).`,
      );
    }
  }
}

function checkVocabulary(day, content, seenWords) {
  const words = content.vocabulary ?? [];
  words.forEach((w, i) => {
    if (!w.meaningEnglish || !w.meaningHindi || !w.meaningOdia) {
      fail(`Day ${day}: vocabulary word ${i + 1} ("${w.word}") is missing an English, Hindi, or Odia meaning.`);
    }
    if (!w.examples || w.examples.length !== 2) {
      fail(`Day ${day}: vocabulary word ${i + 1} ("${w.word}") needs exactly 2 example sentences.`);
    }
    const key = (w.word ?? "").trim().toLowerCase();
    if (!key) return;
    if (seenWords.has(key)) {
      fail(`Day ${day}: word "${w.word}" was already introduced on Day ${seenWords.get(key)}.`);
    } else {
      seenWords.set(key, day);
    }
  });
}

function checkResourcesFile() {
  const resourcesPath = path.join(CONTENT_DIR, "resources.json");
  if (!existsSync(resourcesPath)) {
    warn("resources.json does not exist yet (expected until Phase 5).");
    return;
  }
  let data;
  try {
    data = JSON.parse(readFileSync(resourcesPath, "utf-8"));
  } catch (e) {
    fail(`resources.json is not valid JSON: ${e.message}`);
    return;
  }
  const allEntries = [];
  for (const stage of Object.values(data.stages ?? {})) {
    for (const entry of stage.resources ?? []) allEntries.push(entry);
  }
  for (const entry of allEntries) {
    try {
      const url = new URL(entry.url);
      if (!["http:", "https:"].includes(url.protocol)) {
        fail(`resources.json: "${entry.name}" has a non-http(s) URL: ${entry.url}`);
      }
    } catch {
      fail(`resources.json: "${entry.name}" has an invalid URL: ${entry.url}`);
    }
  }
}

function main() {
  const existingDays = [];
  const missingDays = [];
  const seenWords = new Map();

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const filePath = path.join(CONTENT_DIR, dayFileName(day));
    if (!existsSync(filePath)) {
      missingDays.push(day);
      continue;
    }
    existingDays.push(day);

    let content;
    try {
      content = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (e) {
      fail(`Day ${day}: ${dayFileName(day)} is not valid JSON: ${e.message}`);
      continue;
    }

    const stage = stageForDay(day);
    checkSections(day, content);
    checkPlaceholders(day, content);
    checkGrammarExercises(day, content);
    checkReadingQuestions(day, content);
    checkPassageLength(day, content, stage);
    checkVocabulary(day, content, seenWords);
  }

  checkResourcesFile();

  console.log(`Day files found: ${existingDays.length} / ${TOTAL_DAYS}`);
  if (missingDays.length > 0) {
    console.log(`Missing days: ${summarizeRanges(missingDays)}`);
  }

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error("\nFAILED: fix the errors above.");
    process.exit(1);
  }

  console.log("\nOK: no errors in the content that exists so far.");
}

function summarizeRanges(numbers) {
  if (numbers.length === 0) return "none";
  const ranges = [];
  let start = numbers[0];
  let prev = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === prev + 1) {
      prev = numbers[i];
      continue;
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = numbers[i];
    prev = numbers[i];
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(", ");
}

main();
