import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

const Recommendations = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
              Recommendations
            </h1>
            <p className="mt-1 text-ink-600 dark:text-ink-400">
              AI-powered problem recommendations based on your profile
            </p>
          </div>
        </div>
        <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
          Phase 4
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-10 text-center"
      >
        <span className="text-5xl">🤖</span>
        <h2 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">
          Coming in Phase 4
        </h2>
        <p className="mt-2 max-w-md mx-auto text-ink-600 dark:text-ink-300">
          Personalized problem recommendations powered by AI analysis of your LeetCode profile.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50">
            <p className="font-semibold text-ink-900 dark:text-white">Weakness Detection</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">Identify topics needing practice</p>
          </div>
          <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50">
            <p className="font-semibold text-ink-900 dark:text-white">Smart Scheduling</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">Optimal problem order for growth</p>
          </div>
          <div className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50">
            <p className="font-semibold text-ink-900 dark:text-white">Difficulty Calibration</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">Problems matched to your level</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Recommendations