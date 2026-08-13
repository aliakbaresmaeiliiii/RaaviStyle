"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react"
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  const media = window.matchMedia("(prefers-color-scheme: dark)")

  function onMediaChange(event: MediaQueryListEvent) {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark") {
      return
    }

    applyTheme(event.matches ? "dark" : "light")
  }

  media.addEventListener("change", onMediaChange)

  return () => {
    listeners.delete(listener)
    media.removeEventListener("change", onMediaChange)
  }
}

function getServerSnapshot(): Theme {
  return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot)

  const setTheme = useCallback((next: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
    applyTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(getTheme() === "dark" ? "light" : "dark")
  }, [setTheme])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
