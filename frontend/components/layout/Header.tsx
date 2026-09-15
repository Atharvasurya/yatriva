'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import GlobalNavbarSearch from '@/components/layout/GlobalNavbarSearch';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('meta');

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main nav bar */}
      <div
        className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2"
        style={{
          background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)',
          boxShadow: '0 2px 12px 0 rgba(27,43,75,0.25)',
        }}
      >
        {/* Logo + brand name */}
        <Link
          href={`/${locale}`}
          prefetch={true}
          className="flex items-center gap-2 sm:gap-2.5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg shrink-0 min-w-0"
          aria-label="Yatriva — Home"
        >
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0">
            <Image
              src="/newlogo.png"
              alt="Yatriva logo"
              fill
              className="object-contain"
              priority
              sizes="44px"
            />
          </div>
          <div className="leading-none min-w-0">
            <span className="block text-white font-extrabold text-base sm:text-lg tracking-tight leading-none">
              YATRIVA
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold leading-tight mt-0.5 truncate max-w-[135px] sm:max-w-none" style={{ color: '#E87722' }}>
              {t('headerSubtitle') || 'Nashik Kumbh Mela 2027'}
            </span>
          </div>
        </Link>

        {/* Right side controls: Search + Language Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <GlobalNavbarSearch />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
