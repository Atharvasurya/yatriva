'use client';

import { useState, useEffect } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function InitialPageLoader() {
  const [loading, setLoading] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Only run on the very first initial website entrance, never on language switch or navigation
    try {
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
    }, 700);

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
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-300 ease-out ${
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
