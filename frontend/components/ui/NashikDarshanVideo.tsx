'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Video, ExternalLink, Play, Sparkles, MapPin, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VideoTour {
  id: string;
  videoId: string;
  titleKey: string;
  locationKey: string;
  previewImage: string;
}

const DARSHAN_TOURS: VideoTour[] = [
  {
    id: 'nashik-tour',
    videoId: '9cUFKT1FDbE',
    titleKey: 'nashikTourTitle',
    locationKey: 'nashikTourLoc',
    previewImage: '/images/temples/trimbakeshwar.jpg',
  },
  {
    id: 'ramkund-panchavati',
    videoId: 'M1Hj_6RHZMc',
    titleKey: 'ramkundTitle',
    locationKey: 'ramkundLoc',
    previewImage: '/images/ghats/ramkund.jpg',
  },
  {
    id: 'kushavarta',
    videoId: 'lfrg4VOS_FM',
    titleKey: 'kushavartaTitle',
    locationKey: 'kushavartaLoc',
    previewImage: '/images/ghats/kushavarta.jpg',
  },
  {
    id: 'saptashringi',
    videoId: 'Ex6euAj5VdE',
    titleKey: 'saptashringiTitle',
    locationKey: 'saptashringiLoc',
    previewImage: '/images/temples/saptashringi.jpg',
  },
];

export default function NashikDarshanVideo() {
  const t = useTranslations('darshan');
  const [selectedTour, setSelectedTour] = useState<VideoTour>(DARSHAN_TOURS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectTour = (tour: VideoTour) => {
    if (tour.id !== selectedTour.id) {
      setSelectedTour(tour);
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="nashik-darshan-video"
      className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full"
      aria-labelledby="darshan-heading"
    >
      <div className="p-4 sm:p-7 bg-white rounded-2xl shadow-lg border border-slate-200/80 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-black uppercase tracking-wider border border-amber-200">
              <Sparkles className="h-3 w-3 text-amber-600 animate-pulse" />
              <span>{t('badge')}</span>
            </div>
            <h2
              id="darshan-heading"
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: 'var(--color-primary)' }}
            >
              {t('heading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {t('description')}
            </p>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${selectedTour.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs active:scale-95 shrink-0 self-start sm:self-center hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            <Video className="h-3.5 w-3.5" />
            <span>{t('watchOnYouTube')}</span>
            <ExternalLink className="h-3 w-3 opacity-75" />
          </a>
        </div>

        {/* Video Selector Tabs */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar sm:scrollbar-thin">
          {DARSHAN_TOURS.map((tour) => {
            const isSelected = selectedTour.id === tour.id;
            return (
              <button
                key={tour.id}
                onClick={() => handleSelectTour(tour)}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[38px] cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white shadow-sm border-[var(--color-primary)]'
                    : 'bg-white text-stone-700 hover:bg-[var(--color-surface-alt)] border-[var(--color-border)]'
                }`}
              >
                <Play className={`h-3 w-3 ${isSelected ? 'fill-white text-white' : 'text-stone-500'}`} />
                <span>{t(tour.titleKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Responsive Video Frame / Custom Preview Card */}
        <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800">
          {isPlaying ? (
            /* Live YouTube Player (loaded only on click) */
            <iframe
              key={selectedTour.videoId}
              src={`https://www.youtube-nocookie.com/embed/${selectedTour.videoId}?rel=0&modestbranding=1&autoplay=1`}
              title={t(selectedTour.titleKey)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            /* On-Brand Custom Preview Card */
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="group relative w-full h-full text-left cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 overflow-hidden select-none block"
              aria-label={`${t('playTour')}: ${t(selectedTour.titleKey)}`}
            >
              {/* Clean Background Image of Location */}
              <Image
                src={selectedTour.previewImage}
                alt={t(selectedTour.titleKey)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Design-System Gradient Scrim */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.2) 40%, rgba(15, 23, 42, 0.9) 100%)',
                }}
              />

              {/* Top Badges (Quality & Audio Commentary) */}
              <div className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-5 flex items-center justify-between gap-2 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold border border-white/20 shadow-md">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('quality')} • {t('virtualDarshan')}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-[10px] sm:text-[11px] font-bold border border-amber-400/30 shadow-md">
                  <Volume2 className="h-3 w-3" />
                  <span>{t('audioNote')}</span>
                </div>
              </div>

              {/* Centered Premium Saffron Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-2">
                <div
                  className="w-13 h-13 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 transform group-hover:scale-110 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #E87722 0%, #D97706 50%, #C2410C 100%)',
                    boxShadow: '0 8px 32px 0 rgba(232, 119, 34, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <Play className="h-6 w-6 sm:h-9 sm:w-9 fill-white text-white translate-x-0.5" />
                </div>
                <span className="hidden sm:inline-block mt-3 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md transition-all group-hover:bg-amber-600/90 group-hover:border-amber-400/40">
                  {t('playTour')}
                </span>
              </div>

              {/* Bottom Metadata & Location in Yatriva Typography */}
              <div className="absolute bottom-2.5 sm:bottom-5 inset-x-2.5 sm:inset-x-5 z-10 space-y-0.5 sm:space-y-1">
                <h3 className="text-sm sm:text-2xl font-black text-white leading-snug drop-shadow-md line-clamp-1 sm:line-clamp-none">
                  {t(selectedTour.titleKey)}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-sm font-semibold text-amber-200/95 drop-shadow-sm">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{t(selectedTour.locationKey)}</span>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Video Details Caption (Only visible during active playback) */}
        {isPlaying && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 flex-wrap gap-2 animate-fade-in">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>{t(selectedTour.locationKey)}</span>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md border border-slate-200">
              {t('quality')} • {t('virtualDarshan')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
