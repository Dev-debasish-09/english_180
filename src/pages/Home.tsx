import { useNavigate } from "react-router-dom";
import { toggleTask } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { getStepDescription } from "../lib/steps";

export function Home() {
  const navigate = useNavigate();
  const mission = useMissionSteps();

  if (!mission) {
    return <p className="text-slate-500">Loading...</p>;
  }

  const { today, content, steps, activeStep, dayComplete } = mission;

  function markDone(taskField: (typeof steps)[number]["taskField"]) {
    toggleTask(today.dateStr, today.dayNumber, taskField, true);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {today.notStartedYet && (
        <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Your plan start date is in the future. Change it in Settings if that's not right.
        </div>
      )}

      {today.planFinished ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            You have completed all 180 days.
          </p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">Great work.</p>
        </div>
      ) : dayComplete ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            Day {today.dayNumber} is done.
          </p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
            Come back tomorrow for Day {today.dayNumber + 1}.
          </p>
        </div>
      ) : activeStep ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Do this now - Day {today.dayNumber}, {today.stage.name} stage
          </p>
          <h2 className="mt-1 text-xl font-bold">{activeStep.label}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {getStepDescription(activeStep.key, today.stage.id, content)}
          </p>
          <p className="mt-1 text-xs text-slate-400">About {activeStep.minutesHint} minutes.</p>

          <div className="mt-4 flex gap-2">
            {activeStep.navPath ? (
              <button
                type="button"
                onClick={() => navigate(activeStep.navPath!)}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Start
              </button>
            ) : (
              <button
                type="button"
                onClick={() => markDone(activeStep.taskField)}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Start
              </button>
            )}
            {!activeStep.required && (
              <button
                type="button"
                onClick={() => markDone(activeStep.taskField)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Skip for today
              </button>
            )}
          </div>
        </div>
      ) : null}

      <ol className="flex flex-col gap-1 text-sm">
        {steps.map((step, i) => (
          <li
            key={step.key}
            className={`flex items-center gap-2 rounded-md px-2 py-1 ${
              step.status === "active" ? "font-medium text-indigo-700 dark:text-indigo-400" : ""
            } ${step.status === "locked" ? "text-slate-400 dark:text-slate-600" : ""}`}
          >
            <span className="w-4 text-center">
              {step.done ? "✓" : step.status === "locked" ? "🔒" : i + 1}
            </span>
            <span>{step.label}</span>
            {!step.required && !step.done && <span className="text-xs text-slate-400">(optional)</span>}
          </li>
        ))}
      </ol>

      <p className="text-center text-xs text-slate-400">
        Note: module pages (Grammar, Reading, Vocabulary, Writing, Speaking, Resources) are built in
        later phases. For now their "Start" buttons take you to a stub page where you can mark the
        step done by hand, to try out the locked order.
      </p>
    </div>
  );
}
