import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { READING_SITE_BY_STAGE } from "../lib/resourceLinks";

// This page shows the day's built-in passage and questions for practice.
// Ticking "Read" happens on the Home screen via the 20-word note, not
// here - so there is no "mark done" button on this page.
export function ReadingPage() {
  const navigate = useNavigate();
  const mission = useMissionSteps();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [showPassage, setShowPassage] = useState(true);

  if (!mission) return <p className="text-slate-500">Loading...</p>;
  const { today, content } = mission;
  const site = READING_SITE_BY_STAGE[today.stage.id];

  if (!content) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-bold">Read</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Content for Day {today.dayNumber} hasn't been written yet.
        </p>
      </div>
    );
  }

  const { reading } = content;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today's article</h2>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Open article ({site.name})
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Go write your note (what you learned, 5 new words, or a short summary) back on the Home
          screen - that's what ticks this task.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold">Built-in passage ({reading.wordCount} words)</h3>
          <button
            type="button"
            onClick={() => setShowPassage(!showPassage)}
            className="text-sm text-indigo-600 underline dark:text-indigo-400"
          >
            {showPassage ? "Hide" : "Show"}
          </button>
        </div>
        {showPassage && <p className="text-sm leading-relaxed">{reading.passage}</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 font-bold">Questions</h3>
        <ol className="flex flex-col gap-4">
          {reading.questions.map((q, qi) => (
            <li key={qi}>
              <p className="text-sm font-medium">
                {qi + 1}. {q.prompt}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {q.options.map((opt, oi) => {
                  const isSelected = selected[qi] === oi;
                  const isCorrect = oi === q.correctIndex;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setSelected({ ...selected, [qi]: oi })}
                      className={`rounded-md border px-3 py-2 text-left text-sm ${
                        isSelected
                          ? isCorrect
                            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950"
                            : "border-red-400 bg-red-50 dark:bg-red-950"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {opt}
                      {isSelected && (
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                          {q.explanations[oi]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 font-bold">Summary key points</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          {reading.summaryKeyPoints.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">
          Model summary: {reading.modelSummary}
        </p>
      </section>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-700"
      >
        Back to Home
      </button>
    </div>
  );
}
