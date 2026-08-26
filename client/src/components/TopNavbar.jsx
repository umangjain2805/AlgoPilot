import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import Avatar from './Avatar.jsx'
import Button from './Button.jsx'

const TopNavbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const userMenuRef = useRef(null)
  const notificationsRef = useRef(null)

  const { user, isGuest, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
  }

  return (
    <header
      className="sticky top-0 z-20 h-16 glass border-b border-white/40 dark:border-ink-800/60"
      role="banner"
    >
      <div className="flex h-full max-w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-ink-500 hover:text-ink-700 hover:bg-ink-100/50 dark:hover:bg-ink-800/50 dark:hover:text-ink-200"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search problems, tags, users..."
              className="h-10 w-72 pl-10 pr-4 rounded-xl border border-ink-200 bg-white/70 text-sm text-ink-900 placeholder:text-ink-400 shadow-sm transition-colors focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-100 dark:placeholder:text-ink-500"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative p-2 rounded-xl text-ink-500 hover:text-ink-700 hover:bg-ink-100/50 dark:hover:bg-ink-800/50 dark:hover:text-ink-200"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-ink-200 bg-white p-4 shadow-xl dark:border-ink-700 dark:bg-ink-900"
                role="dialog"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-ink-900 dark:text-white">Notifications</h3>
                  <Button variant="ghost" size="sm">Mark all read</Button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { title: 'New problem recommendation', time: '5 min ago', unread: true },
                    { title: 'Contest starts in 1 hour', time: '1 hour ago', unread: true },
                    { title: 'Profile synced successfully', time: '2 hours ago', unread: false },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        notif.unread ? 'bg-primary-500/5 dark:bg-primary-900/10' : 'hover:bg-ink-100/50 dark:hover:bg-ink-800/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 dark:text-white">{notif.title}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-ink-200/60 dark:border-ink-800/60">
                  <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-ink-100/50 dark:hover:bg-ink-800/50"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              {!isGuest && (
                <span className="hidden sm:block text-sm font-medium text-ink-700 dark:text-ink-200 truncate max-w-[120px]">
                  {user?.name}
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-ink-500" />
            </button>

            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-ink-200 bg-white py-2 shadow-xl dark:border-ink-700 dark:bg-ink-900"
                role="menu"
              >
                {isGuest ? (
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Create Account
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-ink-200/60 dark:border-ink-800/60" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <button
            type="button"
            className="p-2 rounded-xl text-ink-500 hover:text-ink-700 hover:bg-ink-100/50 dark:hover:bg-ink-800/50 dark:hover:text-ink-200"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar