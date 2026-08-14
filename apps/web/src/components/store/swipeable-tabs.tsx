"use client"

import {
  Children,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"

const AXIS_LOCK = 8
const SNAP_RATIO = 0.22
const SNAP_VELOCITY = 0.45
const RUBBER = 0.32

type SwipeableTabsProps = {
  index: number
  onIndexChange: (index: number) => void
  children: ReactNode
  className?: string
}

export function SwipeableTabs({
  index,
  onIndexChange,
  children,
  className = "",
}: SwipeableTabsProps) {
  const panels = Children.toArray(children)
  const count = panels.length
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const dragRef = useRef({
    active: false,
    axis: null as "x" | "y" | null,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startAt: 0,
    dx: 0,
    suppressClick: false,
  })
  const [width, setWidth] = useState(0)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [rtl, setRtl] = useState(true)

  const syncHeight = useCallback(
    (currentIndex: number, dragX = 0) => {
      const viewport = viewportRef.current
      if (!viewport) {
        return
      }

      const neighbor =
        dragX === 0
          ? currentIndex
          : currentIndex + Math.sign(dragX) * (rtl ? 1 : -1)
      const a = panelRefs.current[currentIndex]?.offsetHeight ?? 0
      const b = panelRefs.current[neighbor]?.offsetHeight ?? 0
      viewport.style.height = `${Math.max(a, b, 0)}px`
    },
    [rtl],
  )

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    setRtl(getComputedStyle(viewport).direction === "rtl")

    const updateWidth = () => setWidth(viewport.offsetWidth)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    syncHeight(index, dragging ? dx : 0)
    const panel = panelRefs.current[index]
    if (!panel) {
      return
    }

    const observer = new ResizeObserver(() => {
      syncHeight(index, dragging ? dx : 0)
    })
    observer.observe(panel)

    return () => observer.disconnect()
  }, [count, dragging, dx, index, syncHeight])

  function rubber(nextDx: number) {
    const goingNext = rtl ? nextDx > 0 : nextDx < 0
    const goingPrev = rtl ? nextDx < 0 : nextDx > 0
    const atStart = index <= 0
    const atEnd = index >= count - 1

    if ((goingPrev && atStart) || (goingNext && atEnd)) {
      return nextDx * RUBBER
    }

    return nextDx
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return
    }

    dragRef.current = {
      active: true,
      axis: null,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startAt: Date.now(),
      dx: 0,
      suppressClick: false,
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return
    }

    const moveX = event.clientX - drag.startX
    const moveY = event.clientY - drag.startY

    if (!drag.axis) {
      if (Math.abs(moveX) < AXIS_LOCK && Math.abs(moveY) < AXIS_LOCK) {
        return
      }

      drag.axis = Math.abs(moveX) > Math.abs(moveY) ? "x" : "y"
      if (drag.axis === "x") {
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
      }
    }

    if (drag.axis !== "x") {
      return
    }

    const nextDx = rubber(moveX)
    drag.dx = nextDx
    setDx(nextDx)
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) {
      return
    }

    const wasSwipe = drag.axis === "x"
    const elapsed = Math.max(Date.now() - drag.startAt, 1)
    const velocity = drag.dx / elapsed
    const goingNext = rtl ? drag.dx > 0 : drag.dx < 0
    const distance = Math.abs(drag.dx)
    const shouldFlip =
      wasSwipe &&
      (distance > width * SNAP_RATIO || Math.abs(velocity) > SNAP_VELOCITY)

    let next = index
    if (shouldFlip && goingNext) {
      next = Math.min(count - 1, index + 1)
    } else if (shouldFlip) {
      next = Math.max(0, index - 1)
    }

    if (wasSwipe && next !== index) {
      onIndexChange(next)
    }

    drag.active = false
    drag.axis = null
    drag.suppressClick = wasSwipe && distance > AXIS_LOCK
    setDx(0)
    setDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!dragRef.current.suppressClick) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    dragRef.current.suppressClick = false
  }

  const offset = (rtl ? 1 : -1) * index * width + dx

  return (
    <div
      ref={viewportRef}
      className={`overflow-hidden overscroll-x-contain touch-pan-y ${className}`}
      style={{
        transition: dragging ? "none" : "height 200ms ease",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      <div
        className={`swipe-tab-track flex h-full ${dragging ? "select-none" : ""}`}
        style={{
          width: width ? `${count * width}px` : `${count * 100}%`,
          transform: `translate3d(${width ? `${offset}px` : "0px"}, 0, 0)`,
          transition: dragging
            ? "none"
            : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {panels.map((child, panelIndex) => (
          <div
            key={panelIndex}
            ref={(node) => {
              panelRefs.current[panelIndex] = node
            }}
            className="h-fit shrink-0"
            style={{ width: width ? `${width}px` : `${100 / count}%` }}
            aria-hidden={panelIndex !== index}
            inert={panelIndex !== index}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
