'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('meta');

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Main nav bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2"
        style={{
          background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)',
          boxShadow: '0 2px 12px 0 rgba(27,43,75,0.25)',
        }}
      >
        {/* Logo + brand name */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-lg"
          aria-label="Yatriva — Home"
        >
          <div className="relative h-12 w-12 shrink-0">
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
            <span className="block text-white font-bold text-lg tracking-tight leading-none">
              YATRIVA
            </span>
            <span className="block text-xs font-medium leading-tight mt-0.5" style={{ color: '#E87722' }}>
              {t('headerSubtitle') || 'Nashik Kumbh Mela 2027'}
            </span>
          </div>
        </Link>

        {/* Language switcher — always visible, never hidden */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
