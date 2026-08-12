'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Heart, Cpu, Globe, Info } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up text-center sm:text-left"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D5FA8 100%)' }}
      >
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-400" style={{ color: '#E87722' }}>
            {t('subtitle')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">{t('title')}</h1>
          <p className="text-white/80 text-sm max-w-xl leading-relaxed">
            {t('missionText')}
          </p>
        </div>
      </div>

      {/* Grid of Principles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5 space-y-2 animate-fade-up delay-100">
          <div className="p-2.5 rounded-lg bg-orange-50 text-saffron-600 w-fit" style={{ color: '#E87722' }}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-lg text-navy-800" style={{ color: '#1B2B4B' }}>
            {t('dataTitle')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('dataText')}
          </p>
        </div>

        <div className="card p-5 space-y-2 animate-fade-up delay-200">
          <div className="p-2.5 rounded-lg bg-blue-50 text-navy-600 w-fit" style={{ color: '#2D5FA8' }}>
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-lg text-navy-800" style={{ color: '#1B2B4B' }}>
            {t('offlineTitle')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('offlineText')}
          </p>
        </div>
      </div>

      {/* Legal & Governance */}
      <div className="card p-6 space-y-3 border-l-4 border-l-navy-700" style={{ borderLeftColor: '#1B2B4B' }}>
        <h2 className="font-bold text-lg text-navy-800 flex items-center gap-2" style={{ color: '#1B2B4B' }}>
          <Info className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
          {t('legalTitle')}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('legalText')}
        </p>
        <p className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          {tFooter('unofficialNote')}
        </p>
      </div>
    </div>
  );
}
