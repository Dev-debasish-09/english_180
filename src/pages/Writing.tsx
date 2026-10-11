import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleTask } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { todayISO } from "../lib/date";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function draftStorageKey(): string {
  return `english180-write-draft-${todayISO()}`;
}

export function WritingPage() {
  const navigate = useNavigate();
  const mission = useMissionSteps();
  // Lazy-read from localStorage on first render, so refreshing mid-task
  // never loses a draft - no load effect needed.
  const [draft, setDraft] = useState(() => window.localStorage.getItem(draftStorageKey()) ?? "");
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey(), draft);
  }, [draft]);

  if (!mission) return <p className="text-slate-500">Loading...</p>;
  const { today, content } = mission;
  const wordCount = countWords(draft);

  function markDone() {
    toggleTask(today.dateStr, today.dayNumber, "writingDone", true);
    navigate("/");
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-bold">Write</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Content for Day {today.dayNumber} hasn't been written yet.
        </p>
      </div>
    );
  }

  const { writing } = content;
  const meetsMin = wordCount >= writing.minWords;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold">Today's prompt</h2>
        <p className="mt-1 text-sm">{writing.prompt}</p>
        <p className="mt-1 text-xs text-slate-400">
          {writing.minWords}-{writing.maxWords} words
          {writing.timerMinutes ? ` · ${writing.timerMinutes} min timer` : ""}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          placeholder="Write your answer here..."
          className="w-full rounded-md border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <p
          className={`mt-1 text-xs ${
            meetsMin ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
          }`}
        >
          {wordCount} words {meetsMin ? "- minimum reached" : `- need at least ${writing.minWords}`}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setShowModel(!showModel)}
          className="text-sm text-indigo-600 underline dark:text-indigo-400"
        >
          {showModel ? "Hide model answer" : "Compare with model answer"}
        </button>
        {showModel && (
          <>
            <p className="mt-2 text-sm italic">{writing.modelAnswer}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
              {writing.selfCheckList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <button
        type="button"
        onClick={markDone}
        disabled={!meetsMin}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        Mark Writing done
      </button>
      {!meetsMin && (
        <p className="text-center text-xs text-slate-400">
          Write at least {writing.minWords} words to mark this done.
        </p>
      )}
    </div>
  );
}
