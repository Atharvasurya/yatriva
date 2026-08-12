'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

/**
 * Global offline indicator banner.
 *
 * - Renders below the header when `navigator.onLine` is false.
 * - Slides away automatically when connectivity returns.
 * - Non-blocking — purely informational.
 */
export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white"
      style={{
        background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
        animation: 'slideDown 300ms ease-out both',
      }}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        You&apos;re offline — cached data is available
        <span className="mx-1.5 opacity-50">|</span>
        <span lang="hi">ऑफ़लाइन — कैश्ड डेटा उपलब्ध</span>
        <span className="mx-1.5 opacity-50">|</span>
        <span lang="mr">ऑफलाइन — कॅश डेटा उपलब्ध</span>
      </span>

      {/* Inline keyframe — avoids global CSS dependency */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
