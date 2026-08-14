'use client';

import { useState } from 'react';
import { Video, ExternalLink, Play, Sparkles, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VideoTour {
  id: string;
  videoId: string;
  titleKey: string;
  locationKey: string;
  duration: string;
}

const DARSHAN_TOURS: VideoTour[] = [
  {
    id: 'nashik-tour',
    videoId: 'wh8JyS_ibb0',
    titleKey: 'nashikTourTitle',
    locationKey: 'nashikTourLoc',
    duration: 'Full Tour',
  },
  {
    id: 'ramkund-panchavati',
    videoId: '1qS7Vp3G7Q0',
    titleKey: 'ramkundTitle',
    locationKey: 'ramkundLoc',
    duration: 'Ramkund & Panchavati',
  },
  {
    id: 'kushavarta',
    videoId: '9yP6Y7e6x0A',
    titleKey: 'kushavartaTitle',
    locationKey: 'kushavartaLoc',
    duration: 'Kushavarta Kund',
  },
  {
    id: 'saptashringi',
    videoId: '3Rk2H1z8_1Q',
    titleKey: 'saptashringiTitle',
    locationKey: 'saptashringiLoc',
    duration: 'Shakti Peetha',
  },
];

export default function NashikDarshanVideo() {
  const t = useTranslations('darshan');
  const [selectedTour, setSelectedTour] = useState<VideoTour>(DARSHAN_TOURS[0]);

  return (
    <section
      id="nashik-darshan-video"
      className="px-4 py-6 max-w-4xl mx-auto w-full"
      aria-labelledby="darshan-heading"
    >
      <div className="card p-5 sm:p-7 bg-white rounded-[var(--radius-card)] shadow-xl border border-slate-200/80 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-black uppercase tracking-wider border border-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              <span>{t('badge')}</span>
            </div>
            <h2
              id="darshan-heading"
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: 'var(--color-primary)' }}
            >
              {t('heading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('description')}
            </p>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${selectedTour.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-center"
          >
            <Video className="h-4 w-4" />
            <span>{t('watchOnYouTube')}</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </div>

        {/* Video Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {DARSHAN_TOURS.map((tour) => {
            const isSelected = selectedTour.id === tour.id;
            return (
              <button
                key={tour.id}
                onClick={() => setSelectedTour(tour)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[40px] cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Play className={`h-3 w-3 ${isSelected ? 'fill-white text-white' : 'text-slate-500'}`} />
                <span>{t(tour.titleKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Video Frame */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-900 group">
          <iframe
            key={selectedTour.videoId}
            src={`https://www.youtube-nocookie.com/embed/${selectedTour.videoId}?rel=0&modestbranding=1&autoplay=0`}
            title={t(selectedTour.titleKey)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

        {/* Video Details Caption */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span>{t(selectedTour.locationKey)}</span>
          </div>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-md">
            HD 1080p • Virtual Darshan
          </span>
        </div>
      </div>
    </section>
  );
}
