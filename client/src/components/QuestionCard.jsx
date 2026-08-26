import { CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge.jsx'

export default function QuestionCard({ problem, solved, index }) {
  return (
    <a
      href={problem.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-600"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {problem.title}
          </p>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <DifficultyBadge level={problem.difficulty} />
          {problem.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              solved
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'bg-sky-500/15 text-sky-700 dark:text-sky-400'
            }`}
          >
            {solved ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {solved ? 'Solved' : 'Unsolved'}
          </span>
        </div>
      </div>
    </a>
  )
}
