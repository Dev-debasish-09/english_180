import { useNavigate } from "react-router-dom";
import { toggleTask } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";

export function VocabularyPage() {
  const navigate = useNavigate();
  const mission = useMissionSteps();

  if (!mission) return <p className="text-slate-500">Loading...</p>;
  const { today, content } = mission;

  function markDone() {
    toggleTask(today.dateStr, today.dayNumber, "vocabularyDone", true);
    navigate("/");
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-bold">Vocabulary</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Content for Day {today.dayNumber} hasn't been written yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      <h2 className="text-lg font-bold">Today's {content.vocabulary.length} words</h2>
      {content.vocabulary.map((w) => (
        <div
          key={w.word}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="font-bold">
            {w.word} <span className="text-xs font-normal text-slate-400">({w.partOfSpeech})</span>
          </p>
          <p className="text-sm">{w.meaningEnglish}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hindi: {w.meaningHindi} · Odia: {w.meaningOdia}
          </p>
          <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">{w.rootOrTrick}</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
            {w.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
          {(w.synonyms.length > 0 || w.antonyms.length > 0) && (
            <p className="mt-1 text-xs text-slate-400">
              {w.synonyms.length > 0 && <>Synonyms: {w.synonyms.join(", ")} </>}
              {w.antonyms.length > 0 && <>· Antonyms: {w.antonyms.join(", ")}</>}
            </p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={markDone}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Mark Vocabulary done
      </button>
    </div>
  );
}
