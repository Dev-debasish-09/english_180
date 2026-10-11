interface ComingSoonProps {
  title: string;
  phase: string;
}

// Stand-in for a page not built yet (currently just Resources).
export function ComingSoon({ title, phase }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400">This page is built in {phase}.</p>
    </div>
  );
}
