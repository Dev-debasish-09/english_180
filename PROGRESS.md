# English180 - Progress

## Big change #3 (2026-10-11): "Watch and learn" + real learning resources

Adds one new daily step and a real map of free external resources, matched
to the curriculum. Summary:

- **New step: "Watch and learn" (10-15 min), before Grammar.** Each day
  points at one video matched to that day's grammar topic (channel +
  topic, e.g. "Dear Sir" + "articles a an the"). The app never hardcodes
  a video URL — it builds a YouTube search link at runtime
  (`https://www.youtube.com/results?search_query=...`) and opens it in a
  new tab. After watching, you must type 3 things you learned (20+ words
  total) before the next step unlocks; that note is saved. There's also
  an optional field to paste the exact video link you watched, saved for
  revision.
- **Resource map by stage**, stored in one editable `resources.json`,
  grouped by stage and skill:
  - **Stage 1 (days 1-60, Hindi-explained)**: grammar — Dear Sir, English
    Connection; grammar practice — British Council LearnEnglish;
    listening — BBC Learning English; reading — VOA Learning English;
    speaking — Learnex, Let's Talk.
  - **Stage 2 (days 61-120, English only)**: grammar — engVid, English
    with Lucy, Oxford Online English; listening/shadowing — BBC 6 Minute
    English, TED-Ed; reading — The Hindu editorials, Indian Express
    editorials; pronunciation — Rachel's English, YouGlish; speaking —
    IELTS Liz, E2 IELTS.
  - **Stage 3 (days 121-180, exam level)**: GMAT verbal — GMAT Ninja,
    GMAT Club, mba.com; vocabulary — Magoosh GMAT flashcards,
    Vocabulary.com; reading — Aeon, The Hindu lead editorial; IELTS —
    IELTS Advantage, British Council Take IELTS; UPSC — upsc.gov.in
    previous year papers, Yojana; listening — TED Talks.
- **Resources matched into the plan, not just listed**:
  - Every grammar topic gets one video search (channel + topic) from the
    correct stage's channel list.
  - **3 days a week**, the Reading step uses a real article from the
    stage's reading site instead of the built-in passage: you paste the
    article title, write a one-third summary, and list 5 new words
    (which go straight into your flashcards).
  - **2 days a week**, the Speaking step is shadowing one listening
    resource for 5 minutes, then recording yourself.
- **New "How to Study" guide page**, in very simple English with a Hindi
  line under each point: how to watch a lesson video (pause, write the
  rule, make 3 own sentences), how to read an editorial (meaning, then
  new words, then summary), how to shadow, and how to use a dictionary +
  YouGlish for a new word. The relevant guide section is shown
  automatically the first time each task type appears.
- **Resources page redesign**: grouped by stage and skill, one line on
  what each resource is for, your current stage marked "Use now," and
  higher stages shown but visually locked so you don't jump ahead.

### Updated daily mission (locked order)

1. Warm-up: flashcards + error-bank review (10 min)
2. **Watch and learn: one video matched to today's grammar topic (10-15 min) — new**
3. Grammar (15 min)
4. Reading + questions + summary, or a real article 3x/week (20 min)
5. New vocabulary (10 min)
6. Writing (15-20 min)
7. Speaking, or shadowing 2x/week (10 min)
8. Today's Extra (optional weekdays, required Sunday)
9. End-of-day card: scores, mistakes, tomorrow's focus

**Honest note on timing**: adding "Watch and learn," plus the extra
reading/writing overhead on real-article days and the 5-minute shadowing
on shadow days, pushes some days past the original 60-90 minute target
(more like 70-110+ minutes on a video/shadow/article day). Flagging this
now — happy to trim elsewhere (e.g. shorten warm-up, make the video step
5 min shorter) if 110 minutes on a heavy day is too much. Otherwise I'll
build it as specified and we can feel it out once Phase 2 content exists.

### Schema additions (`day-NNN.json` and `resources.json`)

