'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Home, Map, Bus, AlertTriangle, Waves, ParkingCircle, Info, BookOpen, Sparkles
} from 'lucide-react';
import TempleIcon from '@/components/ui/TempleIcon';

const PRIMARY_NAV = [
  { key: 'home',      href: '/',          Icon: Home },
  { key: 'assistant', href: '/assistant', Icon: Sparkles },
  { key: 'map',       href: '/map',        Icon: Map },
  { key: 'transport', href: '/transport',  Icon: Bus },
  { key: 'emergency', href: '/emergency',  Icon: AlertTriangle },
];

const SECTION_NAV = [
  { key: 'ghats',    href: '/ghats',    Icon: Waves },
  { key: 'temples',  href: '/temples',  Icon: TempleIcon },
  { key: 'culture',  href: '/culture',  Icon: BookOpen },
  { key: 'parking',  href: '/parking',  Icon: ParkingCircle },
  { key: 'about',    href: '/about',    Icon: Info },
];

export default function SidebarNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href === '/' ? '' : href}`;
    if (href === '/') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullHref);
  };

  const NavLink = ({
    href,
    labelKey,
    Icon,
  }: {
    href: string;
    labelKey: string;
    Icon: React.ElementType;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={`/${locale}${href === '/' ? '' : href}`}
        prefetch={true}
        aria-current={active ? 'page' : undefined}
        className={[
          'flex items-center gap-3 rounded-xl px-3 py-2.5',
          'min-h-[44px] transition-all duration-200',
          'text-sm font-medium',
          active
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:bg-white/8 hover:text-white/90',
        ].join(' ')}
      >
        <Icon
          className="h-5 w-5 shrink-0"
          strokeWidth={active ? 2.5 : 1.75}
          aria-hidden="true"
        />
        <span>{t(labelKey as keyof ReturnType<typeof t>)}</span>
        {active && (
          <span
            className="ml-auto h-1.5 w-1.5 rounded-full"
            style={{ background: '#E87722' }}
            aria-hidden="true"
          />
        )}
      </Link>
    );
  };

  return (
    <nav
      className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen overflow-y-auto py-6 px-3"
      aria-label="Sidebar navigation"
      style={{
        background: 'linear-gradient(180deg, #1B2B4B 0%, #2D4A7A 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >

      {/* Primary nav */}
      <div className="space-y-0.5 mb-6">
        {PRIMARY_NAV.map(({ key, href, Icon }) => (
          <NavLink key={key} href={href} labelKey={key} Icon={Icon} />
        ))}
      </div>

      {/* Divider */}
      <div className="my-2 border-t border-white/10" />

      {/* Section nav */}
      <div className="space-y-0.5 mt-4">
        {SECTION_NAV.map(({ key, href, Icon }) => (
          <NavLink key={key} href={href} labelKey={key} Icon={Icon} />
        ))}
      </div>

      {/* Unofficial note at bottom */}
      <div className="mt-auto pt-6">
        <p className="text-xs text-white/30 leading-snug px-3">
          {locale === 'hi'
            ? 'स्वतंत्र मार्गदर्शिका — किसी भी सरकारी प्राधिकरण से संबद्ध नहीं।'
            : locale === 'mr'
            ? 'स्वतंत्र मार्गदर्शिका — कोणत्याही सरकारी प्राधिकरणाशी संलग्न नाही.'
            : 'Independent guide — not affiliated with any government authority.'}
        </p>
      </div>
    </nav>
  );
}
