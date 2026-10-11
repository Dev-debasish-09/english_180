import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { StepKey } from "../db/types";
import { saveTaskNote, updateSettings } from "../db/db";
import { toggleTask, useAllProgress } from "../hooks/useDailyProgress";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { getStepDescription, STEP_ORDER } from "../lib/steps";
import { computeStreak, countStepsDone, weekdayLabel } from "../lib/stats";
import { buildYouTubeSearchUrl } from "../lib/youtube";
import { READING_SITE_BY_STAGE } from "../lib/resourceLinks";
import { addDays, getWeekDates } from "../lib/date";
import {
  countMissedDaysBeforeToday,
  getComebackMessage,
  getDoneWellNote,
  getNewlyReachedMilestone,
} from "../lib/motivation";
import { getMentorMessage } from "../content/mentorMessages";

function WhyStartedBanner() {
  const [reason, setReason] = useState("");
  const [goal, setGoal] = useState("");
  const [open, setOpen] = useState(true);

  async function handleSave() {
    await updateSettings({
      whyReason: reason.trim() || null,
      whyGoal: goal.trim() || null,
    });
  }

  if (!open) return null;

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-800 dark:bg-indigo-950">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-indigo-800 dark:text-indigo-200">
          Why are you doing this? (optional, but worth writing)
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-indigo-500 underline"
        >
          Skip for now
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Your reason..."
          className="flex-1 rounded-md border border-indigo-200 px-2 py-1 text-sm dark:border-indigo-800 dark:bg-slate-900"
        />
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Your goal..."
          className="flex-1 rounded-md border border-indigo-200 px-2 py-1 text-sm dark:border-indigo-800 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface LinkTaskCardProps {
  number: number;
  label: string;
  minutes: number;
  description: string;
  linkLabel: string;
  linkUrl: string;
  secondaryLinkLabel?: string;
  secondaryLinkUrl?: string;
  note: string;
  done: boolean;
  onSaveNote: (note: string) => void;
}

