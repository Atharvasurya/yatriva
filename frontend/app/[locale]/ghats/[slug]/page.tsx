'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Waves, MapPin, ArrowLeft, AlertTriangle, ShieldCheck, Tag, BookOpen, Flame, Star, CheckCircle2 } from 'lucide-react';
import { GHATS } from '@/data/seed';
import AiAudioReader from '@/components/ui/AiAudioReader';
import TempleVideoPlayer from '@/components/ui/TempleVideoPlayer';

export default function GhatDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const t = useTranslations('ghats');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const ghat = GHATS.find((g) => g.slug === slug);

  if (!ghat) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          Ghat Not Found
        </h1>
        <Link
          href={`/${locale}/ghats`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToGhats')}
        </Link>
      </div>
    );
  }

  const name = ghat.name[locale] || ghat.name.en;
  const desc = ghat.description?.[locale] || ghat.description?.en || '';
  const historyText = ghat.history?.[locale] || ghat.history?.en || '';
  const importanceText = ghat.importance?.[locale] || ghat.importance?.en || '';
  const highlightsText = ghat.highlights?.[locale] || ghat.highlights?.en || '';

  // Prepare combined text for AI Audio Reader
  const textToRead = {
    en: `${name}. ${ghat.description?.en || ''}. History: ${ghat.history?.en || ''}. Spiritual Importance: ${ghat.importance?.en || ''}. Highlights: ${ghat.highlights?.en || ''}`,
    hi: `${ghat.name.hi}. ${ghat.description?.hi || ''}. इतिहास: ${ghat.history?.hi || ''}. धार्मिक महत्व: ${ghat.importance?.hi || ''}. मुख्य आकर्षण: ${ghat.highlights?.hi || ''}`,
    mr: `${ghat.name.mr}. ${ghat.description?.mr || ''}. इतिहास: ${ghat.history?.mr || ''}. धार्मिक महत्त्व: ${ghat.importance?.mr || ''}. मुख्य वैशिष्ट्ये: ${ghat.highlights?.mr || ''}`,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/ghats`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToGhats')}
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 animate-fade-up">
        {/* Photography Banner Header */}
        {ghat.imageUrl && (
          <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-100">
            <img
              src={ghat.imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider text-white backdrop-blur-md mb-2.5 shadow-md"
                style={{
                  background: ghat.snanPriority === 1 ? 'rgba(232, 119, 34, 0.95)' : 'rgba(45, 95, 168, 0.95)',
                }}
              >
                <Waves className="h-4 w-4" />
                {ghat.snanPriority === 1 ? 'Amrit Snan (Priority 1)' : `Priority ${ghat.snanPriority}`}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-md tracking-tight">
                {name}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Status & Title for non-image layout */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-100">
            {!ghat.imageUrl && (
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{
                    background: ghat.snanPriority === 1 ? '#E87722' : '#2D5FA8',
                  }}
                >
                  <Waves className="h-3.5 w-3.5" />
                  Priority {ghat.snanPriority}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {name}
                </h1>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                {t('riverLabel')}: {ghat.riverName}
              </span>

              {ghat.verified ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Verified Bathing Site
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Details Await Verification</span>
                </span>
              )}
            </div>
          </div>

          {/* ── AI Audio Reader Component ────────────────────────────────────── */}
          <AiAudioReader textToRead={textToRead} templeName={name} />

          {/* Description Overview */}
          {desc && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {desc}
              </p>
            </div>
          )}

          {/* ── History & Origin ───────────────────────────────────────────── */}
          {historyText && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-amber-800 font-black text-lg sm:text-xl">
                <BookOpen className="h-5 w-5 text-amber-600 shrink-0" />
                <h2>History & Origin</h2>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-amber-50/30 p-4 rounded-xl border border-amber-100">
                {historyText}
              </p>
            </div>
          )}

          {/* ── Spiritual Importance ──────────────────────────────────────── */}
          {importanceText && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-lg sm:text-xl">
                <Flame className="h-5 w-5 text-orange-600 shrink-0" />
                <h2>Spiritual & Cultural Importance</h2>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-indigo-50/30 p-4 rounded-xl border border-indigo-100">
                {importanceText}
              </p>
            </div>
          )}

          {/* ── Key Highlights ─────────────────────────────────────────────── */}
          {highlightsText && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-lg sm:text-xl">
                <Star className="h-5 w-5 text-amber-500 shrink-0" />
                <h2>Key Highlights & Kumbh Rituals</h2>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                {highlightsText}
              </p>
            </div>
          )}

          {/* ── YouTube Virtual Video Tour ───────────────────────────────── */}
          {ghat.youtubeVideoId && (
            <TempleVideoPlayer youtubeVideoId={ghat.youtubeVideoId} templeName={name} />
          )}

          {/* Tags */}
          {ghat.tags && ghat.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
              {ghat.tags.map((tag) => (
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
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{t('coordinatesLabel')}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Latitude: {ghat.coordinates.lat}, Longitude: {ghat.coordinates.lng}
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=${ghat.coordinates.lat},${ghat.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold transition-all shadow-md"
              >
                <MapPin className="h-4 w-4 text-amber-300" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
