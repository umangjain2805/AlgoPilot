import { ThemeProvider } from './context/ThemeProvider.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
