import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SettingsProvider } from './state/settings'
import './styles/global.css'

/**
 * Small hardening for a device that will be held by someone who does not know
 * what a browser is: no long-press menus, no pinch zoom, no accidental
 * double-tap zoom, and no page scrolling behind the app.
 */
function hardenForToddlers(): void {
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  document.addEventListener('gesturestart', (e) => e.preventDefault())
  document.addEventListener(
    'touchmove',
    (e) => {
      // Allow scrolling only inside elements that genuinely scroll.
      const target = e.target as HTMLElement | null
      if (!target?.closest('.thread, .sheet-panel, .friend-strip')) e.preventDefault()
    },
    { passive: false },
  )
  let lastTouch = 0
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now()
      if (now - lastTouch < 320) e.preventDefault()
      lastTouch = now
    },
    { passive: false },
  )
}

hardenForToddlers()

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </StrictMode>,
  )
}

// Offline support. Registered late so it never competes with first paint, and
// skipped in dev where it would only cache stale modules.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Resolved against the page itself, so the app works from a sub-folder
    // just as well as from the root of a domain.
    const swUrl = new URL('sw.js', document.baseURI)
    navigator.serviceWorker.register(swUrl).catch(() => undefined)
  })
}
