import { useLiveQuery } from "dexie-react-hooks";
import { db, SETTINGS_ID } from "../db/db";

// Returns undefined while loading, then the settings row.
// ensureSettings() (called once in App.tsx) guarantees it exists.
export function useSettings() {
  return useLiveQuery(() => db.settings.get(SETTINGS_ID), []);
}
