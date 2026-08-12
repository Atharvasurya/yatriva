'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Church, MapPin, ExternalLink, Tag, AlertTriangle } from 'lucide-react';
import { TEMPLES } from '@/data/seed';

export default function TemplesPage() {
  const t = useTranslations('temples');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #3D2B1B 0%, #E87722 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <Church className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
            <p className="text-white/90 text-sm mt-1 max-w-xl">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Temple Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {TEMPLES.map((temple, index) => {
          const name = temple.name[locale] || temple.name.en;
          const desc = temple.description?.[locale] || temple.description?.en || '';

          return (
            <div
              key={temple.id}
              className={`card p-5 flex flex-col justify-between animate-fade-up delay-${(index + 1) * 100} hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                    style={{ background: '#C2581A' }}
                  >
                    {temple.deity}
                  </span>

                  {!temple.verified && (
                    <span className="placeholder-badge inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>{t('unverifiedNotice').split('.')[0]}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-navy-800 mb-2" style={{ color: '#1B2B4B' }}>
                  {name}
                </h2>

                {/* Timings */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-500 mr-2">{t('timingsLabel')}:</span>
                  {temple.timingsEn ? (
                    <span className="text-xs font-bold text-slate-700">{temple.timingsEn}</span>
                  ) : (
                    <span className="placeholder-badge">PLACEHOLDER — Unverified</span>
                  )}
                </div>

                {desc && (
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {desc}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                <Link
                  href={`/${locale}/temples/${temple.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-saffron-600 transition-colors"
                  style={{ color: '#1B2B4B' }}
                >
                  <span>{t('viewDetails')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={`https://maps.google.com/?q=${temple.coordinates.lat},${temple.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
