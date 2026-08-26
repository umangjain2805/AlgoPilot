export default function Stat({ label, value, sub, icon: Icon, tone = 'text-indigo-600 dark:text-indigo-400' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {Icon && <Icon className={`h-4 w-4 ${tone}`} />}
        {label}
      </div>
      <p className="font-display mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  )
}
