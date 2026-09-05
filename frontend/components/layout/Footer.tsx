'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShieldAlert, Users, Activity } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [activePilgrims, setActivePilgrims] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevTotalRef = useRef<number | null>(null);
  const registeredRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    // 1. Generate or retrieve session ID for genuine tracking
    let sessionId = '';
    let isNewSession = false;
    try {
      const storedSid = sessionStorage.getItem('yatriva_session_id');
      if (storedSid) {
        sessionId = storedSid;
      } else {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('yatriva_session_id', sessionId);
        isNewSession = true;
      }
    } catch {
      sessionId = `anon_${Date.now()}`;
      isNewSession = true;
    }

    let isMounted = true;
    const abortController = new AbortController();

    // 2. Ping the server to record this visitor
    const sendPing = async (newSessionFlag: boolean) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }

      try {
        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, isNewSession: newSessionFlag }),
          signal: abortController.signal,
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          handleDataUpdate(data);
        }
      } catch {
        // Silently swallow fetch errors (e.g., dev server recompilation, offline, or abort)
        // to prevent Next.js dev overlay from displaying "Console TypeError: Failed to fetch"
      }
    };

    const handleDataUpdate = (data: { totalVisitors?: number; activePilgrims?: number }) => {
      if (!isMounted) return;
      if (typeof data.totalVisitors === 'number') {
        if (prevTotalRef.current !== null && data.totalVisitors > prevTotalRef.current) {
          // Highlight update
          setIsUpdating(true);
          setTimeout(() => {
            if (isMounted) setIsUpdating(false);
          }, 1200);
        }
        prevTotalRef.current = data.totalVisitors;
        setTotalVisitors(data.totalVisitors);
      }
      if (typeof data.activePilgrims === 'number') {
        setActivePilgrims(data.activePilgrims);
      }
    };

    if (!registeredRef.current) {
      registeredRef.current = true;
      sendPing(isNewSession);
    }

    // 3. Periodic lightweight heartbeat (every 30 seconds)
    const interval = setInterval(() => {
      sendPing(false);
    }, 30000);

    return () => {
      isMounted = false;
      abortController.abort();
      clearInterval(interval);
    };
  }, []);

  const formattedVisitors = mounted && totalVisitors !== null
    ? totalVisitors.toLocaleString(locale)
    : '1';

  const formattedActive = mounted && activePilgrims !== null
    ? activePilgrims.toLocaleString(locale)
    : '1';

  return (
    <footer
      className="mt-auto border-t text-white"
      style={{
        background: '#0F1E35',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-36 sm:pb-14 space-y-8">
        
        {/* Real Live Visitors Counter Bar */}
        <div
          className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 border shadow-xl transition-all duration-300"
          style={{
            background: isUpdating
              ? 'linear-gradient(135deg, rgba(232, 119, 34, 0.25) 0%, rgba(15, 30, 53, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(27, 43, 75, 0.7) 0%, rgba(15, 30, 53, 0.9) 100%)',
            borderColor: isUpdating ? '#E87722' : 'rgba(232, 119, 34, 0.25)',
          }}
        >
          {/* Total Real Visitors */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 ${
                isUpdating ? 'scale-110' : ''
              }`}
              style={{ background: 'rgba(232, 119, 34, 0.2)', border: '1.5px solid rgba(232, 119, 34, 0.4)' }}
            >
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {t('pilgrimsGuided')}
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl sm:text-2xl font-black tracking-tight text-white tabular-nums transition-colors duration-300 ${
                    isUpdating ? 'text-amber-300 scale-105' : ''
                  }`}
                >
                  {formattedVisitors}
                </span>
                <span className="text-[11px] text-white/50 font-medium">
                  {t('visitorsLabel')}
                </span>
              </div>
            </div>
          </div>

          {/* Real Live Online Active Users */}
          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border shrink-0"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-200 tabular-nums">
              {formattedActive} {t('liveOnline')}
            </span>
          </div>
        </div>

        {/* Unofficial notice */}
        <div
          className="flex items-start gap-3.5 rounded-2xl p-5 sm:p-6"
          style={{ background: 'rgba(232,119,34,0.10)', border: '1px solid rgba(232,119,34,0.22)' }}
        >
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {t('unofficialNote')}
          </p>
        </div>

        {/* Links row */}
        <nav
          className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2"
          aria-label="Footer links"
        >
          {(['about', 'privacy', 'contact'] as const).map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="text-sm font-semibold text-white/60 hover:text-white transition-colors min-h-[44px] inline-flex items-center"
            >
              {t(`links.${key}`)}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-xs text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white/50 font-medium">
            <span>{t('copyright')}</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-1">
              <span>Created by</span>
              <Link
                href={`/${locale}/about`}
                className="text-amber-400 hover:text-amber-300 hover:underline font-semibold"
              >
                Atharva Suryawanshi
              </Link>
            </span>
          </div>
          <p className="text-amber-400/90 font-bold tracking-wide">
            Simhastha Kumbh Mela 2027 • Nashik
          </p>
        </div>
      </div>
    </footer>
  );
}
