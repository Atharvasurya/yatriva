'use client';

import { useTranslations, useLocale } from 'next-intl';
import { AlertTriangle, Shield, HeartPulse, PhoneCall, Info } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '@/data/seed';

export default function EmergencyPage() {
  const t = useTranslations('emergency');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'police':
        return <Shield className="h-6 w-6 text-blue-600" />;
      case 'medical':
        return <HeartPulse className="h-6 w-6 text-red-600" />;
      default:
        return <PhoneCall className="h-6 w-6 text-saffron-600" style={{ color: '#E87722' }} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #991B1B 0%, #B91C1C 40%, #1B2B4B 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <AlertTriangle className="h-8 w-8 sm:h-9 sm:w-9 text-amber-300" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Critical Data Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Info className="h-4 w-4 shrink-0 text-emerald-700" />
          <span>{t('bannerTitle')}</span>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
          {t('bannerText')}
        </p>
      </div>

      {/* Emergency Contact List */}
      <div className="space-y-3">
        {EMERGENCY_CONTACTS.map((contact, index) => {
          const label = locale === 'hi'
            ? contact.labelHi
            : locale === 'mr'
            ? contact.labelMr
            : contact.labelEn;

          return (
            <div
              key={contact.id}
              className={`card p-5 flex items-center justify-between gap-4 animate-fade-up delay-${(index + 1) * 100}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 rounded-xl bg-slate-100 shrink-0">
                  {getCategoryIcon(contact.category)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-base text-navy-800 truncate" style={{ color: '#1B2B4B' }}>
                    {label}
                  </h2>
                  <p className="text-xs text-slate-500 capitalize">
                    {contact.category.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-bold text-xs transition-all hover:bg-red-700 active:scale-95"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{contact.phone}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="placeholder-badge inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>PLACEHOLDER</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Awaiting Official Release</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
