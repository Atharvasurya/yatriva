'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Waves, MapPin, ExternalLink, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { GHATS } from '@/data/seed';

export default function GhatsPage() {
  const t = useTranslations('ghats');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [filter, setFilter] = useState<'all' | 'priority1'>('all');

  const filteredGhats = filter === 'priority1'
    ? GHATS.filter((g) => g.snanPriority === 1)
    : GHATS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D5FA8 100%)' }}
      >
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Waves className="w-72 h-72 text-white" />
        </div>
        <div className="relative z-10 flex items-start gap-5">
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <Waves className="h-10 w-10 text-amber-300" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Godavari Bathing Sites</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
            filter === 'all'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t('filterAll')} ({GHATS.length})
        </button>
        <button
          onClick={() => setFilter('priority1')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
            filter === 'priority1'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t('filterPrimary')} ({GHATS.filter((g) => g.snanPriority === 1).length})
        </button>
      </div>

      {/* Ghat Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGhats.map((ghat, index) => {
          const name = ghat.name[locale] || ghat.name.en;
          const desc = ghat.description?.[locale] || ghat.description?.en || '';

          return (
            <Link
              key={ghat.id}
              href={`/${locale}/ghats/${ghat.slug}`}
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200/80 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer animate-fade-up delay-${((index % 6) + 1) * 100}`}
            >
              <div>
                {/* Ghat Photography Banner */}
                {ghat.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ghat.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                    
                    {/* Floating Priority Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-white backdrop-blur-md shadow-md"
                        style={{
                          background: ghat.snanPriority === 1 ? 'rgba(232, 119, 34, 0.95)' : 'rgba(45, 95, 168, 0.95)',
                        }}
                      >
                        {ghat.snanPriority === 1 ? 'Amrit Snan (Priority 1)' : `Priority ${ghat.snanPriority}`}
                      </span>

                      {ghat.verified ? (
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
                      style={{
                        background: ghat.snanPriority === 1 ? '#E87722' : '#2D5FA8',
                      }}
                    >
                      Priority {ghat.snanPriority}
                    </span>
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-amber-700 transition-colors">
                    {name}
                  </h2>

                  <p className="text-xs font-semibold mb-3 text-sky-700">
                    {t('riverLabel')}: {ghat.riverName}
                  </p>

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
                  href={`https://maps.google.com/?q=${ghat.coordinates.lat},${ghat.coordinates.lng}`}
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
