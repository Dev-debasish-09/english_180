import { Heatmap } from "../components/Heatmap";
import { ProgressBar } from "../components/ProgressBar";
import { WeeklyChart } from "../components/WeeklyChart";
import { useAllProgress } from "../hooks/useDailyProgress";
import { useToday } from "../hooks/useToday";
import { getWeekDates } from "../lib/date";
import { buildHeatmap, computeSkillProgress, computeStreak } from "../lib/stats";

const SKILL_BARS: { label: string; task: "grammarDone" | "readingDone" | "vocabularyDone" | "writingDone" | "speakingDone" }[] = [
  { label: "Grammar", task: "grammarDone" },
  { label: "Reading", task: "readingDone" },
  { label: "Vocabulary", task: "vocabularyDone" },
  { label: "Writing", task: "writingDone" },
  { label: "Speaking", task: "speakingDone" },
];

export function ProgressPage() {
  const today = useToday();
  const allProgress = useAllProgress();

  if (!today || !allProgress) {
    return <p className="text-slate-500">Loading...</p>;
  }

  const streak = computeStreak(allProgress, today.dateStr);
  const heatmapDays = buildHeatmap(allProgress, today.dateStr, 84);
  const weekDates = getWeekDates(today.dateStr);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Day streak</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-2xl font-bold">{today.dayNumber}/180</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Days into plan</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-bold">Skill progress</h2>
        <div className="flex flex-col gap-3">
          {SKILL_BARS.map((bar) => (
            <ProgressBar
              key={bar.task}
              label={bar.label}
              percent={computeSkillProgress(allProgress, bar.task, today.dayNumber)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-bold">This week</h2>
        <WeeklyChart weekDates={weekDates} records={allProgress} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-bold">Last 12 weeks</h2>
        <Heatmap days={heatmapDays} />
      </section>
    </div>
  );
}
