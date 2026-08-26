import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bot, Minus, Plus, RotateCw, Sparkles, Undo2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useLeetCode } from '../hooks/useLeetCode.js'
import QuestionCard from '../components/leetcode/QuestionCard.jsx'

// ---- Sample data (static preview until the Phase 4 engine is wired) ----
const SAMPLE_REVISION = [
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    tags: ['Array', 'Stack'],
    rationale: 'Reinforces two-pointer traversal in an under-practiced topic.',
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    tags: ['String'],
    rationale: 'Revisit interval DP; your DP coverage is thin.',
  },
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    topic: 'Graph',
    tags: ['BFS', 'DFS'],
    rationale: 'Core graph traversal you solved few of.',
  },
  {
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    topic: 'Hashing',
    tags: ['Array', 'Prefix Sum'],
    rationale: 'Strengthens the prefix-sum + hash pattern.',
  },
  {
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    topic: 'Queue',
    tags: ['Tree', 'BFS'],
    rationale: 'Foundation BFS problem to re-practice.',
  },
  {
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    topic: 'Stack',
    tags: ['Heap', 'Quickselect'],
    rationale: 'Heap / quickselect pattern worth repeating.',
  },
]

const SAMPLE_FRESH = [
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    topic: 'Graph',
    tags: ['Topological Sort'],
    rationale: 'Introduces topological sort in a weak topic.',
  },
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    topic: 'Sliding Window',
    tags: ['String', 'Hash Table'],
    rationale: 'Classic two-pointer + sliding window.',
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    topic: 'Graph',
    tags: ['BFS'],
    rationale: 'BFS shortest-path variant to build intuition.',
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    tags: ['Binary Search'],
    rationale: 'Canonical DP entry point for the topic.',
  },
  {
    slug: 'next-permutation',
    title: 'Next Permutation',
    difficulty: 'Medium',
    topic: 'Arrays',
    tags: ['Two Pointers'],
    rationale: 'Array manipulation pattern to add.',
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    topic: 'Backtracking',
    tags: ['Matrix', 'DFS'],
    rationale: 'Intro backtracking grid search.',
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    topic: 'Binary Search',
    tags: ['Array'],
    rationale: 'Challenges binary-search mastery.',
  },
  {
    slug: 'rotate-list',
    title: 'Rotate List',
    difficulty: 'Medium',
    topic: 'Linked List',
    tags: ['Two Pointers'],
    rationale: 'Linked-list manipulation practice.',
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    topic: 'Backtracking',
    tags: ['Recursion'],
    rationale: 'Deepens backtracking through a classic.',
  },
]

const urlFor = (slug) => `https://leetcode.com/problems/${slug}/`

const shuffle = (arr) => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const Counter = ({ label, hint, value, onChange, min, max }) => (
  <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{label}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400">{hint}</p>
      </div>
      <span className="font-display text-2xl font-bold text-primary-600 dark:text-primary-400">
        {value}
      </span>
    </div>
    <div className="mt-3 flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-600 transition hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-600 transition hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
)

const GroupHeader = ({ icon: Icon, title, count, tone }) => (
  <div className="mb-4 flex items-center gap-2.5">
    <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
    <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">{title}</h2>
    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
      {count}
    </span>
  </div>
)

const Recommendations = () => {
  const { isGuest } = useAuth()
  const { connected } = useLeetCode()

  const [total, setTotal] = useState(10)
  const [solvedSplit, setSolvedSplit] = useState(4)
  const [pools, setPools] = useState({ revision: SAMPLE_REVISION, fresh: SAMPLE_FRESH })
  const [tick, setTick] = useState(0)
  const [source, setSource] = useState(null)

  const changeTotal = (n) => {
    const next = Math.min(50, Math.max(1, n))
    setTotal(next)
    if (solvedSplit > next) setSolvedSplit(next)
  }

  const changeSolvedSplit = (n) => {
    setSolvedSplit(Math.min(total, Math.max(0, n)))
  }

  const generate = () => {
    setPools((prev) => ({ revision: shuffle(prev.revision), fresh: shuffle(prev.fresh) }))
    setSource('Heuristic')
    setTick((t) => t + 1)
  }

  const revision = pools.revision.slice(0, solvedSplit)
  const fresh = pools.fresh.slice(0, Math.max(0, total - solvedSplit))

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
              Solve Random Questions
            </h1>
            <p className="mt-1 text-ink-600 dark:text-ink-400">Boost Your Coding Skills</p>
          </div>
        </div>
        {source && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-500/15 px-3 py-1 text-xs font-semibold text-success-700 dark:text-success-400">
            <Sparkles className="h-3.5 w-3.5" /> {source}
          </span>
        )}
      </div>

      {/* Not-connected notice */}
      {!connected && !isGuest && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <Undo2 className="h-4 w-4 shrink-0" />
          <span>
            Preview with sample data. <Link to="/leetcode" className="font-semibold underline">Connect your
            LeetCode profile</Link> to get real recommendations.
          </span>
        </div>
      )}
      {isGuest && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <span>Guests can't generate recommendations. Sign up to connect your profile.</span>
        </div>
      )}

      {/* Control panel */}
      <div className="glass-card rounded-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Counter
            label="Total questions"
            hint="How many to return"
            value={total}
            onChange={changeTotal}
            min={1}
            max={50}
          />
          <Counter
            label="Revision (solved)"
            hint="Weak-topic repeats"
            value={solvedSplit}
            onChange={changeSolvedSplit}
            min={0}
            max={total}
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs text-ink-500 dark:text-ink-400">
            {solvedSplit} revision · {Math.max(0, total - solvedSplit)} new
          </p>
          <button type="button" onClick={generate} className="btn-success px-6 py-3 text-sm">
            <RotateCw className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Results */}
      <div key={tick} className="mt-10 space-y-10">
        {revision.length > 0 && (
          <section>
            <GroupHeader icon={Undo2} title="Revision — weak topics" count={revision.length} tone="text-amber-600 dark:text-amber-400" />
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {revision.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <QuestionCard {...item} url={urlFor(item.slug)} kind="revision" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {fresh.length > 0 && (
          <section>
            <GroupHeader icon={Sparkles} title="New — unsolved" count={fresh.length} tone="text-success-600 dark:text-success-400" />
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {fresh.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <QuestionCard {...item} url={urlFor(item.slug)} kind="fresh" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {revision.length === 0 && fresh.length === 0 && (
          <div className="glass-card rounded-3xl p-10 text-center">
            <span className="text-5xl">🤖</span>
            <p className="mt-3 text-ink-600 dark:text-ink-300">
              Nothing to show — adjust the numbers above and hit Generate.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations
