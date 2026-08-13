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

  const countdownText =
    countdown.state === 'today'
      ? t('countdown.today')
      : countdown.state === 'passed'
      ? t('countdown.passed')
      : `${countdown.value.toLocaleString(locale)} ${t(`countdown.${countdown.unit}`)}`;

  return (
    <div
      className={`card animate-fade-up hover-lift cursor-pointer transition-all duration-300 transform hover:scale-[1.02] delay-${(index + 1) * 100}`}
      style={{ background: GRADIENT_STYLES[index % 3], overflow: 'visible' }}
      role="article"
      aria-label={label}
    >
      {/* Top decorative strip — clipped independently so card badge is not affected */}
      <div
        className="h-1 w-full rounded-t-[var(--radius-card)]"
        style={{ background: '#E87722' }}
        aria-hidden="true"
      />

      <div className="px-5 py-4 flex items-center gap-4">
        {/* Icon */}
        <div
          className="shrink-0 flex items-center justify-center rounded-full h-12 w-12"
          style={{ background: 'rgba(232,119,34,0.18)', border: '1.5px solid rgba(232,119,34,0.35)' }}
          aria-hidden="true"
        >
          <Waves className="h-6 w-6" style={{ color: '#E87722' }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#E87722' }}>
            {label}
          </p>
          <p className="text-white font-bold text-base leading-tight">
            {date}
          </p>
        </div>

        {/* Countdown */}
        <div className="shrink-0 text-right">
          <p
            className={`font-black tabular-nums leading-none ${
              countdown.state === 'today'
                ? 'text-2xl'
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
            <p className="text-[10px] text-white/60 font-medium mt-0.5">
              {t(`countdown.${countdown.unit}`)}
            </p>
          )}
        </div>
      </div>

      {/* Placeholder badge */}
      {!verified && (
        <div className="px-5 pb-4">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-bold"
            style={{ fontSize: '0.6rem', letterSpacing: '0.03em', flexWrap: 'wrap', lineHeight: 1.4 }}
          >
            <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
            <span style={{ whiteSpace: 'normal' }}>{t('snanPlaceholderNote')}</span>
          </span>
        </div>
      )}
    </div>
  );
}
