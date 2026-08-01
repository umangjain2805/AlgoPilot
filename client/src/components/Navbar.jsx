import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Logo from './Logo.jsx'
import Avatar from './Avatar.jsx'
import Button from './Button.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
  }`

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isGuest, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/40 dark:border-ink-800/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/#features" className={navLinkClass}>
            Features
          </NavLink>
          {isAuthenticated && (
            <NavLink to={isGuest ? '/guest/dashboard' : '/dashboard'} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && !isGuest && (
            <NavLink to="/leetcode" className={navLinkClass}>
              LeetCode
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {isGuest && (
                <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-600 dark:text-accent-400">
                  Guest
                </span>
              )}
              <Link
                to={isGuest ? '/guest/dashboard' : '/dashboard'}
                className="flex items-center gap-2"
                title={user?.name}
              >
                <Avatar name={user?.name} src={user?.avatar} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass border-t border-white/30 px-4 pb-4 pt-2 dark:border-ink-800/60 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/#features" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Features
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to={isGuest ? '/guest/dashboard' : '/dashboard'}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && !isGuest && (
              <NavLink to="/leetcode" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                LeetCode
              </NavLink>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/30 pt-4 dark:border-ink-800/60">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <Avatar name={user?.name} src={user?.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setMobileOpen(false)
                    handleLogout()
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
