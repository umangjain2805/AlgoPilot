import { Link } from 'react-router-dom'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Filter,
  Layers,
  Loader2,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Target,
} from 'lucide-react'
import { useLeetCode } from '../hooks/useLeetCode.js'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import QuestionCard from '../components/QuestionCard.jsx'

export default function Dashboard() {
  const {
    input,
    setInput,
    loading,
    error,
    total,
    setTotal,
    selectedTopic,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    analysis,
    plan,
    handleSubmit,
  } = useLeetCode()

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero & Profile URL Input Bar */}
        <section className="neo-box-lg relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 dark:bg-slate-900">
          <div className="max-w-3xl">
            <div className="neo-box-sm inline-flex items-center gap-1.5 rounded-full bg-[#E2F952] px-3 py-1 text-xs font-black text-slate-950">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Neo-Modern DSA Interview Intelligence</span>
            </div>

            <h1 className="font-display mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Target Your LeetCode Weak Spots with{' '}
              <span className="rounded-xl bg-[#E2F952] px-2 py-0.5 text-slate-950 dark:text-slate-950">
                AI Coaching
              </span>
            </h1>

            <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-400">
              Paste your LeetCode profile handle or URL. We uncover your algorithmic blind spots,
              track curriculum progress, and build a custom spaced-repetition plan.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste URL or username (e.g. leetcode.com/u/tourist or tourist)"
                  disabled={loading}
                  className="h-13 w-full rounded-2xl border-2 border-slate-900 bg-[#FAFAF8] pl-12 pr-4 text-sm font-bold text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none disabled:opacity-60 dark:border-slate-100 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="neo-btn neo-btn-electric inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-7 text-sm font-black disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                {loading ? 'Analyzing…' : 'Fetch & Analyze'}
              </button>
            </div>


            {error && (
              <div className="neo-box-sm mt-4 rounded-xl bg-rose-200 p-3 text-xs font-bold text-slate-950">
                {error}
              </div>
            )}
          </form>
        </section>

        {/* Empty state prompt */}
        {!analysis && !loading && !error && (
          <div className="neo-box-lg rounded-3xl bg-white p-10 text-center dark:bg-slate-900">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] dark:border-slate-100">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="font-display mt-4 text-xl font-black text-slate-950 dark:text-white">
              No Profile Loaded Yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs font-medium text-slate-600 dark:text-slate-400">
              Paste your LeetCode username above to view your complete Neo-Brutalist diagnostic cards,
              curriculum heatmap, and custom question planner.
            </p>
          </div>
        )}

        {/* Loaded Profile Content */}
        {analysis && (
          <>
            {/* AI Deep Analysis Quick Callout Banner */}
            <section className="neo-box-lg relative overflow-hidden rounded-3xl bg-[#E2F952] p-6 text-slate-950 sm:p-7">
              <div className="relative z-10 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
                    <Brain className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-900 bg-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wide text-slate-950 shadow-[1px_1px_0px_0px_#0f172a]">
                        AI Diagnostic Ready
                      </span>
                      {analysis.weakTopics?.length > 0 && (
                        <span className="text-xs font-bold text-slate-800">
                          {analysis.weakTopics.length} weak areas detected
                        </span>
                      )}
                    </div>
                    <h2 className="font-display mt-1 text-xl font-black">
                      {analysis.weakTopics?.length > 0
                        ? `Skill gaps detected in ${analysis.weakTopics.slice(0, 3).map((t) => t.name).join(', ')}`
                        : 'Your complete algorithmic profile is fully mapped!'}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-800">
                      Explore interactive difficulty cards, topic mastery gaps, and coaching advice.
                    </p>
                  </div>
                </div>

                <Link
                  to="/analysis"
                  className="neo-btn inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-black text-slate-950"
                >
                  <span>Open Full AI Analysis</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Practice Planner */}
            <section
              id="practice-plan"
              className="neo-box-lg rounded-3xl bg-white p-6 sm:p-8 dark:bg-slate-900"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Sliders className="h-5 w-5" />
                    </span>
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      Personalized Practice Plan
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose your topic, target question count, and difficulty to generate an optimized training session.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {plan?.revision?.length || 0} Revision
                  </span>
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-400">
                    {plan?.fresh?.length || 0} New Challenges
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {(plan?.revision?.length || 0) + (plan?.fresh?.length || 0)} Total showing
                  </span>
                </div>
              </div>

              {/* Session Customizer Controls Grid */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-6 dark:border-slate-800/80 dark:bg-slate-800/40">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 1. Topic Selector */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        1. Choose Topic
                      </span>
                      {selectedTopic !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setSelectedTopic('all')}
                          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset to Auto
                        </button>
                      )}
                    </div>

                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="all">🌟 All Topics (AI Weakness Priority)</option>
                      {analysis?.weakTopics?.length > 0 && (
                        <optgroup label="⚠️ Identified Weak Topics (Recommended)">
                          {analysis.weakTopics.map((topic) => (
                            <option key={topic.name} value={topic.name}>
                              {topic.name} ({Math.round(topic.ratio * 100)}% solved — {topic.solved}/{topic.total})
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="All Topics (A-Z)">
                        {analysis?.topics
                          ?.filter((t) => !analysis.weakTopics?.some((w) => w.name === t.name))
                          .map((topic) => (
                            <option key={topic.name} value={topic.name}>
                              {topic.name} ({topic.solved}/{topic.total})
                            </option>
                          ))}
                      </optgroup>
                    </select>

                    {/* Quick Topic Pills */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTopic('all')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          selectedTopic === 'all'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        🌟 Auto (All)
                      </button>
                      {analysis?.weakTopics?.slice(0, 4).map((topic) => (
                        <button
                          key={topic.name}
                          type="button"
                          onClick={() => setSelectedTopic(topic.name)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                            selectedTopic === topic.name
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          ⚠️ {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Question Number Selector */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <Layers className="h-3.5 w-3.5 text-indigo-500" />
                        2. Question Number ({total})
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={total}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(50, Number(e.target.value) || 1))
                            setTotal(val)
                          }}
                          className="h-7 w-16 rounded-lg border border-slate-200 bg-white px-2 text-center text-xs font-bold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <span className="text-xs font-medium text-slate-400">questions</span>
                      </div>
                    </div>

                    {/* Slider */}
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={total}
                      onChange={(e) => setTotal(Number(e.target.value))}
                      className="w-full"
                    />

                    {/* Quick Preset Pills */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 text-xs text-slate-400">Presets:</span>
                      {[3, 5, 10, 15, 20, 25].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setTotal(count)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                            total === count
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Difficulty Filter (Optional) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Difficulty:
                    </span>
                    <div className="flex rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800">
                      {[
                        { id: 'all', label: 'All Levels' },
                        { id: 'Easy', label: 'Easy' },
                        { id: 'Medium', label: 'Medium' },
                        { id: 'Hard', label: 'Hard' },
                      ].map((diff) => (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff.id)}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                            selectedDifficulty === diff.id
                              ? 'bg-white text-indigo-700 shadow-2xs dark:bg-slate-700 dark:text-indigo-300'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                          }`}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Info */}
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span>Filtering: </span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {selectedTopic === 'all' ? 'All Topics' : selectedTopic}
                    </strong>
                    {selectedDifficulty !== 'all' && (
                      <span> · {selectedDifficulty}</span>
                    )}
                    {plan?.totalAvailable !== undefined && (
                      <span className="ml-1.5 text-slate-400">
                        ({plan.totalAvailable} matching problems available)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Question list split */}
              {plan && (plan.revision.length > 0 || plan.fresh.length > 0) ? (
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  {/* Revision */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Revision Set (Reinforce Concepts)
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {plan?.revision?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {plan?.revision?.length ? (
                        plan.revision.map((p, i) => (
                          <QuestionCard key={p.titleSlug} problem={p} solved index={i} />
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-800">
                          No solved questions available in {selectedTopic === 'all' ? 'the dataset' : selectedTopic} for revision yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fresh */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <Sparkles className="h-4 w-4 text-sky-500" />
                        New Challenges (Expand Horizons)
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {plan?.fresh?.length || 0}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {plan?.fresh?.length ? (
                        plan.fresh.map((p, i) => (
                          <QuestionCard key={p.titleSlug} problem={p} solved={false} index={i} />
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-800">
                          No unsolved problems left in {selectedTopic === 'all' ? 'the dataset' : selectedTopic} matching this filter.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
                  <Target className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    No problems found matching this specific topic & difficulty combination.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopic('all')
                      setSelectedDifficulty('all')
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset filters to default
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
