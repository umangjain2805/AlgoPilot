import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import GuestRoute from './routes/GuestRoute.jsx'
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GuestDashboard from './pages/GuestDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import GuestEntry from './components/GuestEntry.jsx'

import { AuthBootstrap } from './features/auth/AuthBootstrap.jsx'
import { AuthListener } from './features/auth/AuthListener.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthListener />
      <AuthBootstrap />
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="/guest" element={<GuestEntry />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Public-only routes (redirect if authenticated) */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/guest/dashboard" element={<GuestDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
