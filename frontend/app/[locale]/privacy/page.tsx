'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  ShieldCheck,
  Lock,
  Database,
  MapPin,
  Sparkles,
  EyeOff,
  Trash2,
  HelpCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function PrivacyPage() {
  const t = useTranslations('privacy');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('yatriva_registered_groups');
        localStorage.removeItem('yatriva_user_preset');
        sessionStorage.removeItem('yatriva_session_id');
        setCleared(true);
        setTimeout(() => setCleared(false), 4000);
      } catch (err) {
        console.error('Failed to clear storage:', err);
      }
    }
  };

  const PILLARS = [
    {
      icon: Database,
      titleKey: 'localStorageTitle',
      descKey: 'localStorageDesc',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: MapPin,
      titleKey: 'locationTitle',
      descKey: 'locationDesc',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      icon: ShieldCheck,
      titleKey: 'familySafetyTitle',
      descKey: 'familySafetyDesc',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: Sparkles,
      titleKey: 'aiPrivacyTitle',
      descKey: 'aiPrivacyDesc',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      icon: EyeOff,
      titleKey: 'noAdsTitle',
      descKey: 'noAdsDesc',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      icon: Trash2,
      titleKey: 'retentionTitle',
      descKey: 'retentionDesc',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fade-up">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl space-y-4"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D4A7A 100%)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('badge')}</span>
          </div>
          <span className="text-xs text-white/60 font-medium">
            {t('lastUpdated')}
          </span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 font-medium">
            {t('subtitle')}
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {/* ── Core Privacy Principles Grid ────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className={`p-3 rounded-xl w-fit border ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  {t(pillar.titleKey as any)}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(pillar.descKey as any)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Instant Data Purge Utility Card ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Right to Erasure & Local Cache Reset</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Want to purge your saved group registrations, language cache, and recent search state from this device? Click below to immediately erase all local browser data.
            </p>
          </div>

          <button
            onClick={handleClearData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all border border-slate-200 hover:border-rose-200 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge My Local Data</span>
          </button>
        </div>

        {cleared && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All Yatriva local browser data has been successfully cleared from this device.</span>
          </div>
        )}
      </div>

      {/* ── Questions & Maintainer Contact ──────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 text-slate-900 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-900 shrink-0">
            <HelpCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-xs sm:text-sm text-amber-950">
              {t('contactPrompt')}
            </p>
            <p className="text-xs text-amber-900/80 font-medium">
              atharvasuryawanshi@gmail.com & khushalkulkarni@gmail.com
            </p>
          </div>
        </div>

        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all hover:brightness-110 shrink-0"
          style={{ background: '#1B2B4B' }}
        >
          <span>Contact Team</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Unofficial Disclaimer ───────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>{tFooter('unofficialNote')}</p>
      </div>
    </div>
  );
}
