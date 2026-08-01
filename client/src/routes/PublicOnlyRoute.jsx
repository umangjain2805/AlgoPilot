import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Spinner from '../components/Spinner.jsx'

// Redirects already-authenticated users away from public-only pages (login/register).
const PublicOnlyRoute = () => {
  const { isAuthenticated, isGuest, isLoading } = useAuth()
  const target = isGuest ? '/guest/dashboard' : '/dashboard'

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={target} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
