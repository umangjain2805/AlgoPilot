import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Spinner from './Spinner.jsx'

// Auto-starts guest login when mounted, then redirects to the guest dashboard.
const GuestEntry = () => {
  const { guestLogin, isGuest, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && isGuest) {
      navigate('/guest/dashboard', { replace: true })
      return
    }

    let cancelled = false
    guestLogin({}).then((result) => {
      if (!cancelled && !result.error) {
        navigate('/guest/dashboard', { replace: true })
      }
    })

    return () => {
      cancelled = true
    }
  }, [guestLogin, isAuthenticated, isGuest, navigate])

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">Starting guest session...</p>
      </div>
    </div>
  )
}

export default GuestEntry
