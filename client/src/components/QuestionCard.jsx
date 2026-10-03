import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge.jsx'
import { useLeetCode } from '../hooks/useLeetCode.js'

export default function QuestionCard({ problem, solved, index }) {
  const reducedMotion = useReducedMotion()
  const { completeProblem, skipProblem, profile } = useLeetCode()
  return (
    <motion.article
      layout={reducedMotion ? false : 'position'}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: reducedMotion ? 0 : 0.22 }}
      className="question-card neo-box rounded-2xl bg-white p-4 dark:bg-slate-900"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-900 bg-slate-100 text-sm font-black text-slate-800 dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-2 font-bold text-slate-950 hover:text-indigo-600 dark:text-white dark:hover:text-[#E2F952]"
          >
            <span>
              {problem.id}. {problem.title}
            </span>
            <ExternalLink className="mt-1 h-4 w-4 shrink-0" />
          </a>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <DifficultyBadge level={problem.difficulty} />
            {problem.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{problem.reason}</p>
          <p className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
            {solved ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {solved
              ? 'Recorded solve · review'
              : profile.history?.status === 'complete'
                ? 'New question'
                : 'Not in recorded solved history'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => completeProblem(problem.titleSlug, solved)}
          className="rounded-xl bg-[#E2F952] px-3 py-2 text-xs font-bold text-slate-950"
        >
          {solved ? 'Mark reviewed' : 'Mark solved'}
        </button>
        <button
          type="button"
          onClick={() => skipProblem(problem.titleSlug)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          Skip question
        </button>
      </div>
    </motion.article>
  )
}
