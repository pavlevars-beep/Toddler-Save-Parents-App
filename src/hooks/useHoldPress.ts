/**
 * Press-and-hold gate.
 *
 * The only door out of a child's screen into the parent area. A toddler taps;
 * they do not hold a steady finger on one spot for two full seconds, which
 * makes this a reliable lock without a maths puzzle or a PIN a parent forgets.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export interface HoldHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onPointerCancel: () => void
}

export function useHoldPress(onComplete: () => void, durationMs = 2000) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)
  const startedAt = useRef(0)
  const done = useRef(false)

  const stop = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    setProgress(0)
  }, [])

  const tick = useCallback(() => {
    const elapsed = performance.now() - startedAt.current
    const p = Math.min(1, elapsed / durationMs)
    setProgress(p)
    if (p >= 1) {
      if (!done.current) {
        done.current = true
        stop()
        onComplete()
      }
      return
    }
    frame.current = requestAnimationFrame(tick)
  }, [durationMs, onComplete, stop])

  const start = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      done.current = false
      startedAt.current = performance.now()
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(tick)
    },
    [tick],
  )

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const handlers: HoldHandlers = {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  }

  return { progress, handlers }
}
