import {
  CheckCircle2,
  Flame,
  Loader2,
  Moon,
  Search,
  Sparkles,
  Sun,
  Target,
  Trophy,
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'
import { useLeetCodeProfile } from '../hooks/useLeetCodeProfile.js'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import AnalysisSidebar from '../components/AnalysisSidebar.jsx'
import Stat from '../components/Stat.jsx'
import QuestionCard from '../components/QuestionCard.jsx'

export default function Dashboard() {
  const { dark, toggleTheme } = useTheme()
  const {
    input,
    setInput,
    loading,
    error,
    total,
    setTotal,
    setSolvedCount,
    analysis,
    safeSolved,
    plan,
    handleSubmit,
    reset,
  } = useLeetCodeProfile()

  return (
    <DashboardLayout
      sidebar={<AnalysisSidebar analysis={analysis} error={error} onReset={reset} />}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              LeetCode <span className="text-indigo-600 dark:text-indigo-400">AI Coach</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Paste your profile URL to see how many you&apos;ve solved, your weak points, and a
              personalised plan.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:grid dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        {/* Fetch form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://leetcode.com/u/your_username"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              {loading ? 'Fetching…' : 'Fetch'}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
        </form>

        {!analysis && !loading && !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <Sparkles className="mx-auto h-10 w-10 text-indigo-400" />
            <h2 className="font-display mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No profile loaded
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Enter your LeetCode profile URL above. You can also paste just your username — no
              account or login needed. Everything is analysed here in your browser.
            </p>
          </div>
        )}

        {analysis && (
          <>
            {/* Global stats */}
            <section>
              <h2 className="font-display mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Your snapshot
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <Stat label="Total solved" value={analysis.totalSolved.toLocaleString()} icon={CheckCircle2} tone="text-emerald-600 dark:text-emerald-400" />
                <Stat label="Easy" value={analysis.easySolved} icon={Target} tone="text-emerald-600 dark:text-emerald-400" />
                <Stat label="Medium" value={analysis.mediumSolved} icon={Target} tone="text-amber-600 dark:text-amber-400" />
                <Stat label="Hard" value={analysis.hardSolved} icon={Target} tone="text-rose-600 dark:text-rose-400" />
                <Stat
                  label="Acceptance"
                  value={`${analysis.acceptanceRate}%`}
                  sub={`${analysis.streak}-day streak`}
                  icon={Flame}
                  tone="text-orange-600 dark:text-orange-400"
                />
                <Stat
                  label="Ranking"
                  value={analysis.profile.ranking ? analysis.profile.ranking.toLocaleString() : '—'}
                  sub="global rank"
                  icon={Trophy}
                  tone="text-indigo-600 dark:text-indigo-400"
                />
                <Stat
                  label="Contest rating"
                  value={analysis.rating || '—'}
                  sub={analysis.rating ? 'LeetCode rating' : 'no contests yet'}
                  icon={Trophy}
                  tone="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </section>

            {/* Planner */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Practice plan
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pick a total and split solved vs unsolved.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                  {safeSolved} solved · {total - safeSolved} unsolved
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Total questions
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{total}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={total}
                    onChange={(e) => setTotal(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Solved (revision)
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{safeSolved}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={total}
                    value={safeSolved}
                    onChange={(e) => setSolvedCount(Math.min(total, Number(e.target.value)))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Revision (solved)
                    <span className="text-xs font-normal text-slate-500">({plan.revision.length})</span>
                  </h3>
                  <div className="space-y-2.5">
                    {plan.revision.length ? (
                      plan.revision.map((p, i) => (
                        <QuestionCard key={p.titleSlug} problem={p} solved index={i} />
                      ))
                    ) : (
                      <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
                        Not enough solved problems in the tracked set — raise the unsolved
                        share.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                    <Sparkles className="h-4 w-4 text-sky-500" /> New (unsolved)
                    <span className="text-xs font-normal text-slate-500">({plan.fresh.length})</span>
                  </h3>
                  <div className="space-y-2.5">
                    {plan.fresh.length ? (
                      plan.fresh.map((p, i) => (
                        <QuestionCard key={p.titleSlug} problem={p} solved={false} index={i} />
                      ))
                    ) : (
                      <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
                        No unsolved problems left to show in the tracked set.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
