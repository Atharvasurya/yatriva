'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Waves, Bus, ParkingCircle, AlertTriangle, Info, Map, Globe, Check, BookOpen, ChevronRight, Sparkles, ShieldAlert, Accessibility, LifeBuoy, Navigation, Sun, Smartphone, UserX, BedDouble
} from 'lucide-react';
import TempleIcon from '@/components/ui/TempleIcon';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function MorePage() {
  const t = useTranslations('more');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const LINKS = [
    { key: 'assistant', href: '/assistant', Icon: Sparkles, color: 'bg-purple-50 text-indigo-600' },
    { key: 'safetyPass', href: '/safety-pass', Icon: Smartphone, color: 'bg-amber-50 text-amber-700' },
    { key: 'lostAndFound', href: '/lost-and-found', Icon: UserX, color: 'bg-red-50 text-red-700' },
    { key: 'accessibility', href: '/accessibility', Icon: Accessibility, color: 'bg-indigo-50 text-indigo-600' },
    { key: 'stayAndEat', href: '/stay-and-eat', Icon: BedDouble, color: 'bg-amber-50 text-amber-800' },
    { key: 'waterSafety', href: '/water-safety', Icon: LifeBuoy, color: 'bg-blue-50 text-blue-600' },
    { key: 'crowdSafety', href: '/crowd-safety', Icon: ShieldAlert, color: 'bg-red-50 text-red-700' },
    { key: 'trafficAdvisory', href: '/traffic-advisory', Icon: Navigation, color: 'bg-amber-50 text-amber-700' },
    { key: 'weatherHealth', href: '/weather-health', Icon: Sun, color: 'bg-orange-50 text-orange-600' },
    { key: 'ghats', href: '/ghats', Icon: Waves, color: 'bg-blue-50 text-blue-600' },
    { key: 'temples', href: '/temples', Icon: TempleIcon, color: 'bg-orange-50 text-saffron-600' },
    { key: 'culture', href: '/culture', Icon: BookOpen, color: 'bg-amber-50 text-amber-700' },
    { key: 'transport', href: '/transport', Icon: Bus, color: 'bg-navy-50 text-navy-700' },
    { key: 'parking', href: '/parking', Icon: ParkingCircle, color: 'bg-amber-50 text-amber-600' },
    { key: 'emergency', href: '/emergency', Icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
    { key: 'map', href: '/map', Icon: Map, color: 'bg-emerald-50 text-emerald-600' },
    { key: 'about', href: '/about', Icon: Info, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-black text-navy-800" style={{ color: '#1B2B4B' }}>
        {t('title')}
      </h1>

      {/* Language Switcher Section */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 text-navy-800 font-bold text-sm" style={{ color: '#1B2B4B' }}>
          <Globe className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
          <span>{t('selectLanguage')}</span>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Links Directory */}
      <div className="card divide-y divide-slate-100 overflow-hidden">
        {LINKS.map(({ key, href, Icon, color }) => (
          <Link
            key={key}
            href={`/${locale}${href}`}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm text-navy-800" style={{ color: '#1B2B4B' }}>
                {tNav(key as Parameters<typeof tNav>[0])}
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        ))}
      </div>

      {/* Offline Status Card */}
      <div className="p-4 rounded-xl bg-navy-700 text-white flex items-center gap-3" style={{ background: '#1B2B4B' }}>
        <Check className="h-5 w-5 text-green-400 shrink-0" />
        <div>
          <p className="font-bold text-xs">{t('offlineGuide')}</p>
          <p className="text-[11px] text-white/70">PWA Cache active — guide works offline.</p>
        </div>
      </div>
    </div>
  );
}
