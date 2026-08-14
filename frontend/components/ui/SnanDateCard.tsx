'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Waves, AlertTriangle } from 'lucide-react';

type SnanKey = 'snan1' | 'snan2' | 'snan3';

interface SnanDateCardProps {
  snanKey: SnanKey;
  isoDate: string;       // "2027-08-02"
  isoEndDate?: string;   // "2027-09-12" for multi-day snans
  verified: boolean;
  index: number;
}

function getCountdown(isoDate: string): {
  value: number;
  unit: 'days' | 'hours' | 'minutes';
  state: 'future' | 'today' | 'passed';
} {
  const now = new Date();
  const target = new Date(`${isoDate}T00:00:00+05:30`); // IST
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return { value: diffDays, unit: 'days', state: 'future' };
  if (diffDays === 1) return { value: 24, unit: 'hours', state: 'future' };
  if (diffMs > 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return { value: diffHours, unit: 'hours', state: 'future' };
    return { value: Math.floor(diffMs / (1000 * 60)), unit: 'minutes', state: 'future' };
  }
  if (Math.abs(diffDays) <= 1) return { value: 0, unit: 'days', state: 'today' };
  return { value: Math.abs(diffDays), unit: 'days', state: 'passed' };
}

const GRADIENT_STYLES = [
  'linear-gradient(135deg, #1B2B4B 0%, #2D5A8E 60%, #3D6B9F 100%)',
  'linear-gradient(135deg, #2D4A7A 0%, #1B2B4B 50%, #0F1E35 100%)',
  'linear-gradient(135deg, #3D2B1B 0%, #6B3D1E 50%, #8B5E2F 100%)',
];

export default function SnanDateCard({
  snanKey,
  isoDate,
  isoEndDate,
  verified,
  index,
}: SnanDateCardProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const countdown = getCountdown(isoDate);

  const label = t(`snanDates.${snanKey}.label`);
  const date = t(`snanDates.${snanKey}.date`);

  return (
    <div
      className={`rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden animate-fade-up delay-${(index + 1) * 100}`}
      style={{ background: GRADIENT_STYLES[index % 3] }}
      role="article"
      aria-label={label}
    >
      {/* Top decorative accent strip */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #E87722 0%, #FBBF24 100%)' }}
        aria-hidden="true"
      />

      <div className="p-5 sm:p-5.5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Icon */}
          <div
            className="shrink-0 flex items-center justify-center rounded-xl h-11 w-11 shadow-inner"
            style={{ background: 'rgba(232,119,34,0.22)', border: '1.5px solid rgba(232,119,34,0.4)' }}
            aria-hidden="true"
          >
            <Waves className="h-5 w-5 text-amber-400" />
          </div>

          {/* Countdown */}
          <div className="shrink-0 text-right">
            <p
              className={`font-black tabular-nums tracking-tight leading-none ${
                countdown.state === 'today'
                  ? 'text-2xl text-amber-300'
                  : countdown.state === 'passed'
                  ? 'text-sm text-white/50'
                  : 'text-2xl text-white'
              }`}
            >
              {countdown.state === 'today'
                ? t('countdown.today')
                : countdown.state === 'passed'
                ? t('countdown.passed')
                : countdown.value.toLocaleString(locale)}
            </p>
            {countdown.state === 'future' && (
              <p className="text-[10px] text-white/70 font-semibold mt-0.5">
                {t(`countdown.${countdown.unit}`)}
              </p>
            )}
          </div>
        </div>

        {/* Title & Date Details */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-0.5">
            {label}
          </p>
          <p className="text-white font-extrabold text-base sm:text-lg leading-snug">
            {date}
          </p>
        </div>

        {/* Verification Status Badge */}
        {!verified && (
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300/40 bg-amber-400/15 text-amber-200 font-semibold text-[10px] leading-tight">
              <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
              <span>{t('snanPlaceholderNote')}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
