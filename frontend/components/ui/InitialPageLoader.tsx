'use client';

import { useState, useEffect } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function InitialPageLoader() {
  const [loading, setLoading] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    try {
      // Check if language switch is in progress
      const suppressUntil = Number(sessionStorage.getItem('yatriva_suppress_loader_until') || 0);
      if (Date.now() < suppressUntil || (typeof window !== 'undefined' && (window as any).__yatriva_suppress_loader)) {
        return;
      }

      // Check if already shown in this session
      const alreadyShown = sessionStorage.getItem('yatriva_initial_loader_shown');
      if (alreadyShown === 'true') {
        return;
      }
      sessionStorage.setItem('yatriva_initial_loader_shown', 'true');
    } catch {
      // ignore storage errors
    }

    setLoading(true);

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 750);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-300 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Yatriva"
    >
      <div className="p-6 max-w-sm w-full">
        <KumbhLoader
          size="fullscreen"
          text="YATRIVA"
          subtext="Nashik Kumbh Mela 2027"
        />
      </div>
    </div>
  );
}
