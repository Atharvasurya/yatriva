'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('meta');

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)',
        boxShadow: '0 2px 16px 0 rgba(27,43,75,0.25)',
      }}
    >
      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Logo + brand name */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-xl group"
          aria-label="Yatriva — Home"
        >
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 transition-transform group-hover:scale-105 duration-200">
            <Image
              src="/newlogo.png"
              alt="Yatriva logo"
              fill
              className="object-contain"
              priority
              sizes="48px"
            />
          </div>
          <div className="leading-none">
            <span className="block text-white font-extrabold text-lg sm:text-xl tracking-tight leading-none">
              YATRIVA
            </span>
            <span className="block text-xs font-bold leading-tight mt-1" style={{ color: '#F59E0B' }}>
              Kumbh Mela 2027
            </span>
          </div>
        </Link>

        {/* Language switcher — always visible, never hidden */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
