'use client';

import { useState, useEffect } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function InitialPageLoader() {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    try {
      // If user has already opened the website in this session, do not show again for in-page loading
      if (sessionStorage.getItem('yatriva_website_opened')) {
        setLoading(false);
        return;
      }
      sessionStorage.setItem('yatriva_website_opened', '1');
    } catch {
      // ignore
    }

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
