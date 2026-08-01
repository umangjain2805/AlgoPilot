const StatCard = ({ label, value, accent = 'primary' }) => {
  const accentClasses = {
    primary: 'bg-primary-500/15 text-primary-600 dark:text-primary-400',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-400',
  }

  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 text-center dark:border-ink-700 dark:bg-ink-900/50">
      <p className={`font-display text-2xl font-extrabold ${accentClasses[accent]}`}>{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </p>
    </div>
  )
}

const LeetCodeStatsGrid = ({ profile }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    <StatCard label="Total Solved" value={profile.totalSolved} accent="primary" />
    <StatCard label="Easy" value={profile.easySolved} accent="success" />
    <StatCard label="Medium" value={profile.mediumSolved} accent="warning" />
    <StatCard label="Hard" value={profile.hardSolved} accent="danger" />
    <StatCard label="Acceptance" value={`${profile.acceptanceRate}%`} accent="accent" />
    <StatCard label="Contribution Pts" value={profile.contributionPoints} accent="primary" />
  </div>
)

export default LeetCodeStatsGrid
