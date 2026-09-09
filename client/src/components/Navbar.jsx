import { NavLink, Link } from 'react-router-dom'
import {
  Bot,
  Brain,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  UserX,
} from 'lucide-react'
import { useLeetCode } from '../hooks/useLeetCode.js'

export default function Navbar() {
  const { profile, analysis, loading, sync, reset } = useLeetCode()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-slate-900 bg-white/95 backdrop-blur-md dark:border-slate-100 dark:bg-[#121316]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 focus:outline-none">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[2px_2px_0px_0px_#f1f5f9]">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-display text-base font-black tracking-tight text-slate-950 dark:text-white">
                LeetCode <span className="rounded-md bg-[#E2F952] px-1.5 py-0.5 text-slate-950 dark:text-slate-950">AI Coach</span>
              </span>
              <span className="hidden text-[10px] font-bold text-slate-500 sm:inline dark:text-slate-400">
                Neo-Modern Interview Prep
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-2 sm:flex" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                  isActive
                    ? 'border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[2px_2px_0px_0px_#f1f5f9]'
                    : 'border-2 border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard & Plan</span>
            </NavLink>

            <NavLink
              to="/analysis"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                  isActive
                    ? 'border-2 border-slate-900 bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] dark:border-slate-100 dark:shadow-[2px_2px_0px_0px_#f1f5f9]'
                    : 'border-2 border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Brain className="h-4 w-4" />
              <span>AI Analysis</span>
              {analysis?.weakTopics?.length > 0 && (
                <span className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-rose-400 px-1.5 py-0.5 text-[10px] font-black text-slate-950">
                  {analysis.weakTopics.length}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {profile ? (
            <div className="neo-box-sm flex items-center gap-2 rounded-2xl bg-white p-1 pl-2.5 sm:gap-3 dark:bg-slate-900">
              {/* Profile identity */}
              <div className="flex items-center gap-2">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.leetcodeUsername}
                    className="h-7 w-7 rounded-full border-1.5 border-slate-900 object-cover dark:border-slate-100"
                  />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full border-1.5 border-slate-900 bg-[#E2F952] text-xs font-black text-slate-950">
                    {(profile.leetcodeUsername || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="hidden flex-col text-left md:flex">
                  <span className="max-w-[100px] truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                    @{profile.leetcodeUsername}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {profile.totalSolved || 0} solved
                  </span>
                </div>
              </div>

              {/* Sync button */}
              <button
                type="button"
                onClick={sync}
                disabled={loading}
                title="Sync profile data from LeetCode"
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-900 bg-slate-100 text-slate-900 transition hover:bg-[#E2F952] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 dark:border-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-[#E2F952] dark:hover:text-slate-950"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Reset button */}
              <button
                type="button"
                onClick={reset}
                title="Switch LeetCode profile"
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-900 bg-slate-100 text-slate-900 transition hover:bg-rose-400 hover:text-slate-950 active:translate-x-0.5 active:translate-y-0.5 dark:border-slate-100 dark:bg-slate-800 dark:text-slate-100"
              >
                <UserX className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex border-t-2 border-slate-900 px-4 py-2 sm:hidden dark:border-slate-100">
        <div className="grid w-full grid-cols-2 gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 rounded-lg border-2 border-slate-900 py-1.5 text-xs font-black ${
                isActive
                  ? 'bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'bg-white text-slate-900'
              }`
            }
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 rounded-lg border-2 border-slate-900 py-1.5 text-xs font-black ${
                isActive
                  ? 'bg-[#E2F952] text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'bg-white text-slate-900'
              }`
            }
          >
            <Brain className="h-3.5 w-3.5" />
            AI Analysis
          </NavLink>
        </div>
      </div>
    </header>
  )
}
