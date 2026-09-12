'use client';

import {
  Shield,
  Landmark,
  Waves,
  Car,
  Bus,
  Utensils,
  HelpCircle,
  Sparkles,
  HeartPulse,
  Flame,
  PhoneCall,
  Headset,
  ShieldAlert,
  MapPin,
} from 'lucide-react';
import type { Place, PlaceCategory } from '@/types/place';

export interface PlaceImageAvatarProps {
  place: {
    name?: { en?: string; hi?: string; mr?: string } | string;
    category?: PlaceCategory | string;
    [key: string]: any;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AvatarTheme {
  gradient: string;
  border: string;
  glow: string;
  iconColor: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  shortLabel: string;
}

const CATEGORY_AVATAR_THEMES: Record<string, AvatarTheme> = {
  police: {
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #1E293B 100%)',
    border: 'rgba(99, 102, 241, 0.5)',
    glow: 'rgba(99, 102, 241, 0.25)',
    iconColor: '#F59E0B',
    Icon: Shield,
    label: 'POLICE',
    shortLabel: 'PL',
  },
  medical: {
    gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 45%, #065F46 100%)',
    border: 'rgba(52, 211, 153, 0.5)',
    glow: 'rgba(52, 211, 153, 0.25)',
    iconColor: '#FFFFFF',
    Icon: HeartPulse,
    label: 'MEDICAL',
    shortLabel: 'MD',
  },
  temple: {
    gradient: 'linear-gradient(135deg, #78350F 0%, #C2410C 45%, #9A3412 100%)',
    border: 'rgba(251, 191, 36, 0.5)',
    glow: 'rgba(251, 191, 36, 0.25)',
    iconColor: '#FEF3C7',
    Icon: Landmark,
    label: 'TEMPLE',
    shortLabel: 'TM',
  },
  ghat: {
    gradient: 'linear-gradient(135deg, #0E7490 0%, #0284C7 45%, #1E3A8A 100%)',
    border: 'rgba(56, 189, 248, 0.5)',
    glow: 'rgba(56, 189, 248, 0.25)',
    iconColor: '#E0F2FE',
    Icon: Waves,
    label: 'GHAT',
    shortLabel: 'GH',
  },
  parking: {
    gradient: 'linear-gradient(135deg, #334155 0%, #1E293B 45%, #0F172A 100%)',
    border: 'rgba(148, 163, 184, 0.5)',
    glow: 'rgba(148, 163, 184, 0.25)',
    iconColor: '#38BDF8',
    Icon: Car,
    label: 'PARKING',
    shortLabel: 'PK',
  },
  transport_hub: {
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 45%, #1D4ED8 100%)',
    border: 'rgba(96, 165, 250, 0.5)',
    glow: 'rgba(96, 165, 250, 0.25)',
    iconColor: '#FFFFFF',
    Icon: Bus,
    label: 'TRANSIT',
    shortLabel: 'TR',
  },
  food: {
    gradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 45%, #C2410C 100%)',
    border: 'rgba(251, 146, 60, 0.5)',
    glow: 'rgba(251, 146, 60, 0.25)',
    iconColor: '#FFF7ED',
    Icon: Utensils,
    label: 'FOOD',
    shortLabel: 'FD',
  },
  toilet: {
    gradient: 'linear-gradient(135deg, #115E59 0%, #0F766E 45%, #134E4A 100%)',
    border: 'rgba(45, 212, 191, 0.5)',
    glow: 'rgba(45, 212, 191, 0.25)',
    iconColor: '#CCFBF1',
    Icon: Sparkles,
    label: 'TOILET',
    shortLabel: 'TL',
  },
  information_centre: {
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 45%, #312E81 100%)',
    border: 'rgba(165, 180, 252, 0.5)',
    glow: 'rgba(165, 180, 252, 0.25)',
    iconColor: '#E0E7FF',
    Icon: HelpCircle,
    label: 'INFO',
    shortLabel: 'IN',
  },
  fire: {
    gradient: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 45%, #C2410C 100%)',
    border: 'rgba(248, 113, 113, 0.5)',
    glow: 'rgba(248, 113, 113, 0.25)',
    iconColor: '#FEF08A',
    Icon: Flame,
    label: 'FIRE',
    shortLabel: 'FR',
  },
  kumbh_helpline: {
    gradient: 'linear-gradient(135deg, #78350F 0%, #D97706 45%, #B45309 100%)',
    border: 'rgba(251, 191, 36, 0.5)',
    glow: 'rgba(251, 191, 36, 0.25)',
    iconColor: '#FFFFFF',
    Icon: PhoneCall,
    label: 'HELPLINE',
    shortLabel: 'HL',
  },
  tourist_helpline: {
    gradient: 'linear-gradient(135deg, #064E3B 0%, #0D9488 45%, #0F766E 100%)',
    border: 'rgba(45, 212, 191, 0.5)',
    glow: 'rgba(45, 212, 191, 0.25)',
    iconColor: '#FFFFFF',
    Icon: Headset,
    label: 'TOURIST',
    shortLabel: 'TH',
  },
  women_helpline: {
    gradient: 'linear-gradient(135deg, #4A044E 0%, #9D174D 45%, #BE185D 100%)',
    border: 'rgba(244, 114, 182, 0.5)',
    glow: 'rgba(244, 114, 182, 0.25)',
    iconColor: '#FDF2F8',
    Icon: ShieldAlert,
    label: 'SAFETY',
    shortLabel: 'SF',
  },
};

export default function PlaceImageAvatar({
  place,
  size = 'md',
  className = '',
}: PlaceImageAvatarProps) {
  const category = (place.category as PlaceCategory) || 'information_centre';

  const theme: AvatarTheme = CATEGORY_AVATAR_THEMES[category] || {
    gradient: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    border: 'rgba(203, 213, 225, 0.5)',
    glow: 'rgba(203, 213, 225, 0.25)',
    iconColor: '#FFFFFF',
    Icon: MapPin,
    label: 'LOCATION',
    shortLabel: 'LK',
  };

  const IconComponent = theme.Icon;

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-11 h-11 min-w-[44px] rounded-xl',
    md: 'w-16 h-16 min-w-[64px] rounded-2xl',
    lg: 'w-20 h-20 min-w-[80px] rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} overflow-hidden shrink-0 flex flex-col items-center justify-center shadow-md select-none transition-transform group-hover:scale-105 duration-200 ${className}`}
      style={{
        background: theme.gradient,
        boxShadow: `0 3px 12px 0 ${theme.glow}, inset 0 0 0 1px ${theme.border}`,
      }}
      aria-hidden="true"
    >
      {/* Centered Category Icon */}
      <IconComponent
        className={`${iconSizes} transition-transform duration-200`}
        style={{
          color: theme.iconColor,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
        }}
      />

      {/* Category Micro Badge */}
      {size === 'sm' ? (
        <span className="text-[8px] font-black tracking-widest text-white/75 mt-0.5 leading-none">
          {theme.shortLabel}
        </span>
      ) : (
        <span className="text-[8px] font-black tracking-wider text-white/80 mt-1 leading-none uppercase px-1.5 py-0.5 rounded bg-black/25">
          {theme.label}
        </span>
      )}

      {/* Gloss reflection highlight */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
