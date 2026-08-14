'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Shield,
  Clock,
  Compass,
  Baby,
  Activity,
  DoorOpen,
  Waves,
  ArrowLeft,
  PhoneCall,
  Info,
  AlertTriangle,
} from 'lucide-react';

export default function CrowdSafetyPage() {
  const t = useTranslations('crowdSafety');
  const locale = useLocale();

  const rules = [
    {
      id: 'waterEdge',
      number: '01',
      icon: Waves,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-100',
      title: t('rules.waterEdge.title'),
      rule: t('rules.waterEdge.rule'),
      reason: t('rules.waterEdge.reason'),
    },
    {
      id: 'diagonal',
      number: '02',
      icon: Compass,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
      title: t('rules.diagonal.title'),
      rule: t('rules.diagonal.rule'),
      reason: t('rules.diagonal.reason'),
    },
    {
      id: 'handsFree',
      number: '03',
      icon: Baby,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      title: t('rules.handsFree.title'),
      rule: t('rules.handsFree.rule'),
      reason: t('rules.handsFree.reason'),
    },
    {
      id: 'fallAction',
      number: '04',
      icon: Activity,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-100',
      title: t('rules.fallAction.title'),
      rule: t('rules.fallAction.rule'),
      reason: t('rules.fallAction.reason'),
    },
    {
      id: 'exitRoutes',
      number: '05',
      icon: DoorOpen,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      title: t('rules.exitRoutes.title'),
      rule: t('rules.exitRoutes.rule'),
      reason: t('rules.exitRoutes.reason'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Back to Emergency Navigation Link */}
      <div>
        <Link
          href={`/${locale}/emergency`}
          prefetch={true}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Emergency Services</span>
        </Link>
      </div>

      {/* Sober, Professional Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 60%, #243E63 100%)' }}
      >
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Shield className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-sm border border-white/15">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('badge')}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium backdrop-blur-sm border border-white/10">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('readTime')}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('title')}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Context Note — Clean and Subtle */}
      <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 flex items-start gap-3">
        <Info className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm leading-relaxed">
          {t('historicalContext')}
        </p>
      </div>

      {/* 5 Core Evergreen Rules — Clean, Scannable Cards */}
      <div className="space-y-3.5">
        {rules.map((item) => {
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border ${item.iconBg} shrink-0 mt-0.5`}>
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Rule {item.number}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="pl-0 sm:pl-[46px] space-y-1.5">
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {item.rule}
                </p>

                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">Context: </span>
                  {item.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Public Safety Disclaimer (Authority Deferral) */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t('disclaimerTitle')}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t('disclaimer')}
        </p>
      </div>

      {/* Emergency Action Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-100/90 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-900">
            {t('emergencyCta')}
          </h3>
          <p className="text-xs text-slate-600">
            Police: <strong className="text-slate-900">112</strong> • Ambulance: <strong className="text-slate-900">108</strong> • Disaster Cell: <strong className="text-slate-900">1077</strong>
          </p>
        </div>

        <Link
          href={`/${locale}/emergency`}
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0 shadow-2xs"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{t('emergencyLink')}</span>
        </Link>
      </div>
    </div>
  );
}
