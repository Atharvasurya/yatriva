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
        background: '#1B2B4B',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Unofficial notice */}
        <div
          className="flex items-start gap-3 rounded-xl p-4 mb-6"
          style={{ background: 'rgba(232,119,34,0.12)', border: '1px solid rgba(232,119,34,0.25)' }}
        >
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#E87722' }} aria-hidden="true" />
          <p className="text-xs text-white/70 leading-relaxed">
            {t('unofficialNote')}
          </p>
        </div>

        {/* Links row */}
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4"
          aria-label="Footer links"
        >
          {(['about', 'privacy', 'contact'] as const).map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="text-sm text-white/50 hover:text-white/80 transition-colors min-h-[44px] inline-flex items-center"
            >
              {t(`links.${key}`)}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white/30">{t('copyright')}</p>
      </div>
    </footer>
  );
}
