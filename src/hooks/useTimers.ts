import { useCallback, useEffect, useRef } from 'react'

/**
 * Timers that clean themselves up.
 *
 * Every screen in this app is a little sequence of "sound, then wait, then
 * animation". When a child leaves mid-sequence — which they always do — the
 * pending steps must not fire into an unmounted screen.
 */
export function useTimers() {
  const ids = useRef<number[]>([])

  const clearAll = useCallback(() => {
    ids.current.forEach((id) => window.clearTimeout(id))
    ids.current = []
  }, [])

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      ids.current = ids.current.filter((x) => x !== id)
      fn()
    }, ms)
    ids.current.push(id)
    return id
  }, [])

  useEffect(() => clearAll, [clearAll])

  return { after, clearAll }
}
