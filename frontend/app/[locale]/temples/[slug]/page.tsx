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
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          Temple Not Found
        </h1>
        <Link
          href={`/${locale}/temples`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-colors"
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
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/temples`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToTemples')}
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 animate-fade-up">
        {/* Image Header */}
        {temple.imageUrl && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
            <img
              src={temple.imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider text-white backdrop-blur-md mb-2 shadow-sm"
                style={{ background: 'rgba(194, 88, 26, 0.9)' }}
              >
                <Church className="h-3.5 w-3.5" />
                {temple.deity}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                {name}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Status Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            {!temple.imageUrl && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{ background: '#C2581A' }}
                >
                  <Church className="h-3.5 w-3.5" />
                  {temple.deity}
                </span>
                <h1 className="text-2xl font-black text-slate-900">
                  {name}
                </h1>
              </div>
            )}

            {temple.verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Verified Temple Details
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Timings & Details Await Verification</span>
              </span>
            )}
          </div>

          {/* Timings */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('timingsLabel')}</p>
              {temple.timingsEn ? (
                <p className="text-base font-bold text-slate-800">{temple.timingsEn}</p>
              ) : (
                <span className="text-xs text-amber-700 font-medium italic">Pending official temple trust announcement</span>
              )}
            </div>
          </div>

          {/* Description */}
          {desc && (
            <div className="prose text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
              {desc}
            </div>
          )}

          {/* Tags */}
          {temple.tags && temple.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {temple.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
                >
                  <Tag className="h-3 w-3 text-slate-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Location & Coordinates */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Map Coordinates & Directions</span>
              <a
                href={`https://maps.google.com/?q=${temple.coordinates.lat},${temple.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-700 text-white text-xs font-bold transition-all hover:bg-amber-800 shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-200" />
                Open in Google Maps
              </a>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Latitude: {temple.coordinates.lat}, Longitude: {temple.coordinates.lng}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
