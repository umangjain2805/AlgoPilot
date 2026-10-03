import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { LeetCodeProvider } from './context/LeetCodeContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
const AnalysisPage = lazy(() => import('./pages/AnalysisPage.jsx'))

export default function App() {
  return (
    <ThemeProvider>
      <LeetCodeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/analysis"
              element={
                <Suspense
                  fallback={
                    <p className="p-8 text-center text-slate-600 dark:text-slate-300" role="status">
                      Loading practice analysis...
                    </p>
                  }
                >
                  <AnalysisPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LeetCodeProvider>
    </ThemeProvider>
  )
}
