# English180

A personal 180-day English learning plan: Vocabulary to GMAT level,
Writing to UPSC Mains level, and Speaking to IELTS band 7+ — with
grammar, reading, and extra resources matched to each stage, and
mentor-style tracking (locked daily order, streaks, milestones).

The app is 100% frontend — React + Vite + TypeScript + Tailwind CSS.
There is no backend, no AI, no login, and no server database. All your
data (settings, daily progress, your "why I started" note) is saved
only in your browser's IndexedDB, on your own device.

## How to install and run it

1. Install [Node.js](https://nodejs.org/) (version 20 or newer).
2. Open a terminal in this folder.
3. Install dependencies (only needed once, or after pulling new changes):
   ```
   npm install
   ```
4. Start the app:
   ```
   npm run dev
   ```
5. Open the link it prints (usually `http://localhost:5173`) in **Google
   Chrome** (the Speaking module needs Chrome's speech features).

To stop the app, go back to the terminal and press `Ctrl+C`.

### Other commands

```
npm run build          # Production build (also type-checks)
npm run lint            # Lint the code
npm run test            # Run the automated unit tests
npm run check:content   # Check the day-NNN.json content files for problems
```

## The daily mission

Every day has 9 steps, always in this locked order: Warm-up, Watch and
learn, Grammar, Reading, Vocabulary, Writing, Speaking, Today's Extra,
End-of-day card. You can't open a later step until the one before it is
done. "Today's Extra" is optional on weekdays and required on Sundays.

The 180 days are split into 3 stages: Foundation (days 1-60), Building
(days 61-120), and Exam level (days 121-180) — shown everywhere as a
badge in the header.

## How to add or edit a day's content

Each day's lesson lives in its own file: `src/content/day-NNN.json`
(e.g. `day-001.json`, `day-061.json`). The shape every file must follow
is defined in `src/content/types.ts` (the `DayContent` type) — it covers
the Watch-and-learn video topic, the Grammar lesson and exercises, the
Reading passage and questions, the day's Vocabulary words (with
English, Hindi, and Odia meanings), the Writing prompt, and the
Speaking task.

After adding or editing day files, run:

```
npm run check:content
```

This checks that: all 180 day files are accounted for (and tells you
exactly which ones exist so far), every section is present and not
empty, there's no leftover "TODO"/"lorem" placeholder text, every
grammar exercise and reading question has one correct answer and an
explanation, every vocabulary word has all 3 language meanings and 2
example sentences, no word repeats as a "new" word on two different
days, and the reading passage length matches the stage's word-count
range.

## How to add or edit resources

External links (free grammar/reading/speaking/listening resources) live
in one file: `src/content/resources.json`, grouped by stage and skill.
Edit that file directly to add, remove, or fix a link — `npm run
check:content` also checks that every URL in it is well-formed.

The app never hardcodes a specific video URL for "Watch and learn" — it
builds a YouTube search link from a channel name + topic at runtime
(see `src/lib/youtube.ts`), so there's nothing to keep updating there.

## Backing up your data

Not built yet. Since everything lives in your browser's IndexedDB, until
export/import is added (planned for Phase 5) your data only exists on
the device and browser profile you used it in — avoid clearing
site data for this app, and avoid relying on it across multiple devices
for now.

## Project status

See `PROGRESS.md` for the full phase-by-phase plan and exactly what's
built so far versus still planned.
