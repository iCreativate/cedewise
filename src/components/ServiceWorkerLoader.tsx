'use client'

import { useEffect, useLayoutEffect } from 'react'

function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

function clearLocalhostCaches() {
  if (!isLocalHost()) return
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .catch(() => {})
  }
  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .catch(() => {})
  }
}

export default function ServiceWorkerLoader() {
  // Early client cleanup without a beforeInteractive <script> in the RSC layout (avoids hydration mismatches
  // and conflicts with extensions that inject into <head>).
  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== 'production' || isLocalHost()) {
      clearLocalhostCaches()
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || isLocalHost()) {
      return
    }

    if (!('serviceWorker' in navigator)) return

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope:', registration.scope)
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed:', err)
        })
    }

    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return null
}
