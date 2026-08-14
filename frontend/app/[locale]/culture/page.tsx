'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, ArrowRight, Compass, ShieldCheck, Waves, Landmark, Flag } from 'lucide-react';
import { CULTURE_TOPICS } from '@/data/cultureData';

const TOPIC_ICONS: Record<string, typeof Waves> = {
  Waves,
  Landmark,
  Flag,
};

export default function CulturePage() {
  const t = useTranslations('culture');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 sm:space-y-12">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #4A2E10 0%, #AD4E11 50%, #E87722 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-5">
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Credibility Notice */}
      <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0" />
          <span className="text-xs font-bold text-amber-900">
            Authoritative Spiritual & Historical Research for Kumbh Pilgrims
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
          {CULTURE_TOPICS.length} Articles
        </span>
      </div>

      {/* Topics Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CULTURE_TOPICS.map((topic, index) => {
          const title = topic.title[locale] || topic.title.en;
          const subtitle = topic.subtitle[locale] || topic.subtitle.en;
          const snippet = topic.content[locale] || topic.content.en;
          const IconComp = TOPIC_ICONS[topic.icon] || BookOpen;

          return (
            <div
              key={topic.slug}
              className={`card p-5 flex flex-col justify-between animate-fade-up delay-${(index + 1) * 100} hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-saffron-50 text-saffron-600" style={{ color: '#E87722', background: 'rgba(232,119,34,0.1)' }}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {topic.readTimeMinutes} min read
                  </span>
                </div>

                <h2 className="text-xl font-black text-navy-800 mb-1" style={{ color: '#1B2B4B' }}>
                  {title}
                </h2>

                <p className="text-xs font-bold text-saffron-600 mb-3" style={{ color: '#E87722' }}>
                  {subtitle}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {snippet}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/${locale}/culture/${topic.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-saffron-600 transition-colors"
                  style={{ color: '#1B2B4B' }}
                >
                  <span>{t('readGuide')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
