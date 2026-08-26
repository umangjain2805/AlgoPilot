import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import Button from '../components/Button.jsx'

const ComingSoon = ({ title, description, icon: Icon, iconColor, path, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto"
  >
    <div className={`mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ${iconColor}`}>
      <Icon className="h-10 w-10 text-white" />
    </div>
    <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">{title}</h2>
    <p className="mt-3 max-w-md mx-auto text-ink-600 dark:text-ink-300">{description}</p>
    {path && (
      <Link to={path} className="mt-8 inline-block">
        <Button variant="primary">{label}</Button>
      </Link>
    )}
  </motion.div>
)

const Profile = () => {
  const { isGuest } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-ink-600 dark:text-ink-400">View and manage your profile information</p>
        </div>
      </div>

      {isGuest ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-10 text-center"
        >
          <span className="text-5xl">🔒</span>
          <h2 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">
            Guest Mode
          </h2>
          <p className="mt-2 max-w-md mx-auto text-ink-600 dark:text-ink-300">
            Connect your LeetCode account to view your personalized profile.
          </p>
          <Link to="/leetcode" className="mt-6 inline-block">
            <Button size="lg">Connect LeetCode</Button>
          </Link>
        </motion.div>
      ) : (
        <ComingSoon
          title="Profile Page"
          description="Your LeetCode profile with avatar, ranking, badges, and social links will appear here once connected."
          icon={User}
          iconColor="from-primary-500 to-primary-600"
          path="/leetcode"
          label="Connect LeetCode"
        />
      )}
    </div>
  )
}

export default Profile