'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import type { LocationConfidence } from '@/types/place';

interface ConfidenceBadgeProps {
  confidence?: LocationConfidence | null;
  verified?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export default function ConfidenceBadge({
  confidence,
  verified = false,
  className = '',
  size = 'sm',
}: ConfidenceBadgeProps) {
  // Determine display label, style, and explanation tooltip
  let label = 'Unverified';
  let badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
  let Icon = AlertCircle;
  let title = 'Position pending ground survey verification';

  if (confidence === 'verified' || (verified && !confidence)) {
    label = 'Surveyed Location';
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = CheckCircle2;
    title = 'Accurate coordinate verified from official NTKMA/Kumbh survey plans';
  } else if (confidence === 'HIGH') {
    label = 'High Confidence';
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = ShieldCheck;
    title = 'High geocode confidence from registry cross-check';
  } else if (confidence === 'MEDIUM') {
    label = 'Medium Confidence';
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertCircle;
    title = 'Medium geocode confidence — unconfirmed physical gate location';
  } else if (confidence === 'LOW') {
    label = 'Low Confidence';
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    Icon = AlertCircle;
    title = 'Low geocode confidence — approximate area only, verify before travel';
  } else if (confidence === 'locality-match') {
    label = 'Locality Match';
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = HelpCircle;
    title = 'Placed by matching address text to locality centroid (approximate)';
  } else if (confidence === 'approximate') {
    label = 'Approximate Pin';
    badgeStyle = 'bg-orange-50 text-orange-800 border-orange-200';
    Icon = AlertCircle;
    title = 'Fallback placement near city centre — not an exact surveyed location';
  } else if (!verified) {
    label = 'Unverified Listing';
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertCircle;
    title = 'Public directory listing — pending Kumbh authority ground survey';
  }

  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border shadow-2xs select-none transition-colors ${badgeStyle} ${sizeClasses} ${className}`}
      title={title}
      aria-label={`Location confidence: ${label}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />
      <span>{label}</span>
    </span>
  );
}
