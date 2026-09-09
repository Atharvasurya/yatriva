'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'EN', nativeLabel: 'English' },
  { code: 'hi', label: 'हिं', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'मर', nativeLabel: 'मराठी' },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    // Swap the locale segment in the current path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    startTransition(() => {
      router.push(newPath);
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Mobile: always show all 3 inline */}
      <div
        className="flex items-center gap-0.5 rounded-full border border-white/20 bg-white/10 p-0.5"
        role="group"
        aria-label="Language switcher"
      >
        {LOCALES.map(({ code, label, nativeLabel }) => (
          <button
            key={code}
            onClick={() => switchLocale(code)}
            aria-pressed={locale === code}
            aria-label={`Switch to ${nativeLabel}`}
            disabled={isPending}
            className={[
              'min-h-[44px] min-w-[44px] rounded-full px-3 py-1.5',
              'text-xs font-bold transition-all duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-1',
              locale === code
                ? 'bg-white text-navy-700 shadow-sm'
                : 'text-white/80 hover:bg-white/15 hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
