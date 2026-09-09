const DIFFICULTY_STYLE = {
  Easy: 'bg-emerald-300 text-slate-950 dark:bg-emerald-400',
  Medium: 'bg-amber-300 text-slate-950 dark:bg-amber-400',
  Hard: 'bg-rose-300 text-slate-950 dark:bg-rose-400',
}

export default function DifficultyBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-900 px-2 py-0.5 text-[11px] font-black shadow-[1px_1px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[1px_1px_0px_0px_#f1f5f9] ${
        DIFFICULTY_STYLE[level] || 'bg-slate-200 text-slate-900'
      }`}
    >
      {level}
    </span>
  )
}
