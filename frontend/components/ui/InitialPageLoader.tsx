'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function InitialPageLoader() {
  const pathname = usePathname();
  // Start visible so SSR / initial paint instantly presents the full-page loader
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const isFirstMount = useRef(true);
  const activeTimerRef = useRef<{ fade?: NodeJS.Timeout; remove?: NodeJS.Timeout }>({});

  const clearTimers = () => {
    if (activeTimerRef.current.fade) clearTimeout(activeTimerRef.current.fade);
    if (activeTimerRef.current.remove) clearTimeout(activeTimerRef.current.remove);
    activeTimerRef.current = {};
  };

  const triggerLoader = (holdMs: number, fadeMs: number) => {
    clearTimers();
    setVisible(true);
    setFadingOut(false);

    activeTimerRef.current.fade = setTimeout(() => {
      setFadingOut(true);
    }, holdMs);

    activeTimerRef.current.remove = setTimeout(() => {
      setVisible(false);
      setFadingOut(false);
    }, holdMs + fadeMs);
  };

  // Trigger on initial page load / refresh
  useEffect(() => {
    triggerLoader(700, 300);
    return () => clearTimers();
  }, []);

  // Trigger on client-side route changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    triggerLoader(450, 250);
    return () => clearTimers();
  }, [pathname]);

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
