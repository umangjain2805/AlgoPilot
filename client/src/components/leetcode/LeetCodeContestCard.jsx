const LeetCodeContestCard = ({ profile }) => (
  <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/15 text-lg text-accent-600 dark:text-accent-400">
        🏆
      </span>
      <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">Contest Performance</h3>
    </div>

    <div className="mt-5 grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          {profile.contestRating ? Math.round(profile.contestRating) : '—'}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Rating
        </p>
      </div>
      <div>
        <p className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          {profile.contestGlobalRanking ? profile.contestGlobalRanking.toLocaleString() : '—'}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Global Rank
        </p>
      </div>
      <div>
        <p className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          {profile.contestTopPercentage != null ? `${profile.contestTopPercentage}%` : '—'}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Top %
        </p>
      </div>
    </div>
  </div>
)

export default LeetCodeContestCard
