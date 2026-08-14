'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, ArrowLeft, Clock, MapPin, ExternalLink, ShieldCheck, Waves, Landmark, Flag } from 'lucide-react';
import { CULTURE_TOPICS } from '@/data/cultureData';
import { ALL_MAP_PLACES } from '@/data/seed';

const TOPIC_ICONS: Record<string, typeof Waves> = {
  Waves,
  Landmark,
  Flag,
};

export default function CultureDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const t = useTranslations('culture');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const topic = CULTURE_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#1B2B4B' }}>
          Heritage Guide Not Found
        </h1>
        <Link
          href={`/${locale}/culture`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-800 text-white text-sm font-bold"
          style={{ background: '#1B2B4B' }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToCulture')}
        </Link>
      </div>
    );
  }

  const title = topic.title[locale] || topic.title.en;
  const subtitle = topic.subtitle[locale] || topic.subtitle.en;
  const bodyText = topic.content[locale] || topic.content.en;
  const IconComp = TOPIC_ICONS[topic.icon] || BookOpen;

  // Find related places for cross-linking
  const relatedPlaces = topic.relatedPlaceSlugs
    ? ALL_MAP_PLACES.filter((p) => topic.relatedPlaceSlugs?.includes(p.slug))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back Link */}
      <Link
        href={`/${locale}/culture`}
        className="inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-saffron-600 transition-colors"
        style={{ color: '#1B2B4B' }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToCulture')}
      </Link>

      {/* Main Article Container */}
      <article className="card overflow-hidden p-0 space-y-0 animate-fade-up border border-slate-200/90 rounded-3xl shadow-sm bg-white">
        {/* Hero Image Banner */}
        {topic.imageUrl && (
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
            <img
              src={topic.imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            
            <div className="absolute bottom-4 left-5 right-5 z-10 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                  <IconComp className="h-3.5 w-3.5" />
                  <span className="capitalize">{topic.category}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  <Clock className="h-3 w-3" />
                  <span>{topic.readTimeMinutes} min read</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                {title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header (when no image or for subtitle) */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            {!topic.imageUrl && (
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                  <IconComp className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{topic.readTimeMinutes} min read</span>
                </div>
              </div>
            )}

            {!topic.imageUrl && (
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {title}
              </h1>
            )}

            <p className="text-sm sm:text-base font-bold text-amber-700 leading-relaxed">
              {subtitle}
            </p>
          </div>

        {/* Article Body */}
        <div className="prose text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {bodyText}
        </div>

        {/* Related Places Cross-Linking */}
        {relatedPlaces.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-saffron-500" style={{ color: '#E87722' }} />
              <span>Related Pilgrimage Locations on Map</span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {relatedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-xs text-navy-800">{place.name[locale] || place.name.en}</h3>
                    <p className="text-[11px] text-slate-500 capitalize">{place.category}</p>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${place.coordinates.lat},${place.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-navy-800 text-white text-xs font-bold shrink-0 flex items-center gap-1"
                    style={{ background: '#1B2B4B' }}
                  >
                    <span>Map</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Authority Footer */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center gap-3 text-xs text-orange-900 font-semibold">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Curated from scriptural & Puranic research for the Nashik Simhastha Kumbh Mela 2027.</span>
          </div>
        </div>
      </article>
    </div>
  );
}
