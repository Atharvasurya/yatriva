'use client';

import { useEffect, useState } from 'react';
import KumbhLoader from '@/components/ui/KumbhLoader';

export default function Loading() {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    try {
      const suppressUntil = Number(sessionStorage.getItem('yatriva_suppress_loader_until') || 0);
      if (Date.now() < suppressUntil || (typeof window !== 'undefined' && (window as any).__yatriva_suppress_loader)) {
        setShouldShow(false);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
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
