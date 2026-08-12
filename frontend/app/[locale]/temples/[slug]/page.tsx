'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Church, MapPin, ArrowLeft, ShieldCheck, Tag, Clock, AlertTriangle } from 'lucide-react';
import { TEMPLES } from '@/data/seed';

export default function TempleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const t = useTranslations('temples');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const temple = TEMPLES.find((t) => t.slug === slug);

  if (!temple) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#1B2B4B' }}>
          Temple Not Found
        </h1>
        <Link
          href={`/${locale}/temples`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-700 text-white text-sm font-bold"
          style={{ background: '#1B2B4B' }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToTemples')}
        </Link>
      </div>
    );
  }

  const name = temple.name[locale] || temple.name.en;
  const desc = temple.description?.[locale] || temple.description?.en || '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/temples`}
        className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 hover:text-saffron-600 transition-colors"
        style={{ color: '#1B2B4B' }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToTemples')}
      </Link>

      {/* Main Card */}
      <div className="card overflow-hidden p-6 space-y-5 animate-fade-up">
        {/* Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
            style={{ background: '#C2581A' }}
          >
            <Church className="h-3.5 w-3.5" />
            {temple.deity}
          </span>

          {!temple.verified ? (
            <span className="placeholder-badge inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span>PLACEHOLDER — Unverified Timings & Info</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="text-3xl font-black" style={{ color: '#1B2B4B' }}>
          {name}
        </h1>

        {/* Timings */}
        <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center gap-3">
          <Clock className="h-5 w-5 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
          <div>
            <p className="text-xs font-bold text-slate-700">{t('timingsLabel')}</p>
            {temple.timingsEn ? (
              <p className="text-sm font-semibold text-slate-800">{temple.timingsEn}</p>
            ) : (
              <span className="placeholder-badge mt-0.5">PLACEHOLDER — Pending Temple Trust Confirmation</span>
            )}
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div className="prose text-slate-700 text-sm leading-relaxed border-t border-slate-100 pt-4">
            {desc}
          </div>
        )}

        {/* Tags */}
        {temple.tags && temple.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {temple.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Location & Coordinates */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Map Coordinates</span>
            <a
              href={`https://maps.google.com/?q=${temple.coordinates.lat},${temple.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 text-white text-xs font-bold transition-all hover:bg-navy-800"
              style={{ background: '#1B2B4B' }}
            >
              <MapPin className="h-3.5 w-3.5 text-saffron-400" />
              Open in Google Maps
            </a>
          </div>
          <p className="text-xs font-mono text-slate-500">
            Lat: {temple.coordinates.lat}, Lng: {temple.coordinates.lng}
          </p>
          {!temple.verified && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              {t('unverifiedNotice')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
