import { useAuth } from '../hooks/useAuth.js'
import Avatar from '../components/Avatar.jsx'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} src={user?.avatar} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="glass-card mt-10 rounded-3xl p-8">
        <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
          Your coaching dashboard
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          This is where your personalized LeetCode analysis and recommendations will appear in
          Phase 2. For now, your account is set up and ready.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { label: 'Account status', value: 'Active', icon: '✓' },
            { label: 'Plan', value: 'Free', icon: '★' },
            { label: 'LeetCode connected', value: 'Phase 2', icon: '◎' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-ink-200/70 bg-white/70 p-5 dark:border-ink-700 dark:bg-ink-900/50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-500/15 text-lg text-primary-600 dark:text-primary-400">
                {card.icon}
              </span>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">{card.label}</p>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
