import { useState, useEffect } from 'react'

type Theme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'film-folder-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system'
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem(STORAGE_KEY)
    } else {
      root.setAttribute('data-theme', theme)
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  function cycle() {
    setTheme(t => t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system')
  }

  return { theme, cycle }
}
