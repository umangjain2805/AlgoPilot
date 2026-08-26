const DIFFICULTY_STYLE = {
  Easy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Hard: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
}

export default function DifficultyBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        DIFFICULTY_STYLE[level] || 'bg-slate-500/15 text-slate-600 dark:text-slate-300'
      }`}
    >
      {level}
    </span>
  )
}
