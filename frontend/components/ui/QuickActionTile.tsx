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
        'bg-white rounded-2xl border border-slate-200/80 group flex flex-col items-center justify-center text-center',
        'gap-2.5 p-4 sm:p-4.5 min-h-[102px] transition-all duration-300 shadow-xs',
        'animate-fade-up',
        `delay-${(index + 1) * 100}`,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-95 hover:border-amber-500/30',
      ].join(' ')}
    >
      {/* Icon container */}
      <div
        className={`
          flex items-center justify-center rounded-xl
          h-11 w-11 transition-all duration-300 transform
          ${!disabled ? 'group-hover:scale-105 shadow-inner' : ''}
        `}
        style={{ background: color }}
        aria-hidden="true"
      >
        <Icon className="h-5.5 w-5.5 transition-colors duration-200" style={{ color: textColor }} strokeWidth={2} />
      </div>

      {/* Label & Description */}
      <div className="space-y-0.5">
        <p className="font-extrabold text-xs sm:text-sm leading-tight text-slate-900 group-hover:text-amber-700 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{description}</p>
        )}
      </div>
    </div>
  );

  if (disabled) return <div aria-disabled="true">{inner}</div>;

  return (
    <Link
      href={fullHref}
      prefetch={true}
      aria-label={label}
      className="focus-visible:outline-2 focus-visible:outline-offset-2 rounded-2xl block"
      style={{ outlineColor: textColor }}
    >
      {inner}
    </Link>
  );
}
