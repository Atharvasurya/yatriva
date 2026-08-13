'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[36px] rounded-lg',
  md: 'px-5 py-2.5 text-sm min-h-[44px] rounded-xl',
  lg: 'px-7 py-3.5 text-base min-h-[52px] rounded-xl',
};

const VARIANT_BASE: Record<ButtonVariant, { className: string; style: React.CSSProperties }> = {
  primary: {
    style: { background: '#1B2B4B' },
    className: 'text-white hover:brightness-90 active:scale-[0.98]',
  },
  secondary: {
    style: { border: '2px solid #1B2B4B', color: '#1B2B4B', background: 'transparent' },
    className: 'hover:bg-[rgba(27,43,75,0.06)] active:scale-[0.98]',
  },
  ghost: {
    style: { color: '#1B2B4B', background: 'transparent' },
    className: 'hover:bg-[rgba(27,43,75,0.06)] active:scale-[0.98]',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const v = VARIANT_BASE[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          'inline-flex items-center justify-center gap-2 font-bold',
          'transition-all duration-150 ease-out',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none',
          SIZE_CLASSES[size],
          v.className,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ ...v.style, ...style }}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
