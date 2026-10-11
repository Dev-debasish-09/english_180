# English180

A personal 180-day English learning app: Vocabulary (GMAT level), Writing
(UPSC Mains level), and Speaking (IELTS band 7+).

All your data (progress, words, writing, speaking) is saved in your
browser only (IndexedDB). There is no login and no server database.

## How to run it

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
   Chrome** (the Speaking module needs Chrome's speech features, added in
   a later phase).

To stop the app, go back to the terminal and press `Ctrl+C`.

## What works right now (Phase 1)

- Dashboard: today's day number and stage, a 4-task daily mission you can
  tick by hand, streak counter, skill progress bars, a weekly chart, and a
  12-week heatmap.
- Settings: change your Day 1 start date and daily study time, and switch
  dark mode on or off.
- Vocabulary, Writing, Speaking, and Review pages are placeholders for now
  — they are built in the next phases.

See `PROGRESS.md` for the full build plan and current status.