function LinkTaskCard(props: LinkTaskCardProps) {
  const [draft, setDraft] = useState(props.note);
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={props.done} readOnly className="mt-1 h-4 w-4" />
        <div className="flex-1">
          <p className="font-medium">
            {props.number}. {props.label}
            <span className="ml-2 text-xs font-normal text-slate-400">{props.minutes} min</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{props.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={props.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {props.linkLabel}
            </a>
            {props.secondaryLinkUrl && (
              <a
                href={props.secondaryLinkUrl}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium dark:border-slate-700"
              >
                {props.secondaryLinkLabel}
              </a>
            )}
          </div>

          {!props.done && (
            <div className="mt-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                placeholder="Write 3+ things you learned (at least 20 words)..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">{wordCount} / 20 words</span>
                <button
                  type="button"
                  onClick={() => props.onSaveNote(draft)}
                  disabled={wordCount < 20}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  Save note (ticks this task)
                </button>
              </div>
            </div>
          )}
          {props.done && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              Noted: "{props.note.slice(0, 80)}
              {props.note.length > 80 ? "..." : ""}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function NoContentCard({ number, label, dayNumber }: { number: number; label: string; dayNumber: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="font-medium text-slate-400">
        {number}. {label}
      </p>
      <p className="text-sm text-slate-400">Content for Day {dayNumber} hasn't been written yet.</p>
    </div>
  );
}

interface InAppTaskCardProps {
  number: number;
  label: string;
  minutes: number;
  description: string;
  done: boolean;
  onOpen: () => void;
  onToggle: (done: boolean) => void;
}

function InAppTaskCard(props: InAppTaskCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={props.done}
          onChange={(e) => props.onToggle(e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <div className="flex-1">
          <p className={`font-medium ${props.done ? "text-slate-400 line-through" : ""}`}>
            {props.number}. {props.label}
            <span className="ml-2 text-xs font-normal text-slate-400">{props.minutes} min</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{props.description}</p>
          <button
            type="button"
            onClick={props.onOpen}
            className="mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Open {props.label}
          </button>
        </div>
      </div>
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

  const { today, content, progress, doneCount, totalTasks, dayComplete } = mission;
  const streak = computeStreak(allProgress, today.dateStr);
  const missedDays = countMissedDaysBeforeToday(allProgress, today.dateStr, today.dayNumber);
  const milestone = getNewlyReachedMilestone(streak, today.settings.milestonesSeen);
  const mentorMessage = getMentorMessage(today.dayNumber, today.stage.id);
  const progressPercent = Math.round((doneCount / totalTasks) * 100);

  function markDone(taskField: (typeof STEP_ORDER)[number]["taskField"], done: boolean) {
    toggleTask(today.dateStr, today.dayNumber, taskField, done);
  }

  function openTask(key: StepKey) {
    const step = STEP_ORDER.find((s) => s.key === key);
    if (step?.navPath) navigate(step.navPath);
  }

  const yesterdayDate = addDays(today.dateStr, -1);
  const yesterdayRecord = allProgress.find((r) => r.date === yesterdayDate);
  const weekDates = getWeekDates(today.dateStr);
  const progressByDate = new Map(allProgress.map((r) => [r.date, r]));

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {!today.settings.whyReason && !today.settings.whyGoal && <WhyStartedBanner />}

      {milestone && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm dark:border-indigo-800 dark:bg-indigo-950">
          <p className="font-bold text-indigo-800 dark:text-indigo-200">
            Milestone - {milestone.title} ({streak}-day streak)
          </p>
          <p className="mt-1 text-indigo-700 dark:text-indigo-300">{milestone.en}</p>
          <p className="text-indigo-500 dark:text-indigo-400">{milestone.hi}</p>
          <button
            type="button"
            onClick={() =>
              updateSettings({ milestonesSeen: [...today.settings.milestonesSeen, milestone.day] })
            }
            className="mt-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Got it
          </button>
        </div>
      )}

      {missedDays > 0 && (
        <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          <p>{getComebackMessage(missedDays).en}</p>
          <p className="mt-1 text-amber-700 dark:text-amber-300">
            {getComebackMessage(missedDays).hi}
          </p>
          {(today.settings.whyReason || today.settings.whyGoal) && (
            <p className="mt-2 text-xs italic">
              Your reason: "{today.settings.whyReason}" - your goal: "{today.settings.whyGoal}"
            </p>
          )}
        </div>
      )}

      {/* Top: day, date, streak, mentor message, progress bar */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">
            Day {today.dayNumber} of 180 - {today.dateStr}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{streak}-day streak</span>
        </div>
        <p className="mt-2 text-sm">{mentorMessage.en}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{mentorMessage.hi}</p>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {doneCount} of {totalTasks} tasks done
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {today.notStartedYet && (
        <div className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Your plan start date is in the future. Change it in Settings if that's not right.
        </div>
      )}

      {dayComplete && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <p className="font-bold text-emerald-700 dark:text-emerald-300">
            Day {today.dayNumber} complete!
          </p>
          {progress &&
            (() => {
              const note = getDoneWellNote(progress);
              return note ? (
                <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <p className="font-medium">One thing you did well today:</p>
                  <p>{note.en}</p>
                  <p className="text-emerald-500">{note.hi}</p>
                </div>
              ) : null;
            })()}
        </section>
      )}

      {/* Middle: today's tasks as cards, in suggested order */}
      <h2 className="text-base font-bold">Today's tasks</h2>
      {STEP_ORDER.map((step, i) => {
        const done = !!progress?.[step.taskField];
        const description = getStepDescription(step.key, today.stage.id, content);

        if (step.key === "watch" && content) {
          return (
            <LinkTaskCard
              key={step.key}
              number={i + 1}
              label="Watch"
              minutes={content.watch.minMinutes}
              description={`${content.watch.channel}: ${content.watch.topic}`}
              linkLabel="Open on YouTube"
              linkUrl={buildYouTubeSearchUrl(content.watch.channel, content.watch.topic)}
              note={progress?.watchNote ?? ""}
              done={done}
              onSaveNote={(note) =>
                saveTaskNote(today.dateStr, today.dayNumber, "watchNote", "watchDone", note)
              }
            />
          );
        }

        if (step.key === "listen" && content) {
          return (
            <LinkTaskCard
              key={step.key}
              number={i + 1}
              label="Listen"
              minutes={content.listen.minMinutes}
              description={`${content.listen.channel}: ${content.listen.theme}. Write 5 sentences about what the speaker said.`}
              linkLabel="Open on YouTube"
              linkUrl={buildYouTubeSearchUrl(content.listen.channel, content.listen.theme)}
              note={progress?.listenNote ?? ""}
              done={done}
              onSaveNote={(note) =>
                saveTaskNote(today.dateStr, today.dayNumber, "listenNote", "listenDone", note)
              }
            />
          );
        }

        if ((step.key === "watch" || step.key === "listen") && !content) {
          return (
            <NoContentCard
              key={step.key}
              number={i + 1}
              label={step.label}
              dayNumber={today.dayNumber}
            />
          );
        }

        if (step.key === "reading") {
          const site = READING_SITE_BY_STAGE[today.stage.id];
          return (
            <LinkTaskCard
              key="reading"
              number={i + 1}
              label="Read"
              minutes={step.minutesHint}
              description={description}
              linkLabel={`Open article (${site.name})`}
              linkUrl={site.url}
              secondaryLinkLabel="Open built-in passage"
              secondaryLinkUrl="/reading"
              note={progress?.readNote ?? ""}
              done={done}
              onSaveNote={(note) =>
                saveTaskNote(today.dateStr, today.dayNumber, "readNote", "readingDone", note)
              }
            />
          );
        }

        if (step.key === "warmup") {
          return (
            <InAppTaskCard
              key="warmup"
              number={i + 1}
              label="Warm-up"
              minutes={step.minutesHint}
              description={description}
              done={done}
              onOpen={() => markDone("warmupDone", true)}
              onToggle={(v) => markDone("warmupDone", v)}
            />
          );
        }

        return (
          <InAppTaskCard
            key={step.key}
            number={i + 1}
            label={step.label}
            minutes={step.minutesHint}
            description={description}
            done={done}
            onOpen={() => openTask(step.key)}
            onToggle={(v) => markDone(step.taskField, v)}
          />
        );
      })}

      {/* Bottom: simple checklist + yesterday + this week */}
      <h2 className="text-base font-bold">Today's to-do list</h2>
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <ul className="flex flex-col gap-1 text-sm">
          {STEP_ORDER.map((step, i) => {
            const done = !!progress?.[step.taskField];
            return (
              <li key={step.key} className="flex items-center gap-2">
                <span>{done ? "✓" : "○"}</span>
                <span className={done ? "text-slate-400 line-through" : ""}>
                  {i + 1}. {step.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 text-sm font-bold">Yesterday</h3>
        {yesterdayRecord ? (
          <div className="flex gap-1 text-xs">
            {STEP_ORDER.map((step) => (
              <span
                key={step.key}
                title={step.label}
                className={`flex h-6 w-6 items-center justify-center rounded ${
                  yesterdayRecord[step.taskField]
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {yesterdayRecord[step.taskField] ? "✓" : "·"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No record for yesterday.</p>
        )}

        <h3 className="mb-2 mt-4 text-sm font-bold">This week</h3>
        <div className="flex justify-between text-xs">
          {weekDates.map((date) => {
            const rec = progressByDate.get(date);
            const { done: d, required } = rec
              ? countStepsDone(rec)
              : { done: 0, required: STEP_ORDER.length };
            return (
              <div key={date} className="flex flex-col items-center gap-1">
                <span className="text-slate-400">{weekdayLabel(date)}</span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                    d >= required && required > 0
                      ? "bg-emerald-500 text-white"
                      : d > 0
                        ? "bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200"
                        : "bg-slate-200 text-slate-400 dark:bg-slate-800"
                  }`}
                >
                  {d}/{required}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
