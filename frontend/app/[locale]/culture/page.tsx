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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #4A2E10 0%, #AD4E11 50%, #E87722 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <BookOpen className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">{t('description')}</p>
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
      <div className="grid gap-6 sm:grid-cols-2">
        {CULTURE_TOPICS.map((topic, index) => {
          const title = topic.title[locale] || topic.title.en;
          const subtitle = topic.subtitle[locale] || topic.subtitle.en;
          const snippet = topic.content[locale] || topic.content.en;
          const IconComp = TOPIC_ICONS[topic.icon] || BookOpen;

          return (
            <div
              key={topic.slug}
              className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 animate-fade-up delay-${((index % 4) + 1) * 100}`}
            >
              <Link
                href={`/${locale}/culture/${topic.slug}`}
                prefetch={true}
                className="block flex-1 cursor-pointer"
              >
                {/* Topic Image Banner */}
                {topic.imageUrl ? (
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={topic.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Read Time & Category Icon Floating Badges */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-md">
                        {topic.readTimeMinutes} min read
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/90 text-white backdrop-blur-md shadow-md shrink-0">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-black text-white drop-shadow-md leading-snug">
                        {title}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 pb-0 flex items-center justify-between gap-2">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {topic.readTimeMinutes} min read
                    </span>
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-5 space-y-2">
                  {!topic.imageUrl && (
                    <h2 className="text-xl font-black text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {title}
                    </h2>
                  )}

                  <p className="text-xs font-bold text-amber-700 leading-normal">
                    {subtitle}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                    {snippet}
                  </p>
                </div>
              </Link>

              {/* Card Footer */}
              <div className="p-4 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <Link
                  href={`/${locale}/culture/${topic.slug}`}
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-700 transition-colors"
                >
                  <span>{t('readGuide')}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-600" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
