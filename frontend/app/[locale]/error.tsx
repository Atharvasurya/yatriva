'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception to error monitoring service if configured
    console.error('Unhandled Yatriva Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[65dvh] px-6 py-12 text-center">
      <div
        className="flex items-center justify-center rounded-full h-20 w-20 mb-6 border border-red-200 shadow-sm"
        style={{ background: 'rgba(239, 68, 68, 0.1)' }}
        aria-hidden="true"
      >
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>

      <h1 className="text-2xl font-black text-navy-800 mb-2" style={{ color: '#1B2B4B' }}>
        Something Went Wrong
      </h1>
      <p className="text-sm text-slate-600 mb-1">
        कुछ गलत हो गया । कृपया पुनः प्रयास करें।
      </p>
      <p className="text-sm text-slate-600 mb-6">
        काहीतरी चुकीचे घडले. कृपया पुन्हा प्रयत्न करा.
      </p>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-sm mb-8 font-mono break-all text-left">
        <span className="font-bold block mb-1">Diagnostic Detail:</span>
        {error.message || 'An unexpected rendering or network failure occurred.'}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          style={{ background: '#E87722', minHeight: '44px' }}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again / पुनः प्रयास करें</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-navy-800 bg-slate-100 hover:bg-slate-200 transition-all"
          style={{ color: '#1B2B4B', minHeight: '44px' }}
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
