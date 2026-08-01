const LeetCodeBadges = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
        <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">Badges</h3>
        <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">No badges earned yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-6 dark:border-ink-700 dark:bg-ink-900/50">
      <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
        Badges ({badges.length})
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.badgeId || badge.displayName}
            className="flex flex-col items-center gap-2 rounded-xl border border-ink-200/60 bg-white/50 p-3 text-center dark:border-ink-700 dark:bg-ink-900/40"
            title={badge.displayName}
          >
            {badge.icon ? (
              <img src={badge.icon} alt={badge.displayName} className="h-10 w-10 object-contain" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/20 text-lg">
                🏅
              </span>
            )}
            <p className="text-xs font-semibold text-ink-800 dark:text-ink-200">
              {badge.displayName}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeetCodeBadges
