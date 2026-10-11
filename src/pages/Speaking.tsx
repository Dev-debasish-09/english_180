import { useNavigate } from "react-router-dom";
import { toggleTask } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";

function playModelAnswer(text: string) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function SpeakingPage() {
  const navigate = useNavigate();
  const mission = useMissionSteps();

  if (!mission) return <p className="text-slate-500">Loading...</p>;
  const { today, content } = mission;

  function markDone() {
    toggleTask(today.dateStr, today.dayNumber, "speakingDone", true);
    navigate("/");
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-bold">Speak</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Content for Day {today.dayNumber} hasn't been written yet.
        </p>
      </div>
    );
  }

  const { speaking } = content;
  const canPlay = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold">Today's speaking task</h2>
        <p className="mt-1 text-sm">{speaking.prompt}</p>
        <p className="mt-1 text-xs text-slate-400">At least {speaking.minSeconds} seconds.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-2 text-sm font-medium">Say your answer out loud now.</p>
        <p className="text-xs text-slate-400">
          Recording and automatic transcript scoring are coming in a later phase. For now, speak
          your answer, then listen to the model answer below and compare.
        </p>
        <button
          type="button"
          onClick={() => playModelAnswer(speaking.modelAnswerText)}
          disabled={!canPlay}
          className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300"
        >
          Play model answer
        </button>
        <p className="mt-2 text-sm italic">{speaking.modelAnswerText}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 font-bold">Self-check</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
          {speaking.selfCheckList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={markDone}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Mark Speaking done
      </button>
    </div>
  );
}
