import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContext.js'

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
    } catch {
      /* browser storage can be unavailable */
    }
    return (
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false)
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      /* theme still works in memory */
    }
  }, [dark])

  const toggleTheme = () => setDark((d) => !d)

  return <ThemeContext.Provider value={{ dark, toggleTheme }}>{children}</ThemeContext.Provider>
}
