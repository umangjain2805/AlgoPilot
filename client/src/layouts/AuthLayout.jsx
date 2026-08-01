import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

// Auth pages layout — centered card on a subtle gradient background.
const AuthLayout = () => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-ink-50 to-accent-50 px-4 py-10 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950">
    <div className="bg-grid-pattern pointer-events-none absolute inset-0" aria-hidden="true" />

    <div className="relative w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <div className="glass-card rounded-3xl p-8 sm:p-10">
        <Outlet />
      </div>
    </div>
  </div>
)

export default AuthLayout
