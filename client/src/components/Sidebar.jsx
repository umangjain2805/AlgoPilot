import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  BarChart2,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import Avatar from '../Avatar.jsx'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
  { path: '/dashboard/progress', label: 'Progress', icon: BarChart2 },
  { path: '/dashboard/recommendations', label: 'Recommendations', icon: Bot },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/50 dark:text-ink-300 dark:hover:text-white dark:hover:bg-ink-800/50'
  }`

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { isGuest, user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onToggleCollapse?.(false)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-40 md:hidden glass rounded-xl p-2 shadow-lg"
            onClick={onToggleCollapse}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-ink-600 dark:text-ink-300" />
          </motion.button>
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out glass border-r border-white/40 dark:border-ink-800/60 ${
          isCollapsed ? 'w-16' : 'w-64'
        } md:relative md:translate-x-0`}
        aria-label="Sidebar navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/40 dark:border-ink-800/60">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2" aria-label="AI LeetCode Coach">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l2.35 4.76 5.26.77-3.8 3.71.9 5.23L12 18.6l-4.71 2.47.9-5.23-3.8-3.71 5.26-.77L12 3z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-white">
                AI LeetCode <span className="gradient-text">Coach</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard" className="flex items-center justify-center" aria-label="AI LeetCode Coach">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l2.35 4.76 5.26.77-3.8 3.71.9 5.23L12 18.6l-4.71 2.47.9-5.23-3.8-3.71 5.26-.77L12 3z" fill="currentColor" />
                </svg>
              </span>
            </Link>
          )}

          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            className={`p-2 rounded-xl text-ink-500 hover:text-ink-700 hover:bg-ink-100/50 dark:hover:bg-ink-800/50 dark:hover:text-ink-200 ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Main navigation">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.path}>
                {item.disabled ? (
                  <button
                    className={`${navLinkClass({ isActive: false })} opacity-40 cursor-not-allowed`}
                    disabled
                    title="Coming soon"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => navLinkClass({ isActive })}
                    onClick={() => onToggleCollapse?.(false)}
                    title={item.disabled ? 'Coming soon' : undefined}
                    end
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {!isCollapsed && (
            <div className="mt-8 pt-4 border-t border-white/30 dark:border-ink-800/60">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Account
              </p>
              <ul className="mt-2 space-y-1" role="list">
                <li>
                  <button
                    onClick={handleLogout}
                    className={navLinkClass({ isActive: false })}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {!isCollapsed && !isGuest && (
          <div className="p-4 border-t border-white/30 dark:border-ink-800/60">
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <AnimatePresence mode="wait">
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-4 left-4 z-40 md:hidden glass rounded-xl p-2 shadow-lg"
            onClick={onToggleCollapse}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-ink-600 dark:text-ink-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar