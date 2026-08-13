"use client"

import { FaIcon } from "@/components/fa-icon"
import { useTheme } from "@/components/theme-provider"
import { messages } from "@/lib/i18n"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { toggleTheme } = useTheme()

  return (
    <button
      type="button"
      dir="ltr"
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-18 shrink-0 items-center rounded-full bg-soft p-1 text-espresso transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha ${className}`.trim()}
      aria-label={messages.theme.toggle}
      title={messages.theme.toggle}
    >
      <span
        aria-hidden
        className="absolute top-1 left-1 size-8 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out dark:translate-x-8"
      />
      <span className="relative z-10 flex w-full items-center justify-around text-sm">
        <FaIcon icon="fa-sun" className="dark:text-muted" />
        <FaIcon icon="fa-moon" />
      </span>
    </button>
  )
}
