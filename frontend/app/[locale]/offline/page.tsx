'use client';

import { useTranslations } from 'next-intl';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const t = useTranslations('offline');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 py-12 text-center">
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-full h-20 w-20 mb-6"
        style={{ background: 'rgba(27,43,75,0.08)' }}
        aria-hidden="true"
      >
        <WifiOff className="h-10 w-10" style={{ color: '#1B2B4B' }} />
      </div>

      <h1 className="text-2xl font-black mb-3" style={{ color: '#1B2B4B' }}>
        {t('title')}
      </h1>

      <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#5a5a5a' }}>
        {t('description')}
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
        style={{ background: '#E87722', minHeight: '44px' }}
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {t('retry')}
      </button>
    </div>
  );
}