```jsonc
// day-NNN.json — new/changed fields only
{
  "watch": { "channel": "Dear Sir", "topic": "articles a an the", "minMinutes": 12 },
  "reading": {
    "mode": "builtin", // or "external" (3x/week): user pastes article title + summary + 5 words instead
    // ...existing passage/questions/summary fields, used when mode is "builtin"
  },
  "speaking": {
    "mode": "builtin", // or "shadow-resource" (2x/week)
    "shadowResource": { "channel": "BBC 6 Minute English", "topic": "", "minMinutes": 5 }
    // ...existing fields, used when mode is "builtin"
  }
}
```

```jsonc
// resources.json — shape
{
  "stages": {
    "foundation": { "resources": [ { "skill": "grammar", "name": "Dear Sir", "url": "https://www.youtube.com/@DearSirCT", "note": "Hindi-explained grammar lessons, one topic at a time." } ] },
    "building": { "resources": [ /* ... */ ] },
    "exam": { "resources": [ /* ... */ ] }
  },
  "booksToBuy": [ { "title": "High School English Grammar", "author": "Wren & Martin" } ]
}
```

The YouTube search link is always built at runtime from `channel` +
`topic` (URL-encoded, spaces as `+`) — never a stored/hardcoded video URL.

### Where this lands in the phase plan

- **Phase 1** (infra): **Done.** The "Watch and learn" step is in the
  locked order (data model + Home screen step list + a stub page at
  `/watch`, same pattern as Grammar/Reading/etc. — real functionality
  ships in Phase 2). The "How to Study" guide page is built at `/guide`
  with all 4 sections (English + Hindi). A YouTube search-link builder
  (`src/lib/youtube.ts`) exists and is ready for Phase 2 to use — it
  takes a channel + topic and builds the search URL at runtime, nothing
  hardcoded.
- **Phase 2** (Grammar + Vocabulary + Error bank + days 1-30 content):
  the real "Watch and learn" page (search-link button, 20-word notes
  gate, saved video link) ships here, alongside Grammar, since every
  video is matched to that day's grammar topic.
- **Phase 3** (Reading + Writing): adds the 3x/week external-article mode
  (paste title, summary, 5 words → flashcards).
- **Phase 4** (Speaking): adds the 2x/week shadow-resource mode.
- **Phase 5** (Resources, reminders, catch-up, Sunday report, backup,
  README): the full Resources page (grouped, "Use now," stage-locked
  visuals) and `resources.json` content.
- Each module, when it's built, triggers its matching "How to Study"
  guide section the first time that task type appears.

---

## Big change #2 (2026-10-11): frontend-only, fixed curriculum, self-checked

This replaces the AI-mentor plan from the update before it. Summary:

- **No backend, no AI, no API key.** English180 is 100% frontend (React
  + Vite + TypeScript + Tailwind, data in IndexedDB).
- **The plan is fixed, not generated.** All 180 days are pre-written by
  me (Claude) ahead of time and shipped as data.
- **Content is original, authored up front**, one JSON file per day
  (`/src/content/day-001.json` ... `day-180.json`), built in batches of
  30 days. Nothing copied from books or websites.
- **Self-check replaces AI feedback**: side-by-side model-answer
  comparison + checklist + self-score; key-points checklist for
  summaries; Web Speech API transcript/WPM/filler-count + recording
  playback for speaking.
- **Error bank stays rule-based**: wrong answers come back after 3 days
  and again after 7 days (vocabulary flashcards use SM-2 separately).
- Mentor rules carry over: locked task order, minimum word counts,
  repeat a quiz below 70%, catch-up after missed days, Sunday report,
  reminders — all plain rules, no AI.

### Curriculum backbone (proven methods, our own original content)

- **Grammar** — Wren & Martin's topic order (+ the Odia-speaker mistake
  for each topic): parts of speech → sentence structure → nouns/pronouns
  → verbs & tenses → articles → prepositions → subject-verb agreement →
  adjectives/adverbs (Foundation) → modals → active/passive →
  direct/indirect speech → conditionals → clauses →
  connectors/punctuation (Building) → sentence transformation/synthesis
  → GMAT Sentence Correction error-spotting (Exam).
