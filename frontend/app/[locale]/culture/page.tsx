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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #4A2E10 0%, #E87722 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
            <p className="text-white/90 text-sm mt-1 max-w-xl">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Credibility Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3">
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
