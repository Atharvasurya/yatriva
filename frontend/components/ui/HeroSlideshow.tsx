'use client';

import { useState, useEffect } from 'react';

const KUMBH_MELA_IMAGES = [
  {
    url: '/images/godaghat_hero.jpg',
    alt: 'Holy Godavari River & Ramkund Ghat Simhastha Kumbh Mela',
  },
  {
    url: '/images/ghats/ramkund.jpg',
    alt: 'Sacred Ramkund Amrit Snan Ghat during Simhastha Kumbh Mela',
  },
  {
    url: '/images/ghats/kushavarta.jpg',
    alt: 'Kushavarta Kund Holy Origin of Godavari & Shahi Snan at Trimbakeshwar',
  },
  {
    url: '/images/ghats/ahilyaghat.jpg',
    alt: 'Ahilyabai Holkar Historic Godavari Ghat',
  },
  {
    url: '/images/ghats/laxmankund.jpg',
    alt: 'Laxman Kund Sacred Kumbh Mela Snan Ghat',
  },
  {
    url: '/images/ghats/gorakhkund.jpg',
    alt: 'Gorakhkund Holy Bathing Ghat',
  },
];

interface HeroSlideshowProps {
  children: React.ReactNode;
}

export default function HeroSlideshow({ children }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Stately, slow 8-second cinematic interval
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % KUMBH_MELA_IMAGES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden shadow-inner min-h-[380px] flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      {/* ── Background Slideshow Layer ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden pointer-events-none">
        {KUMBH_MELA_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.url}
              className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-10000 ease-out transform ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Dynamic Dark Gradient Overlay for Maximum Text Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/80 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── Foreground Content ─────────────────────────────────────────────── */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
