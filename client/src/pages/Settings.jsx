import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import Button from '../components/Button.jsx'
import Avatar from '../components/Avatar.jsx'

const Settings = () => {
  const { user, isGuest, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('account')

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ink-500 to-ink-600 text-white">
            <SettingsIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-1 text-ink-600 dark:text-ink-400">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="border-b border-ink-200/60 dark:border-ink-800/60">
          <nav className="flex overflow-x-auto px-4" aria-label="Settings tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <Avatar name={user?.name} src={user?.avatar} size="lg" />
                <div>
                  <h3 className="font-semibold text-ink-900 dark:text-white">{user?.name}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
                </div>
              </div>
              <div className="rounded-xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50">
                <h4 className="font-semibold text-ink-900 dark:text-white">Account Information</h4>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Name</label>
                    <p className="mt-1 text-ink-900 dark:text-white">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Email</label>
                    <p className="mt-1 text-ink-900 dark:text-white">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Provider</label>
                    <p className="mt-1 capitalize text-ink-900 dark:text-white">{user?.provider}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-500 dark:text-ink-400">Role</label>
                    <p className="mt-1 capitalize text-ink-900 dark:text-white">{user?.role}</p>
                  </div>
                </div>
              </div>
              {isGuest && (
                <div className="rounded-xl border border-amber-200/70 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/20">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    You&apos;re in guest mode. Create an account to save your preferences permanently.
                  </p>
                  <Button variant="primary" className="mt-3" onClick={() => logout()}>
                    Create Account
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-semibold text-ink-900 dark:text-white">Theme</h3>
                <p className="text-sm text-ink-500 dark:text-ink-400">Choose your preferred color scheme</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                      theme === 'system'
                        ? 'border-primary-500 bg-primary-500/5 dark:border-primary-500 dark:bg-primary-900/10'
                        : 'border-ink-200/70 hover:border-primary-300 dark:border-ink-700 dark:hover:border-primary-700'
                    }`}
                  >
                    <span className="text-4xl">
                      {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                    </span>
                    <span className="font-semibold capitalize text-ink-900 dark:text-white">{theme}</span>
                    <span className="text-sm text-ink-500 dark:text-ink-400">
                      {theme === 'light' ? 'Always light' : theme === 'dark' ? 'Always dark' : 'Match system'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { title: 'Email notifications', desc: 'Receive updates via email', enabled: true },
                { title: 'Contest reminders', desc: 'Get notified before contests start', enabled: true },
                { title: 'Recommendation alerts', desc: 'New problem recommendations', enabled: false },
                { title: 'Weekly progress report', desc: 'Summary of your weekly activity', enabled: false },
              ].map((notif, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50"
                >
                  <div>
                    <p className="font-medium text-ink-900 dark:text-white">{notif.title}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-ink-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { title: 'Profile visibility', desc: 'Allow others to see your profile', enabled: true },
                { title: 'Show in leaderboards', desc: 'Appear in public rankings', enabled: true },
                { title: 'Share progress data', desc: 'Allow analytics to improve recommendations', enabled: false },
                { title: 'Data analytics', desc: 'Help improve the platform with usage data', enabled: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-ink-200/70 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50"
                >
                  <div>
                    <p className="font-medium text-ink-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-ink-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings