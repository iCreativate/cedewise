'use client'

import { useEffect } from 'react'

export default function ServiceWorkerLoader() {
  useEffect(() => {
    // Service worker caching breaks Next dev HMR/chunking frequently.
    if (process.env.NODE_ENV !== 'production') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
          .then((regs) => Promise.all(regs.map((r) => r.unregister())))
          .catch(() => {});
      }
      return;
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed:', err);
          });
      });
    }
  }, []);

  return null; // This component doesn't render anything
} 