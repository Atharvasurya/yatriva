'use client';

import { useState, useEffect, useRef } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function InitialPageLoader() {
  // Start visible so SSR / initial paint instantly presents the full-page loader
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const activeTimerRef = useRef<{ fade?: NodeJS.Timeout; remove?: NodeJS.Timeout }>({});

  const clearTimers = () => {
    if (activeTimerRef.current.fade) clearTimeout(activeTimerRef.current.fade);
    if (activeTimerRef.current.remove) clearTimeout(activeTimerRef.current.remove);
    activeTimerRef.current = {};
  };

  // Only trigger on opening or refreshing the website (component initial mount)
  useEffect(() => {
    clearTimers();
    setVisible(true);
    setFadingOut(false);

    activeTimerRef.current.fade = setTimeout(() => {
      setFadingOut(true);
    }, 700);

    activeTimerRef.current.remove = setTimeout(() => {
      setVisible(false);
      setFadingOut(false);
    }, 1000);

    return () => clearTimers();
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-white transition-opacity duration-300 ease-out ${
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
