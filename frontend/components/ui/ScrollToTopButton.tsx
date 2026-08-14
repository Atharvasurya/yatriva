'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-[148px] right-[24px] z-35 h-12 w-12 rounded-full flex items-center justify-center text-amber-300 border border-amber-500/30 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:border-amber-400 group cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1B2B4B 0%, #0F1E35 100%)',
        boxShadow: '0 8px 25px rgba(15, 23, 42, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25)',
      }}
    >
      <ArrowUp className="h-5 w-5 text-amber-400 transition-transform duration-200 group-hover:-translate-y-1 group-hover:text-amber-300" />
    </button>
  );
}
