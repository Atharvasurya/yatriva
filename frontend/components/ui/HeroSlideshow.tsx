'use client';

import { useState, useEffect } from 'react';

const HERO_IMAGES = [
  {
    url: '/images/godaghat_hero.jpg',
    alt: 'Holy Godavari River & Ramkund Ghat Simhastha Kumbh Mela',
  },
  {
    url: '/images/temples/trimbakeshwar.jpg',
    alt: 'Trimbakeshwar Shiva Jyotirlinga Temple',
  },
  {
    url: '/images/ghats/ramkund.jpg',
    alt: 'Sacred Ramkund Amrit Snan Ghat',
  },
  {
    url: '/images/ghats/kushavarta.jpg',
    alt: 'Kushavarta Kund Holy Origin of Godavari at Trimbakeshwar',
  },
  {
    url: '/images/temples/kalaram.jpg',
    alt: 'Historic Kalaram Temple in Panchavati',
  },
  {
    url: '/images/ghats/ahilyaghat.jpg',
    alt: 'Ahilyabai Holkar Historic Godavari Ghat',
  },
  {
    url: '/images/temples/saptashringi.jpg',
    alt: 'Saptashringi Devi Mountain Peak Shakti Peetha',
  },
];

interface HeroSlideshowProps {
  children: React.ReactNode;
}

export default function HeroSlideshow({ children }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden shadow-inner min-h-[360px] flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      {/* ── Background Slideshow Layer ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden pointer-events-none">
        {HERO_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-6000 ease-out transform ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Dynamic Dark Gradient Overlay for Maximum Text Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/35 to-slate-950/75 pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle Shimmer Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 shimmer-effect"
          aria-hidden="true"
        />
      </div>

      {/* ── Foreground Content ─────────────────────────────────────────────── */}
      <div className="relative z-10">{children}</div>

      {/* ── Automatic Slide Progress Indicator Dots ────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 pb-8 pt-1">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer h-1.5 ${
              idx === currentIndex
                ? 'w-6 bg-amber-400 shadow-md shadow-amber-500/50'
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
