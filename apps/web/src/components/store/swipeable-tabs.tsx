"use client"

import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react"

type SwipeableTabsProps = {
  index: number
  onIndexChange: (index: number) => void
  children: ReactNode
  className?: string
}

function nearestPanelIndex(scroller: HTMLElement, panels: Array<HTMLElement | null>) {
  const bounds = scroller.getBoundingClientRect()
  let best = 0
  let bestVisible = -1

  for (let i = 0; i < panels.length; i += 1) {
    const panel = panels[i]
    if (!panel) {
      continue
    }

    const rect = panel.getBoundingClientRect()
    const visible = Math.max(
      0,
      Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left),
    )

    if (visible > bestVisible) {
      bestVisible = visible
      best = i
    }
  }

  return best
}

export function SwipeableTabs({
  index,
  onIndexChange,
  children,
  className = "",
}: SwipeableTabsProps) {
  const panels = Children.toArray(children)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const programmaticRef = useRef(false)
  const fromScrollRef = useRef(false)

  const scrollToIndex = useCallback((next: number, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current
    const panel = panelRefs.current[next]
    if (!scroller || !panel) {
      return
    }

    const delta =
      panel.getBoundingClientRect().left - scroller.getBoundingClientRect().left
    if (Math.abs(delta) < 2) {
      return
    }

    programmaticRef.current = true
    scroller.scrollBy({ left: delta, behavior })
    window.setTimeout(() => {
      programmaticRef.current = false
    }, 420)
  }, [])

  useLayoutEffect(() => {
    if (fromScrollRef.current) {
      fromScrollRef.current = false
      return
    }

    scrollToIndex(index, "smooth")
  }, [index, scrollToIndex])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) {
      return
    }

    let timer = 0

    function sync() {
      if (programmaticRef.current) {
        return
      }

      const next = nearestPanelIndex(scroller, panelRefs.current)
      if (next === index) {
        return
      }

      fromScrollRef.current = true
      onIndexChange(next)
    }

    function onScroll() {
      window.clearTimeout(timer)
      timer = window.setTimeout(sync, 60)
    }

    scroller.addEventListener("scroll", onScroll, { passive: true })
    scroller.addEventListener("scrollend", sync)

    return () => {
      window.clearTimeout(timer)
      scroller.removeEventListener("scroll", onScroll)
      scroller.removeEventListener("scrollend", sync)
    }
  }, [index, onIndexChange, panels.length])

  return (
    <div
      ref={scrollerRef}
      className={`swipe-tab-scroller no-scrollbar flex w-full overflow-x-auto overflow-y-hidden ${className}`}
    >
      {panels.map((child, panelIndex) => (
        <div
          key={panelIndex}
          ref={(node) => {
            panelRefs.current[panelIndex] = node
          }}
          className="swipe-tab-panel min-h-80"
          aria-hidden={panelIndex !== index}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
