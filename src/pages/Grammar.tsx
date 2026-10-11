import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleTask } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";

export function GrammarPage() {
  const navigate = useNavigate();
  const mission = useMissionSteps();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  if (!mission) return <p className="text-slate-500">Loading...</p>;
  const { today, content } = mission;

  function markDone() {
    toggleTask(today.dateStr, today.dayNumber, "grammarDone", true);
    navigate("/");
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-bold">Grammar</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Content for Day {today.dayNumber} hasn't been written yet.
        </p>
      </div>
    );
  }

  const { grammar } = content;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold">{grammar.topic}</h2>
        <p className="mt-2 text-sm">{grammar.rule}</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          {grammar.examples.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
        <div className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <strong>Common Odia-speaker mistake:</strong> {grammar.odiaNote}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 font-bold">Exercises</h3>
        <ol className="flex flex-col gap-3">
          {grammar.exercises.map((ex, i) => {
            const isRevealed = revealed.has(i);
            return (
              <li key={i} className="rounded-md border border-slate-100 p-3 dark:border-slate-800">
                <p className="text-sm font-medium">
                  {i + 1}. {ex.prompt}
                </p>
                {isRevealed ? (
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">
                      Answer: {ex.answer}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">{ex.explanation}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed(new Set(revealed).add(i))}
                    className="mt-2 text-sm text-indigo-600 underline dark:text-indigo-400"
                  >
                    Check answer
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <button
        type="button"
        onClick={markDone}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Mark Grammar done
      </button>
    </div>
  );
}
