'use client';

import { useEffect } from 'react';

// Em dev o service worker atrapalharia o hot reload, então só registra no build.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch((error) => console.error('Falha ao registrar o service worker', error));
  }, []);

  return null;
}
