'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { LucideIcon } from 'lucide-react';

interface QuickActionTileProps {
  href: string;
  label: string;
  description?: string;
  Icon: LucideIcon | React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number | string; size?: number | string }>;
  color: string;       // background for the icon circle
  textColor: string;   // icon + accent color
  index: number;
  disabled?: boolean;  // grey out if page not built yet
}

export default function QuickActionTile({
  href,
  label,
  description,
  Icon,
  color,
  textColor,
  index,
  disabled = false,
}: QuickActionTileProps) {
  const locale = useLocale();
  const fullHref = `/${locale}${href}`;

  const inner = (
    <div
      className={[
        'card group flex flex-col items-center justify-center text-center',
        'gap-3 p-4 min-h-[110px] transition-all duration-200',
        'animate-fade-up',
        `delay-${(index + 1) * 100}`,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95',
      ].join(' ')}
      style={disabled ? {} : { boxShadow: 'var(--shadow-tile)' }}
    >
      {/* Icon circle */}
      <div
        className={`
          flex items-center justify-center rounded-full
          h-12 w-12 transition-all duration-300 transform
          ${!disabled ? 'group-hover:scale-110 group-hover:rotate-6 shadow-sm' : ''}
        `}
        style={{ background: color }}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6 transition-colors duration-200" style={{ color: textColor }} strokeWidth={2} />
      </div>

      {/* Label */}
      <div>
        <p className="font-bold text-sm leading-tight" style={{ color: 'var(--color-primary)' }}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 leading-snug mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );

  if (disabled) return <div aria-disabled="true">{inner}</div>;

  return (
    <Link
      href={fullHref}
      aria-label={label}
      className="focus-visible:outline-2 focus-visible:outline-offset-2 rounded-[var(--radius-card)]"
      style={{ outlineColor: textColor }}
    >
      {inner}
    </Link>
  );
}
