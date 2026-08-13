'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface ImageGallerySlideshowProps {
  images: string[];
  title: string;
  badgeText?: string;
  badgeBg?: string;
}

export default function ImageGallerySlideshow({
  images,
  title,
  badgeText,
  badgeBg = '#E87722',
}: ImageGallerySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const safeImages = images && images.length > 0 ? images : [];

  // Automatic slideshow transition timer (4 seconds)
  useEffect(() => {
    if (!isPlaying || safeImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % safeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, safeImages.length]);

  if (safeImages.length === 0) return null;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % safeImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <>
      {/* ── Main Slideshow Banner ───────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-900 group">
        {/* Slideshow Image Stack with Crossfade */}
        {safeImages.map((imgUrl, idx) => (
          <div
            key={imgUrl + idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={imgUrl}
              alt={`${title} - Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Gradient Scrim Overlay for Readable Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-20 pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {safeImages.length > 1 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
              title={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(true)}
            aria-label="View Fullscreen Photo"
            className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
            title="Open photo lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Left & Right Nav Arrows (Visible on Hover & Mobile) */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer transform hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer transform hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Banner Title & Badge */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            {badgeText && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider text-white backdrop-blur-md shadow-md"
                style={{ background: badgeBg }}
              >
                {badgeText}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md tracking-tight leading-tight">
              {title}
            </h1>
          </div>

          {/* Slide Indicator Pill */}
          {safeImages.length > 1 && (
            <div className="shrink-0 px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-mono font-bold border border-white/20">
              {currentIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Bottom Dot Navigation Bar */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center items-center gap-1.5 pointer-events-auto">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen Lightbox Modal ──────────────────────────────────────── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-up">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm sm:text-base">{title}</span>
              <span className="text-xs text-slate-400 ml-2 font-mono">
                ({currentIndex + 1} of {safeImages.length})
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Large Photo View */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={safeImages[currentIndex]}
              alt={`${title} fullscreen`}
              className="max-h-[80vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {safeImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
              {safeImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    idx === currentIndex ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
