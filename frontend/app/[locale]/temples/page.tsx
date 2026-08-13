'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Church, MapPin, ExternalLink, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { TEMPLES } from '@/data/seed';

export default function TemplesPage() {
  const t = useTranslations('temples');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #2D1B0E 0%, #C2581A 50%, #E87722 100%)' }}
      >
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Church className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <Church className="h-8 w-8 sm:h-9 sm:w-9 text-amber-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nashik Sacred Heritage</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Temple Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLES.map((temple) => {
          const name = temple.name[locale] || temple.name.en;
          const desc = temple.description?.[locale] || temple.description?.en || '';

          return (
            <Link
              key={temple.id}
              href={`/${locale}/temples/${temple.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Temple Image Banner */}
                {temple.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={temple.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Floating Deity Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-white backdrop-blur-md shadow-md"
                        style={{ background: 'rgba(194, 88, 26, 0.9)' }}
                      >
                        {temple.deity}
                      </span>

                      {temple.verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                      style={{ background: '#C2581A' }}
                    >
                      {temple.deity}
                    </span>

                    {temple.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                    {name}
                  </h2>

                  {/* Timings */}
                  <div className="flex items-center gap-1.5 text-xs mb-3 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-500">{t('timingsLabel')}:</span>
                    {temple.timingsEn ? (
                      <span className="font-bold text-slate-800">{temple.timingsEn}</span>
                    ) : (
                      <span className="text-amber-700 font-medium italic">Timings Await Verification</span>
                    )}
                  </div>

                  {/* Description */}
                  {desc && (
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 group-hover:text-amber-600 transition-colors">
                  <span>{t('viewDetails')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>

                <a
                  href={`https://maps.google.com/?q=${temple.coordinates.lat},${temple.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>Map</span>
                </a>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
