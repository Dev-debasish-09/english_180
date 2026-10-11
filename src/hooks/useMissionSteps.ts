import { loadDayContent } from "../content/types";
import { buildStepStates, getActiveStep, isDayFullyDone } from "../lib/steps";
import { useDailyProgress } from "./useDailyProgress";
import { useToday } from "./useToday";

// Everything the mentor Home screen and the NavBar need: today's date/day/
// stage, that day's authored content (if it exists yet), the 8 ordered
// steps with lock state, and the single active step.
export function useMissionSteps() {
  const today = useToday();
  const progress = useDailyProgress(today?.dateStr ?? "");

  if (!today) return undefined;

  const content = loadDayContent(today.dayNumber);
  const steps = buildStepStates(today.dateStr, progress);
  const activeStep = getActiveStep(steps);
  const dayComplete = isDayFullyDone(steps);

  return { today, content, steps, activeStep, dayComplete, progress };
}
