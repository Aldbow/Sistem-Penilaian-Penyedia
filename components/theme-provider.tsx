'use client'

import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'kemnaker-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    // Sync with the theme that was already applied by the blocking script
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme
        if (storedTheme) {
          setTheme(storedTheme)
        } else {
          // If no stored theme, check what the blocking script applied
          const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
          setTheme(currentTheme)
        }
      } catch (e) {
        // Fallback to light theme
        setTheme('light')
      }
    }
  }, [storageKey])

  React.useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    let appliedTheme = theme

    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Only update if the current theme is different from what should be applied
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light'
    if (currentTheme !== appliedTheme) {
      root.classList.remove('light', 'dark')
      root.classList.add(appliedTheme)
      root.setAttribute('data-theme', appliedTheme)
    }
  }, [theme, mounted])

  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
  }), [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}