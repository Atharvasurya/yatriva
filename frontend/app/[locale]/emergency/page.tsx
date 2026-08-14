'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { AlertTriangle, Shield, HeartPulse, PhoneCall, Info, ShieldAlert, ChevronRight, ArrowLeft } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Back to Home Navigation */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 border border-slate-200/90 hover:border-amber-300 text-xs font-bold shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:scale-95 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 text-amber-700 transition-transform group-hover:-translate-x-0.5" />
        <span>
          {locale === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : locale === 'mr' ? 'मुख्य पृष्ठावर परत जा' : 'Back to Home'}
        </span>
      </Link>

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

      {/* ── Ground Safety & Emergency Action Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offline Safety Pass */}
        <Link
          href={`/${locale}/safety-pass`}
          prefetch={true}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                100% Offline Ready
              </span>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Offline Pilgrim Safety Pass
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate an emergency contact lockscreen pass to keep your family phone numbers visible even without network signal.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 group-hover:underline self-end">
            <span>Generate Pass →</span>
          </div>
        </Link>

        {/* Lost & Found Registry */}
        <Link
          href={`/${locale}/lost-and-found`}
          prefetch={true}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 shrink-0">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-0.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                Digital Khoya-Paya
              </span>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                Lost & Found Registry
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Search missing family members or register separated individuals with local police assistance booths.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 group-hover:underline self-end">
            <span>Open Registry →</span>
          </div>
        </Link>
      </div>

      {/* ── Crowd-Crush & Surge Safety Card ── */}
      <Link
        href={`/${locale}/crowd-safety`}
        prefetch={true}
        className="block p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  Pilgrim Safety Guide
                </span>
                <span className="text-xs text-slate-400">30-sec read</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Crowd-Crush & Surge Safety Rules
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                5 evergreen rules on how to move during sudden ghat surges, protect children, and avoid dangerous water-edge trampling.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 shadow-2xs self-start sm:self-center">
            <span>Read Rules</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

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
