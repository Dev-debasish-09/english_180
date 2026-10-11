import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { updateSettings } from "../db/db";

export function SettingsPage() {
  const settings = useSettings();
  const [saved, setSaved] = useState(false);
  const [reason, setReason] = useState("");
  const [goal, setGoal] = useState("");
  const [whySaved, setWhySaved] = useState(false);

  if (!settings) {
    return <p className="text-slate-500">Loading...</p>;
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function handleWhySave() {
    if (!settings) return;
    await updateSettings({
      whyReason: reason.trim() || settings.whyReason,
      whyGoal: goal.trim() || settings.whyGoal,
    });
    setReason("");
    setGoal("");
    setWhySaved(true);
    setTimeout(() => setWhySaved(false), 1500);
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
        <h2 className="mb-3 text-base font-bold">Why I started</h2>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          Your reason: <span className="text-slate-700 dark:text-slate-200">{settings.whyReason ?? "not written yet"}</span>
          <br />
          Your goal: <span className="text-slate-700 dark:text-slate-200">{settings.whyGoal ?? "not written yet"}</span>
        </p>
        <label className="mb-2 block">
          <span className="mb-1 block text-sm font-medium">Update your reason</span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={settings.whyReason ?? "Why are you doing this?"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="mb-2 block">
          <span className="mb-1 block text-sm font-medium">Update your goal</span>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={settings.whyGoal ?? "What do you want to achieve?"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <button
          type="button"
          onClick={handleWhySave}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save
        </button>
        {whySaved && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-1 text-base font-bold">Backup</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Export and import of your data as a JSON file is coming in Phase 5.
        </p>
      </section>

      <Link to="/guide" className="text-center text-sm text-indigo-600 underline dark:text-indigo-400">
        Open the "How to Study" guide
      </Link>
    </div>
  );
}
