'use client';

import dynamic from 'next/dynamic';
import type { Place, Coordinates } from '@/types/place';

const DynamicLeafletMap = dynamic(
  () => import('@/components/map/LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center border border-slate-200">
        <p className="text-xs font-bold text-slate-500">Loading Interactive Pilgrim Map...</p>
      </div>
    ),
  }
);

interface LeafletMapWrapperProps {
  places: Place[];
  userLocation: Coordinates | null;
  locationSource: 'gps' | 'manual';
  onOpenLocationPicker: () => void;
  height?: string;
  initialZoom?: number;
}

import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function LeafletMapWrapper(props: LeafletMapWrapperProps) {
  return (
    <ErrorBoundary fallbackTitle="Interactive Map Error">
      <DynamicLeafletMap {...props} />
    </ErrorBoundary>
  );
}
