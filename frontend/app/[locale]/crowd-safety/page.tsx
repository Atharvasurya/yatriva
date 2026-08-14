'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Compass,
  Baby,
  Activity,
  DoorOpen,
  Waves,
  ArrowLeft,
  PhoneCall,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function CrowdSafetyPage() {
  const t = useTranslations('crowdSafety');
  const locale = useLocale();

  const rules = [
    {
      id: 'waterEdge',
      icon: Waves,
      color: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeColor: 'bg-rose-600 text-white',
      badge: t('rules.waterEdge.tag'),
      title: t('rules.waterEdge.title'),
      rule: t('rules.waterEdge.rule'),
      reason: t('rules.waterEdge.reason'),
    },
    {
      id: 'diagonal',
      icon: Compass,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeColor: 'bg-amber-600 text-white',
      badge: t('rules.diagonal.tag'),
      title: t('rules.diagonal.title'),
      rule: t('rules.diagonal.rule'),
      reason: t('rules.diagonal.reason'),
    },
    {
      id: 'handsFree',
      icon: Baby,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      badgeColor: 'bg-indigo-600 text-white',
      badge: t('rules.handsFree.tag'),
      title: t('rules.handsFree.title'),
      rule: t('rules.handsFree.rule'),
      reason: t('rules.handsFree.reason'),
    },
    {
      id: 'fallAction',
      icon: Activity,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      badgeColor: 'bg-orange-600 text-white',
      badge: t('rules.fallAction.tag'),
      title: t('rules.fallAction.title'),
      rule: t('rules.fallAction.rule'),
      reason: t('rules.fallAction.reason'),
    },
    {
      id: 'exitRoutes',
      icon: DoorOpen,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      badgeColor: 'bg-emerald-600 text-white',
      badge: t('rules.exitRoutes.tag'),
      title: t('rules.exitRoutes.title'),
      rule: t('rules.exitRoutes.rule'),
      reason: t('rules.exitRoutes.reason'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-up">
      {/* Back to Emergency Navigation Link */}
      <div>
        <Link
          href={`/${locale}/emergency`}
          prefetch={true}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-amber-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Emergency Services</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl space-y-3"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #7F1D1D 50%, #991B1B 100%)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-rose-400/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('badge')}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('readTime')}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          {t('title')}
        </h1>

        <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {t('subtitle')}
        </p>
      </div>

      {/* Historical Context Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-2xs flex items-start gap-3.5">
        <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
          {t('historicalContext')}
        </p>
      </div>

      {/* 5 Core Evergreen Rules Cards Grid */}
      <div className="space-y-4">
        {rules.map((ruleItem, index) => {
          const IconComponent = ruleItem.icon;

          return (
            <div
              key={ruleItem.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 sm:p-3 rounded-2xl ${ruleItem.color} border shrink-0`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Rule #{index + 1}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {ruleItem.title}
                    </h2>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${ruleItem.badgeColor}`}>
                  {ruleItem.badge}
                </span>
              </div>

              {/* Bold Rule Statement */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {ruleItem.rule}
                  </p>
                </div>
              </div>

              {/* Reason Explanation */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                <span className="font-bold text-slate-800">Why this matters: </span>
                {ruleItem.reason}
              </p>
            </div>
          );
        })}
      </div>

      {/* Official Public Safety Disclaimer (Authority Deferral) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4" />
          <span>{t('disclaimerTitle')}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t('disclaimer')}
        </p>
      </div>

      {/* Emergency Action Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-900">
            {t('emergencyCta')}
          </h3>
          <p className="text-xs text-red-700">
            Police: 112 • Ambulance: 108 • Disaster Cell: 1077
          </p>
        </div>

        <Link
          href={`/${locale}/emergency`}
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{t('emergencyLink')}</span>
        </Link>
      </div>
    </div>
  );
}
