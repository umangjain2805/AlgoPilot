export default function ProgressBar({ value, max, className = 'bg-indigo-500' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div className={`h-full rounded-full transition-all duration-500 ${className}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
