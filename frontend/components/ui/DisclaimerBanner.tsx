'use client';

import { useTranslations } from 'next-intl';
import { X, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'yatriva-disclaimer-dismissed';

export default function DisclaimerBanner() {
  const t = useTranslations('disclaimer');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Re-show each session; dismiss is only for this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="relative z-50 flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2.5"
    >
      <AlertTriangle
        className="h-4 w-4 shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <p className="flex-1 text-xs font-medium text-amber-800 leading-snug">
        {t('text')}
      </p>
      <button
        onClick={dismiss}
        aria-label={t('close')}
        className="shrink-0 rounded-full p-2 text-amber-600 hover:bg-amber-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
