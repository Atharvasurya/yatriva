'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

/**
 * Returns the current online / offline state of the browser.
 *
 * - SSR-safe: defaults to `true` on the server.
 * - Reacts to `online` / `offline` window events instantly.
 * - Uses `useSyncExternalStore` for tear-free concurrent-mode reads.
 */

function subscribe(callback: () => void): () => void {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  // Assume online during SSR
  return true;
}

export function useNetworkStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { isOnline };
}
