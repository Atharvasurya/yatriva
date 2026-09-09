'use client';

import { useState, useEffect } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

// Module-level in-memory flag that survives client-side SPA navigation
let hasLoadedWebsite = false;

export default function InitialPageLoader() {
  // Start with visible = false so it NEVER flashes during in-page navigation or SSR
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 1. If already loaded in memory during this browser session, never show
    if (hasLoadedWebsite) {
      return;
    }

    // 2. If already loaded in sessionStorage (e.g. user visited other pages or refreshed), never show
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('yatriva_website_opened')) {
        hasLoadedWebsite = true;
        return;
      }
      sessionStorage.setItem('yatriva_website_opened', '1');
    } catch {
      // ignore
    }

    // Mark as loaded so in-page navigation never triggers it again
    hasLoadedWebsite = true;

    // Only show on the very first initial website opening
    setVisible(true);

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 750);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1050);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-300 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Yatriva"
    >
      <div className="p-6 max-w-sm w-full flex flex-col items-center justify-center">
        <KumbhLoader
          size="fullscreen"
          text="YATRIVA"
          subtext="Nashik Kumbh Mela 2027"
        />
      </div>
    </div>
  );
}
