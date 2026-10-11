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

Every day has 8 tasks, shown as cards in a suggested order (nothing is
locked — open them in any order): Warm-up, Watch, Grammar, Read,
Vocabulary, Listen, Write, Speak. Watch/Read/Listen are "link" tasks —
they open an external site/video and tick once you save a 20+ word note
about what you learned. The others are "in-app" tasks with their own
page and a direct checkbox. Once all 8 are done, the day is complete.

The 180 days are split into 3 stages: Foundation (days 1-60), Building
(days 61-120), and Exam level (days 121-180) — shown everywhere as a
badge in the header, and used to pick the right external reading site
and video channels for each day.

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

## Deploying to Vercel

This is a static frontend app, so it deploys as-is, no environment
variables needed:

1. Push this repo to GitHub (already done for this project).
2. In Vercel, "Add New Project" → import the GitHub repo. Vercel
   auto-detects Vite: build command `npm run build`, output directory
   `dist`.
3. Deploy.

`vercel.json` in this repo rewrites every path to `index.html`, which
is required because the app uses client-side routing (React Router) —
without it, refreshing or sharing a direct link like `/settings` would
404 on Vercel's static hosting.

**Important**: your data lives in IndexedDB, which is tied to the
browser + origin you're using. Progress made at `localhost:5173` during
development will **not** appear on your deployed `*.vercel.app` URL (or
vice versa) — they're separate origins with separate storage. Once
you're using the deployed site for real, keep using that same URL.

## Backing up your data

Not built yet. Since everything lives in your browser's IndexedDB, until
export/import is added (planned for Phase 5) your data only exists on
the device and browser profile you used it in — avoid clearing
site data for this app, and avoid relying on it across multiple devices
for now.

## Project status

See `PROGRESS.md` for the full phase-by-phase plan and exactly what's
built so far versus still planned.
