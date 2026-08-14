'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Map, Bus, Waves, MoreHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'home', href: '/', Icon: Home },
  { key: 'ghats', href: '/ghats', Icon: Waves },
  { key: 'map', href: '/map', Icon: Map },
  { key: 'transport', href: '/transport', Icon: Bus },
  { key: 'more', href: '/more', Icon: MoreHorizontal },
] as const;

export default function BottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href === '/' ? '' : href}`;
    if (href === '/') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullHref);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pb-safe"
      aria-label="Primary navigation"
      style={{
        background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)',
        boxShadow: '0 -2px 16px 0 rgba(27,43,75,0.25)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(({ key, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={`/${locale}${href === '/' ? '' : href}`}
              aria-label={t(key as keyof ReturnType<typeof t>)}
              aria-current={active ? 'page' : undefined}
              className={[
                'flex flex-col items-center justify-center gap-0.5',
                'min-h-[56px] min-w-[56px] px-1 py-2',
                'transition-all duration-200 rounded-xl',
                active
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80',
              ].join(' ')}
            >
              {/* Active indicator dot */}
              <div className="relative">
                {active && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                    style={{ background: '#E87722' }}
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`h-6 w-6 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
                  strokeWidth={active ? 2.5 : 1.75}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide leading-none ${active ? 'text-white' : 'text-white/50'}`}
              >
                {t(key as keyof ReturnType<typeof t>)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
