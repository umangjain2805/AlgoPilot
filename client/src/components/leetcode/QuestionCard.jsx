import {
  AlignLeft,
  Archive,
  ArrowUpRight,
  Binary,
  BookOpen,
  Calculator,
  Code2,
  GitBranch,
  Hash,
  Layers,
  Link2,
  Move,
  Repeat,
  Search,
  Type,
  Workflow,
  Zap,
} from 'lucide-react'
import DifficultyBadge from './DifficultyBadge.jsx'

// Topic → icon + gradient for the card "illustration" tile.
const topicMeta = {
  array: { icon: Layers, gradient: 'from-emerald-500 to-teal-500' },
  arrays: { icon: Layers, gradient: 'from-emerald-500 to-teal-500' },
  string: { icon: Type, gradient: 'from-sky-500 to-blue-500' },
  strings: { icon: Type, gradient: 'from-sky-500 to-blue-500' },
  'binary search': { icon: Search, gradient: 'from-violet-500 to-purple-500' },
  'linked list': { icon: Link2, gradient: 'from-indigo-500 to-violet-500' },
  recursion: { icon: Repeat, gradient: 'from-rose-500 to-pink-500' },
  stack: { icon: Archive, gradient: 'from-teal-500 to-emerald-500' },
  'stack & queue': { icon: Archive, gradient: 'from-teal-500 to-emerald-500' },
  queue: { icon: Archive, gradient: 'from-teal-500 to-emerald-500' },
  greedy: { icon: Zap, gradient: 'from-amber-500 to-orange-500' },
  dp: { icon: Workflow, gradient: 'from-violet-500 to-purple-500' },
  'dynamic programming': { icon: Workflow, gradient: 'from-violet-500 to-purple-500' },
  graph: { icon: GitBranch, gradient: 'from-sky-500 to-indigo-500' },
  hashing: { icon: Hash, gradient: 'from-emerald-500 to-green-500' },
  'hash table': { icon: Hash, gradient: 'from-emerald-500 to-green-500' },
  'two pointers': { icon: Move, gradient: 'from-indigo-500 to-sky-500' },
  'sliding window': { icon: AlignLeft, gradient: 'from-blue-500 to-indigo-500' },
  backtracking: { icon: BookOpen, gradient: 'from-rose-500 to-red-500' },
  'bit manipulation': { icon: Binary, gradient: 'from-amber-500 to-yellow-500' },
  math: { icon: Calculator, gradient: 'from-slate-500 to-slate-600' },
}

const getTopicMeta = (topic = '') =>
  topicMeta[(topic || '').trim().toLowerCase()] || {
    icon: Code2,
    gradient: 'from-primary-500 to-violet-500',
  }

const estimateMinutes = (difficulty) =>
  ({ Easy: 15, Medium: 25, Hard: 40 })[difficulty] || 25

// Coding "Question Card" per ui.md — replaces the NFT card concept.
const QuestionCard = ({ title, difficulty, topic, tags = [], url, rationale, kind }) => {
  const { icon: TopicIcon, gradient } = getTopicMeta(topic)

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-ink-200/70 bg-white/70 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-ink-700 dark:bg-ink-900/50">
      <div className="flex items-start justify-between">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <TopicIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-ink-900 dark:text-white">
        {title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[11px] font-semibold text-primary-600 dark:text-primary-400">
          {topic}
        </span>
        {tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {rationale && (
        <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{rationale}</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
        <span className="text-xs font-medium text-ink-400 dark:text-ink-500">
          ⏱ {estimateMinutes(difficulty)} min
        </span>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="btn-success px-3 py-1.5 text-xs">
            Solve
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{kind}</span>
        )}
      </div>
    </div>
  )
}

export default QuestionCard
