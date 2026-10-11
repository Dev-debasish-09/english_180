import { loadDayContent } from "../content/types";
import { countDoneTasks, isDayFullyDone, STEP_ORDER } from "../lib/steps";
import { useDailyProgress } from "./useDailyProgress";
import { useToday } from "./useToday";

// Everything the Home screen and task pages need: today's date/day/
// stage, that day's authored content (if it exists yet), and today's
// progress record. Tasks are not locked - STEP_ORDER is just the
// suggested order to show them in.
export function useMissionSteps() {
  const today = useToday();
  const progress = useDailyProgress(today?.dateStr ?? "");

  if (!today) return undefined;

  const content = loadDayContent(today.dayNumber);
  const doneCount = countDoneTasks(progress);
  const dayComplete = isDayFullyDone(progress);

  return { today, content, progress, doneCount, totalTasks: STEP_ORDER.length, dayComplete };
}
