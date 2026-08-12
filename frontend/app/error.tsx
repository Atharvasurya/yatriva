'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Root Error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-amber-50/50 flex flex-col items-center justify-center min-h-screen p-6 font-sans text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-4">
          <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Application Error</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Yatriva encountered a critical loading error. Please refresh or try again.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
