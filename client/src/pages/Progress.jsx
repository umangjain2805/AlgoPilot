import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Button from '../components/Button.jsx'

const Progress = () => {
  const { isGuest } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Progress</h1>
          <p className="mt-1 text-ink-600 dark:text-ink-400">Track your LeetCode progress over time</p>
        </div>
      </div>

      {isGuest ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <span className="text-5xl">📈</span>
          <h2 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">
            Guest Mode
          </h2>
          <p className="mt-2 max-w-md mx-auto text-ink-600 dark:text-ink-300">
            Connect your LeetCode account to view your progress charts and statistics.
          </p>
          <Link to="/leetcode" className="mt-6 inline-block">
            <Button size="lg">Connect LeetCode</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <span className="text-5xl">📊</span>
          <h2 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">
            Progress Analytics
          </h2>
          <p className="mt-2 max-w-md mx-auto text-ink-600 dark:text-ink-300">
            Your progress charts and analytics will appear here after connecting LeetCode.
          </p>
          <Link to="/leetcode" className="mt-6 inline-block">
            <Button size="lg">Connect LeetCode</Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default Progress