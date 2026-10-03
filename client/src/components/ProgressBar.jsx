export default function ProgressBar({ value, max, className = 'bg-[#E2F952]', height = 'h-2.5' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div
      role="progressbar"
      aria-label="Practice coverage"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`${height} w-full overflow-hidden rounded-full border-[1.5px] border-slate-900 bg-slate-100 dark:border-slate-200 dark:bg-slate-800`}
    >
      <div
        className={`progress-fill h-full rounded-full ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
