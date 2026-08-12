'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Waves, MapPin, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GHATS } from '@/data/seed';

export default function GhatsPage() {
  const t = useTranslations('ghats');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [filter, setFilter] = useState<'all' | 'priority1'>('all');

  const filteredGhats = filter === 'priority1'
    ? GHATS.filter((g) => g.snanPriority === 1)
    : GHATS;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D5FA8 100%)' }}
      >
        <div
          className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,119,34,0.3) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <Waves className="h-8 w-8 text-saffron-500" style={{ color: '#E87722' }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
            <p className="text-white/80 text-sm mt-1 max-w-xl">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] ${
            filter === 'all'
              ? 'bg-navy-700 text-white shadow-sm'
              : 'bg-white text-navy-700 hover:bg-navy-50 border border-slate-200'
          }`}
          style={filter === 'all' ? { background: '#1B2B4B' } : {}}
        >
          {t('filterAll')} ({GHATS.length})
        </button>
        <button
          onClick={() => setFilter('priority1')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] ${
            filter === 'priority1'
              ? 'bg-navy-700 text-white shadow-sm'
              : 'bg-white text-navy-700 hover:bg-navy-50 border border-slate-200'
          }`}
          style={filter === 'priority1' ? { background: '#1B2B4B' } : {}}
        >
          {t('filterPrimary')} ({GHATS.filter((g) => g.snanPriority === 1).length})
        </button>
      </div>

      {/* Ghat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredGhats.map((ghat, index) => {
          const name = ghat.name[locale] || ghat.name.en;
          const desc = ghat.description?.[locale] || ghat.description?.en || '';

          return (
            <div
              key={ghat.id}
              className={`card p-5 flex flex-col justify-between animate-fade-up delay-${(index + 1) * 100} hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                    style={{
                      background: ghat.snanPriority === 1 ? '#E87722' : '#2D5FA8',
                    }}
                  >
                    Priority {ghat.snanPriority}
                  </span>

                  {!ghat.verified && (
                    <span className="placeholder-badge inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>{t('unverifiedNotice').split('.')[0]}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-navy-800 mb-1" style={{ color: '#1B2B4B' }}>
                  {name}
                </h2>

                <p className="text-xs font-semibold mb-3" style={{ color: '#5B9BD5' }}>
                  {t('riverLabel')}: {ghat.riverName}
                </p>

                {desc && (
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {desc}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                <Link
                  href={`/${locale}/ghats/${ghat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-saffron-600 transition-colors"
                  style={{ color: '#1B2B4B' }}
                >
                  <span>{t('viewDetails')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={`https://maps.google.com/?q=${ghat.coordinates.lat},${ghat.coordinates.lng}`}
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
