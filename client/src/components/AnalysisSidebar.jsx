import { Bot, Lightbulb, Sparkles, Target } from 'lucide-react'
import { PROBLEMS } from '../lib/leetcode.js'
import ProgressBar from './ProgressBar.jsx'

const DIFFICULTY_BAR = {
  Easy: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard: 'bg-rose-500',
}

export default function AnalysisSidebar({ analysis, error, onReset }) {
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r xl:w-96 dark:border-slate-800">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">AI Analysis</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your LeetCode weak spots</p>
          </div>
        </div>

        {!analysis ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
            <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {error
                ? 'Fix the error and retry your profile URL.'
                : 'Paste your LeetCode URL to unlock your analysis.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Headline metrics */}
            <div className="flex items-center gap-3">
              {analysis.profile.avatar ? (
                <img
                  src={analysis.profile.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500/15 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {(analysis.profile.leetcodeUsername || '?').slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                  {analysis.profile.realName || analysis.profile.leetcodeUsername}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  @{analysis.profile.leetcodeUsername}
                </p>
              </div>
            </div>

            {/* Solved overview */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Questions solved
              </h3>
              <p className="font-display mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                {analysis.totalSolved.toLocaleString()}
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  { label: 'Easy', value: analysis.easySolved, bar: DIFFICULTY_BAR.Easy },
                  { label: 'Medium', value: analysis.mediumSolved, bar: DIFFICULTY_BAR.Medium },
                  { label: 'Hard', value: analysis.hardSolved, bar: DIFFICULTY_BAR.Hard },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{row.value}</span>
                    </div>
                    <ProgressBar
                      value={row.value}
                      max={Math.max(analysis.easySolved, analysis.mediumSolved, analysis.hardSolved, 1)}
                      className={row.bar}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage of the curated set */}
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Solved</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {analysis.datasetSolved}
                </span>
              </div>
              <div className="my-2 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Unsolved</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {analysis.datasetUnsolved}
                </span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${(analysis.datasetSolved / PROBLEMS.length) * 100}%` }}
                />
                <div className="flex-1 bg-sky-500/70" />
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Curated coverage — {PROBLEMS.length} core problems tracked.
              </p>
            </div>

            {/* Weak points */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Target className="h-3.5 w-3.5" /> Weak topics
              </h3>
              <div className="mt-3 space-y-2">
                {analysis.weakTopics.slice(0, 5).map((topic) => (
                  <div
                    key={topic.name}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {topic.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {topic.solved}/{topic.total}
                      </span>
                    </div>
                    <ProgressBar value={topic.solved} max={topic.total} className="bg-rose-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Lightbulb className="h-3.5 w-3.5" /> Insights
              </h3>
              <ul className="mt-3 space-y-2">
                {analysis.insights.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 rounded-xl bg-indigo-500/5 p-3 text-sm text-slate-700 dark:bg-indigo-500/10 dark:text-slate-200"
                  >
                    <span className="mt-0.5 text-indigo-500">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Load a different profile
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
