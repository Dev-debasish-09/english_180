import { getClampedDayNumber, getRawDayNumber, getStageForDay } from "../lib/plan";
import { todayISO } from "../lib/date";
import { useSettings } from "./useSettings";

// Combines Settings (start date) with the current date to work out
// "where am I in the 180-day plan right now". Returns undefined while
// settings are still loading.
export function useToday() {
  const settings = useSettings();
  if (!settings) return undefined;

  const dateStr = todayISO();
  const rawDayNumber = getRawDayNumber(settings.startDate, dateStr);
  const dayNumber = getClampedDayNumber(settings.startDate, dateStr);
  const stage = getStageForDay(dayNumber);

  return {
    settings,
    dateStr,
    dayNumber,
    stage,
    notStartedYet: rawDayNumber < 1,
    planFinished: rawDayNumber > 180,
  };
}
