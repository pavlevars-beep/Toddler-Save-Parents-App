/*
 * Livada service worker.
 *
 * The app must work on a plane, in a car, and on a tablet in flight mode —
 * that is most of the situations it exists for. The strategy is deliberately
 * boring: cache the shell on install, then cache every same-origin file the
 * first time it is fetched, and serve from the cache forever after.
 *
 * There is no network-first path anywhere, because a half-loaded activity is
 * worse for a two-year-old than an old one.
 */

const VERSION = 'livada-v2'
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png']

/*
 * The built script and stylesheet have content-hashed names, so they cannot be
 * listed here by hand. They are also fetched by the page *before* this worker
 * takes control, which means runtime caching alone would miss them and the
 * first offline launch would fail. So: read index.html during install and cache
 * whatever it points at.
 */
async function precache() {
  const cache = await caches.open(VERSION)
  await cache.addAll(SHELL).catch(() => undefined)
  try {
    const res = await fetch('./index.html', { cache: 'reload' })
    const html = await res.text()
    const urls = new Set()
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const url = new URL(match[1], self.registration.scope)
      if (url.origin === self.location.origin) urls.add(url.href)
    }
    await Promise.all([...urls].map((url) => cache.add(url).catch(() => undefined)))
  } catch {
    /* offline during install — runtime caching will fill the gaps later */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit
      return fetch(request)
        .then((response) => {
          // Opaque and error responses are not worth keeping.
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone()
            caches.open(VERSION).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => {
          // Offline and never seen before: a navigation still gets the app.
          if (request.mode === 'navigate') return caches.match('./index.html')
          return Response.error()
        })
    }),
  )
})
