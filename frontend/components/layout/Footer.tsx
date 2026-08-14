'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t"
      style={{
        background: '#0F1E35',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Unofficial notice */}
        <div
          className="flex items-start gap-3.5 rounded-2xl p-5 sm:p-6"
          style={{ background: 'rgba(232,119,34,0.12)', border: '1px solid rgba(232,119,34,0.25)' }}
        >
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {t('unofficialNote')}
          </p>
        </div>

        {/* Links row */}
        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
          aria-label="Footer links"
        >
          {(['about', 'privacy', 'contact'] as const).map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="text-sm font-semibold text-white/60 hover:text-white transition-colors min-h-[44px] inline-flex items-center"
            >
              {t(`links.${key}`)}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-white/40 font-medium">{t('copyright')}</p>
          <p className="text-xs text-amber-400/80 font-bold">Simhastha Kumbh Mela 2027 • Nashik</p>
        </div>
      </div>
    </footer>
  );
}
