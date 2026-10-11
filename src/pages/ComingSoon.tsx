import { useNavigate } from "react-router-dom";
import type { TaskKey } from "../db/types";
import { useMissionSteps } from "../hooks/useMissionSteps";
import { toggleTask } from "../hooks/useDailyProgress";

interface ComingSoonProps {
  title: string;
  phase: string;
  taskField: TaskKey;
}

// Stand-in for a module page (Grammar, Reading, Vocabulary, Writing,
// Speaking, Resources) until it's built in its real phase. Still wired
// into the locked daily order, so "Mark done" here lets you try out the
// mentor home screen's step-by-step flow before the real content exists.
export function ComingSoon({ title, phase, taskField }: ComingSoonProps) {
  const navigate = useNavigate();
  const mission = useMissionSteps();

  function markDoneAndReturn() {
    if (!mission) return;
    toggleTask(mission.today.dateStr, mission.today.dayNumber, taskField, true);
    navigate("/");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400">
        The real {title} module is built in {phase}.
      </p>
      <button
        type="button"
        onClick={markDoneAndReturn}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Mark {title} done for today (demo)
      </button>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-sm text-slate-400 underline"
      >
        Back without marking done
      </button>
    </div>
  );
}
