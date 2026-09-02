'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, ArrowLeft, ShieldCheck, Tag, Clock, AlertTriangle, BookOpen, Flame, Star } from 'lucide-react';
import TempleIcon from '@/components/ui/TempleIcon';
import { TEMPLES } from '@/data/seed';
import AiAudioReader from '@/components/ui/AiAudioReader';
import TempleVideoPlayer from '@/components/ui/TempleVideoPlayer';
import ImageGallerySlideshow from '@/components/ui/ImageGallerySlideshow';

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
  const historyText = temple.history?.[locale] || temple.history?.en || '';
  const importanceText = temple.importance?.[locale] || temple.importance?.en || '';
  const highlightsText = temple.highlights?.[locale] || temple.highlights?.en || '';

  // Prepare combined text for AI Audio Reader
  const textToRead = {
    en: `${name}. ${temple.description?.en || ''}. History: ${temple.history?.en || ''}. Spiritual Importance: ${temple.importance?.en || ''}. Highlights: ${temple.highlights?.en || ''}`,
    hi: `${temple.name.hi}. ${temple.description?.hi || ''}. इतिहास: ${temple.history?.hi || ''}. धार्मिक महत्व: ${temple.importance?.hi || ''}. मुख्य आकर्षण: ${temple.highlights?.hi || ''}`,
    mr: `${temple.name.mr}. ${temple.description?.mr || ''}. इतिहास: ${temple.history?.mr || ''}. धार्मिक महत्त्व: ${temple.importance?.mr || ''}. मुख्य वैशिष्ट्ये: ${temple.highlights?.mr || ''}`,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/temples`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToTemples')}
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 animate-fade-up">
        {/* Image Gallery Slideshow Header */}
        {temple.galleryImages && temple.galleryImages.length > 0 ? (
          <ImageGallerySlideshow
            images={temple.galleryImages}
            title={name}
            badgeText={temple.deity}
            badgeBg="#E87722"
          />
        ) : temple.imageUrl ? (
          <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-100">
            <img
              src={temple.imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider text-white bg-amber-600/90 backdrop-blur-md mb-2.5 shadow-md">
                <TempleIcon className="h-4 w-4" />
                {temple.deity}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-md tracking-tight">
                {name}
              </h1>
            </div>
          </div>
        ) : null}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Status & Title for non-image banner */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-100">
            {!temple.imageUrl && (
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{ background: '#C2581A' }}
                >
                  <TempleIcon className="h-3.5 w-3.5" />
                  {temple.deity}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {name}
                </h1>
              </div>
            )}
          </div>

          {/* ── AI Audio Reader Component ────────────────────────────────────── */}
          <AiAudioReader textToRead={textToRead} templeName={name} />

          {/* Timings Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-800 shrink-0">
              <Clock className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">{t('timingsLabel')}</p>
              {temple.timingsEn ? (
                <p className="text-lg font-extrabold text-slate-800">{temple.timingsEn}</p>
              ) : (
                <span className="text-xs text-amber-700 font-medium italic">Pending official temple trust announcement</span>
              )}
            </div>
          </div>

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
                <h2>History & Architecture</h2>
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
                <h2>Key Highlights & Kumbh Mela Significance</h2>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                {highlightsText}
              </p>
            </div>
          )}

          {/* ── YouTube Virtual Video Tour ───────────────────────────────── */}
          {temple.youtubeVideoId && (
            <TempleVideoPlayer youtubeVideoId={temple.youtubeVideoId} templeName={name} />
          )}

          {/* Tags */}
          {temple.tags && temple.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
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
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Map Coordinates & Directions</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Latitude: {temple.coordinates.lat}, Longitude: {temple.coordinates.lng}
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=${temple.coordinates.lat},${temple.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-md"
              >
                <MapPin className="h-4 w-4 text-amber-200" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
