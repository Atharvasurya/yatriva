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
      <article className="card overflow-hidden p-6 sm:p-8 space-y-6 animate-fade-up">
        {/* Header */}
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div className="p-2.5 rounded-xl bg-saffron-50 text-saffron-600" style={{ color: '#E87722', background: 'rgba(232,119,34,0.1)' }}>
              <IconComp className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>{topic.readTimeMinutes} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-navy-800 leading-tight" style={{ color: '#1B2B4B' }}>
            {title}
          </h1>

          <p className="text-sm font-bold text-saffron-600 leading-relaxed" style={{ color: '#E87722' }}>
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
          <ShieldCheck className="h-5 w-5 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
          <span>Curated from scriptural & Puranic research for the Nashik Simhastha Kumbh Mela 2027.</span>
        </div>
      </article>
    </div>
  );
}
