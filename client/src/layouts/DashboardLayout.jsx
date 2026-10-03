import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="app-shell flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main key={pathname} className="page-enter min-w-0 flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400 dark:border-slate-800/70 dark:text-slate-600">
        <div className="mx-auto max-w-7xl px-4">
          LeetCode AI Coach &middot; Personalized practice &middot; Progress stored in your browser
        </div>
      </footer>
    </div>
  )
}
