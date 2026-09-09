export default function Stat({ label, value, sub, icon: Icon, tone = 'text-indigo-600 dark:text-indigo-400' }) {
  return (
    <div className="neo-box rounded-2xl bg-white p-4 transition-transform hover:-translate-y-0.5 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {Icon && <Icon className={`h-4 w-4 ${tone}`} />}
        <span>{label}</span>
      </div>
      <p className="font-display mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  )
}
