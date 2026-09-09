import { CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge.jsx'

export default function QuestionCard({ problem, solved, index }) {
  return (
    <a
      href={problem.url}
      target="_blank"
      rel="noreferrer"
      className="neo-box group flex items-start gap-4 rounded-2xl bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#0f172a] dark:bg-slate-900 dark:hover:shadow-[5px_5px_0px_0px_#f1f5f9]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-1.5 border-slate-900 bg-slate-100 text-sm font-black text-slate-800 dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-bold text-slate-950 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-[#E2F952]">
            {problem.title}
          </p>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 opacity-60 transition group-hover:opacity-100" />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge level={problem.difficulty} />
          {problem.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-900/40 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full border border-slate-900 px-2.5 py-0.5 text-xs font-bold shadow-[1px_1px_0px_0px_#0f172a] dark:border-slate-200 dark:shadow-[1px_1px_0px_0px_#f1f5f9] ${
              solved
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-[#E2F952] text-slate-950'
            }`}
          >
            {solved ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {solved ? 'Solved' : 'Challenge'}
          </span>
        </div>
      </div>
    </a>
  )
}
