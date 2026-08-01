import { Link } from 'react-router-dom'

const formatTime = (timestamp) => {
  if (!timestamp) return '—'
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusClasses = {
  Accepted: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Wrong: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  Timeout: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  Runtime: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  Memory: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
}

const LeetCodeRecentSubmissions = ({ submissions }) => {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
        <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
          Recent Submissions
        </h3>
        <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">No recent submissions.</p>
      </div>
    )
  }

  const statusKey = (status) => {
    if (!status) return ''
    if (status === 'Accepted') return 'Accepted'
    const base = status.split(' ')[0]
    return ['Wrong', 'Timeout', 'Runtime', 'Memory'].includes(base) ? base : ''
  }

  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
      <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
        Recent Submissions
      </h3>
      <ul className="mt-4 divide-y divide-ink-200/60 dark:divide-ink-700/60">
        {submissions.map((submission) => {
          const key = statusKey(submission.statusDisplay)
          return (
            <li key={submission.submissionId} className="flex items-center justify-between gap-3 py-3">
              <Link
                to={`https://leetcode.com/problems/${submission.titleSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-sm font-medium text-ink-800 hover:text-primary-600 dark:text-ink-200 dark:hover:text-primary-400"
              >
                {submission.title}
              </Link>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    statusClasses[key] || 'bg-ink-500/10 text-ink-600 dark:text-ink-300'
                  }`}
                >
                  {submission.statusDisplay || 'Submitted'}
                </span>
                <span className="rounded-md bg-ink-500/10 px-2 py-0.5 text-xs font-mono text-ink-600 dark:bg-ink-700/50 dark:text-ink-300">
                  {submission.lang || '—'}
                </span>
                <span className="hidden text-xs text-ink-400 dark:text-ink-500 sm:inline">
                  {formatTime(submission.timestamp)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LeetCodeRecentSubmissions
