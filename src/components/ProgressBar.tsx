interface ProgressBarProps {
  label: string;
  percent: number; // 0-100
}

export function ProgressBar({ label, percent }: ProgressBarProps) {
  const clamped = Math.min(Math.max(percent, 0), 100);

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{clamped}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-2 rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
