import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSettings } from "../db/db";
import { toggleTask, useAllProgress } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { getStepDescription } from "../lib/steps";
import { computeStreak } from "../lib/stats";
import {
  countMissedDaysBeforeToday,
  getComebackMessage,
  getDoneWellNote,
  getNewlyReachedMilestone,
} from "../lib/motivation";
import { getMentorMessage } from "../content/mentorMessages";

function WhyStartedGate() {
  const [reason, setReason] = useState("");
  const [goal, setGoal] = useState("");

  async function handleSave() {
    if (reason.trim().length < 3 || goal.trim().length < 3) return;
    await updateSettings({ whyReason: reason.trim(), whyGoal: goal.trim() });
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">Before you start: why?</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Write this once. You'll see it again on days you need it most.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Why are you doing this?</span>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. I want to clear my UPSC Mains essay paper"
          className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">What is your goal?</span>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. IELTS band 7+ by next year"
          className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        />
      </label>
      <button
        type="button"
        onClick={handleSave}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Start Day 1
      </button>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const mission = useMissionSteps();
  const allProgress = useAllProgress();

  if (!mission || !allProgress) {
    return <p className="text-slate-500">Loading...</p>;
  }

  const { today, content, steps, activeStep, dayComplete, progress } = mission;

  if (!today.settings.whyReason || !today.settings.whyGoal) {
    return <WhyStartedGate />;
  }

  const streak = computeStreak(allProgress, today.dateStr);
  const missedDays = countMissedDaysBeforeToday(allProgress, today.dateStr, today.dayNumber);
  const milestone = getNewlyReachedMilestone(streak, today.settings.milestonesSeen);
  const mentorMessage = getMentorMessage(today.dayNumber, today.stage.id);

  function markDone(taskField: (typeof steps)[number]["taskField"]) {
    toggleTask(today.dateStr, today.dayNumber, taskField, true);
  }

  if (milestone) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center dark:border-indigo-800 dark:bg-indigo-950">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Milestone — {milestone.title}
        </p>
        <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">
          {streak}-day streak
        </h2>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">{milestone.en}</p>
        <p className="text-sm text-indigo-500 dark:text-indigo-400">{milestone.hi}</p>
        <button
          type="button"
          onClick={() =>
            updateSettings({ milestonesSeen: [...today.settings.milestonesSeen, milestone.day] })
          }
          className="mx-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {missedDays > 0 && (
        <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          <p>{getComebackMessage(missedDays).en}</p>
          <p className="mt-1 text-amber-700 dark:text-amber-300">
            {getComebackMessage(missedDays).hi}
          </p>
          <p className="mt-2 text-xs italic">
            Your reason: "{today.settings.whyReason}" — your goal: "{today.settings.whyGoal}"
          </p>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/50">
        <p>{mentorMessage.en}</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{mentorMessage.hi}</p>
      </div>

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
          {progress && (
            <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              <p className="font-medium">One thing you did well today:</p>
              <p>{getDoneWellNote(progress).en}</p>
              <p className="text-emerald-500 dark:text-emerald-500">
                {getDoneWellNote(progress).hi}
              </p>
            </div>
          )}
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
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
        Note: module pages (Grammar, Reading, Vocabulary, Writing, Speaking, Resources, Watch and
        learn) are built in later phases. For now their "Start" buttons take you to a stub page
        where you can mark the step done by hand, to try out the locked order.
      </p>
    </div>
  );
}
