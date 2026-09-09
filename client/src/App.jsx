import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { LeetCodeProvider } from './context/LeetCodeContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <LeetCodeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LeetCodeProvider>
    </ThemeProvider>
  )
}
