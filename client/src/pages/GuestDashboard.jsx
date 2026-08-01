import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Button from '../components/Button.jsx'

const GuestDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-8 text-center sm:p-12">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent-500 to-primary-600 text-4xl shadow-lg shadow-accent-500/25">
          🧪
        </span>

        <h1 className="font-display mt-6 text-3xl font-bold text-ink-900 dark:text-white">
          Welcome, Guest!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          You&apos;re exploring <span className="font-semibold">AI LeetCode Coach</span> in guest
          mode. You have limited access until you create a free account.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-5 text-left dark:border-ink-700 dark:bg-ink-900/50">
            <p className="text-sm font-semibold text-ink-900 dark:text-white">What you can do</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-600 dark:text-ink-300">
              <li>• Preview the dashboard experience</li>
              <li>• Explore the interface</li>
              <li>• See how coaching works</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-5 text-left dark:border-ink-700 dark:bg-ink-900/50">
            <p className="text-sm font-semibold text-ink-900 dark:text-white">
              What you&apos;re missing
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-600 dark:text-ink-300">
              <li>✗ LeetCode profile analysis</li>
              <li>✗ Personalized recommendations</li>
              <li>✗ Progress tracking</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={handleLogout}>
            Exit Guest Mode
          </Button>
        </div>

        {user?.name && (
          <p className="mt-6 text-xs text-ink-400 dark:text-ink-500">
            Signed in as {user.name}
          </p>
        )}
      </div>
    </div>
  )
}

export default GuestDashboard
