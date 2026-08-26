import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

export default function DashboardLayout({ sidebar, children }) {
  const { dark, toggleTheme } = useTheme()

  return (
    <div className="app-glow min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 lg:hidden dark:border-slate-800">
          <span className="font-display font-bold text-slate-900 dark:text-white">
            LeetCode <span className="text-indigo-600 dark:text-indigo-400">AI Coach</span>
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {sidebar}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