- **Vocabulary** — Word Power Made Easy style root-based learning + SM-2,
  10-20 words/day by stage, ending on GMAT-level lists. English, Hindi,
  and Odia meanings.
- **Reading** — graded passages (simple → editorial-style → GMAT RC
  style), 5 questions per passage with an explanation for every option,
  plus a model summary.
- **Writing** — sentence → paragraph → precis → UPSC Mains 150/250-word
  answers → 1000-1200 word essays.
- **Speaking** — shadowing → reading aloud → IELTS Part 1/2/3, with
  recording, playback, and a spoken model answer.

### Revised phase plan (superseded further by Big change #3 above for phase content, not numbering)

1. Setup, database, content schema, mentor home screen with locked
   tasks, dashboard
2. Grammar, vocabulary, and error bank, **with content for days 1-30**
3. Reading and writing with self-check
4. Speaking with recording and transcript
5. Resources page, reminders, catch-up logic, Sunday report, backup,
   README
6. Content for days 31-180, in batches of 30 (stop after each batch for
   review)

**Honest note on scope**: writing 180 days of original content by hand
is a large amount of work, even in 30-day batches — expect each content
batch in Phase 6 to take real effort to review carefully.

---

## Phase 1: Setup, database, content schema, mentor home screen, dashboard

**Status: DONE**, including the Big change #3 additions (Watch and
learn step + How to Study guide page).

What was built:
- Dexie (IndexedDB) database (`src/db/db.ts`) with `settings` (start
  date, daily minutes, dark mode, notification time) and `dailyProgress`
  (one row per date, with a boolean per step: warmup, grammar, reading,
  vocabulary, writing, speaking, extra, end-of-day, plus a
  `completedAt` once the day's required steps are done).
- 180-day plan logic (`src/lib/plan.ts`): 3 stages (Foundation 1-60,
  Building 61-120, Exam 121-180), day-number math.
- Content schema + loader (`src/content/types.ts`): the `DayContent`
  TypeScript shape (grammar/reading/vocabulary/writing/speaking/extra)
  and a loader that reads `day-NNN.json` files when they exist, with a
  graceful fallback when they don't (no content files exist yet —
  that's Phase 2).
- Locked daily order (`src/lib/steps.ts`): the 9 steps (Warm-up, Watch
  and learn, Grammar, Reading, Vocabulary, Writing, Speaking, Today's
  Extra, End-of-day) in fixed order, each `locked` / `active` / `done`,
  with "Today's Extra" required only on Sunday and otherwise skippable
  without blocking the rest of the day.
- Mentor home screen (`src/pages/Home.tsx`): shows only the current
  active step ("Do this now") with a Start button; module steps route to
  a stub page; Warm-up and End-of-day mark done directly from the Home
  card since they have no dedicated page yet.
- Stats moved to a separate Progress page (`src/pages/Progress.tsx`):
  streak, 5 skill-progress bars, weekly chart, 12-week heatmap.
- Nav bar shows Home, Watch, Grammar, Reading, Vocabulary, Writing,
  Speaking, Resources, Guide, Progress, Settings — module links show a
  lock icon and aren't clickable until that step is reachable today
  (Guide and Progress are always open).
- Settings: start date, daily minutes, dark mode, daily reminder time
  (saved now; the notification itself is wired up in Phase 5).

Not done yet (later phases):
- No git repo (user chose to skip git).
- Real grammar/reading/vocabulary/writing/speaking/watch-and-learn
  content — module pages (including `/watch`) are stub pages with a
  "mark done" demo button.
- Resources page content/`resources.json`, reminders, catch-up/recovery
  logic, Sunday report, backup — all later phases (see Big change #3
  above for exactly where each lands).
- The guide page doesn't yet auto-show its matching section the first
  time a task type appears — that trigger gets wired into each module
  as it's built (Phase 2 onward).

---

**Current status: Phase 1 (including the Watch-and-learn + Guide page
additions) is done and running. Next: Phase 2 — Grammar + Vocabulary +
Error bank + Watch-and-learn's real page, with content for days 1-30.**
