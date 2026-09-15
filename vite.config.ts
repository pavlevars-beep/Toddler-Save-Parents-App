import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the same build works from a web host, a file:// bundle,
  // or inside a native WebView (Capacitor / Cordova).
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 8192,
  },
  server: {
    host: true,
  },
})
