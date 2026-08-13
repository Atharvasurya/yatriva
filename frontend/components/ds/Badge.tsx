'use client';

import React from 'react';

// ─── Badge ───────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const BADGE_CONFIG: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: '#F8F4EF',
    color: '#1C1917',
    border: '1px solid rgba(27,43,75,0.12)',
  },
  primary: {
    background: '#1B2B4B',
    color: '#ffffff',
  },
  accent: {
    background: 'rgba(232,119,34,0.12)',
    color: '#9A3F12',
    border: '1px solid rgba(232,119,34,0.28)',
  },
  success: {
    background: 'rgba(16,185,129,0.10)',
    color: '#065F46',
    border: '1px solid rgba(16,185,129,0.25)',
  },
  warning: {
    background: '#FEF3C7',
    color: '#92400E',
    border: '1px solid #FCD34D',
  },
  danger: {
    background: 'rgba(220,38,38,0.08)',
    color: '#991B1B',
    border: '1px solid rgba(220,38,38,0.22)',
  },
  muted: {
    background: '#F1F5F9',
    color: '#57534E',
  },
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={BADGE_CONFIG[variant]}
    >
      {children}
    </span>
  );
}

// ─── Chip (filter chip) ───────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active = false, disabled = false, onClick, className = '' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={[
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold',
        'min-h-[32px] border transition-all duration-150 ease-out',
        'select-none',
        disabled
          ? 'opacity-40 cursor-not-allowed pointer-events-none'
          : active
          ? 'cursor-pointer'
          : 'cursor-pointer hover:border-slate-300 bg-white border-slate-200 text-slate-700',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        active
          ? { background: '#1B2B4B', color: '#ffffff', borderColor: '#1B2B4B' }
          : undefined
      }
    >
      {label}
    </button>
  );
}
