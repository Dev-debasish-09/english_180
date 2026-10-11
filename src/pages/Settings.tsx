import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { updateSettings } from "../db/db";

export function SettingsPage() {
  const settings = useSettings();
  const [saved, setSaved] = useState(false);

  if (!settings) {
    return <p className="text-slate-500">Loading...</p>;
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    await updateSettings({ startDate: e.target.value });
    flashSaved();
  }

  async function handleMinutesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const minutes = Number(e.target.value);
    if (!Number.isFinite(minutes) || minutes < 0) return;
    await updateSettings({ dailyMinutes: minutes });
    flashSaved();
  }

  async function handleNotificationTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    await updateSettings({ notificationTime: e.target.value || null });
    flashSaved();
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-bold">Plan settings</h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium">Day 1 start date</span>
          <input
            type="date"
            value={settings.startDate}
            onChange={handleStartDateChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            Changing this changes which day number (1-180) is "today".
          </span>
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium">Daily study time (minutes)</span>
          <input
            type="number"
            min={0}
            value={settings.dailyMinutes}
            onChange={handleMinutesChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Daily reminder time</span>
          <input
            type="time"
            value={settings.notificationTime ?? ""}
            onChange={handleNotificationTimeChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            Saved now; the actual browser notifications are wired up in Phase 5.
          </span>
        </label>

        {saved && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-1 text-base font-bold">Backup</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Export and import of your data as a JSON file is coming in Phase 5.
        </p>
      </section>
    </div>
  );
}
