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
        'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 group flex flex-col items-center justify-center text-center',
        'gap-3.5 p-5 sm:p-6 min-h-[120px] transition-all duration-300 shadow-sm',
        'animate-fade-up',
        `delay-${(index + 1) * 100}`,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95 hover:border-amber-500/30',
      ].join(' ')}
    >
      {/* Icon container */}
      <div
        className={`
          flex items-center justify-center rounded-2xl
          h-13 w-13 transition-all duration-300 transform
          ${!disabled ? 'group-hover:scale-110 group-hover:rotate-3 shadow-inner' : ''}
        `}
        style={{ background: color }}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6 transition-colors duration-200" style={{ color: textColor }} strokeWidth={2} />
      </div>

      {/* Label & Description */}
      <div className="space-y-0.5">
        <p className="font-extrabold text-sm sm:text-base leading-tight text-slate-900 group-hover:text-amber-700 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 font-medium leading-snug">{description}</p>
        )}
      </div>
    </div>
  );

  if (disabled) return <div aria-disabled="true">{inner}</div>;

  return (
    <Link
      href={fullHref}
      aria-label={label}
      className="focus-visible:outline-2 focus-visible:outline-offset-2 rounded-2xl sm:rounded-3xl block"
      style={{ outlineColor: textColor }}
    >
      {inner}
    </Link>
  );
}
