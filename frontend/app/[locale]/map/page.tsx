'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Map, Compass, ShieldAlert, ChevronRight } from 'lucide-react';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import { useUserLocation } from '@/hooks/useUserLocation';
import { ALL_MAP_PLACES } from '@/data/seed';

export default function MapPage() {
  const t = useTranslations('map');
  const tCrowd = useTranslations('crowdSafety');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    userLocation,
    locationSource,
    activePreset,
    gpsError,
    isLocating,
    requestGpsLocation,
    setManualPreset,
  } = useUserLocation();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4 sm:space-y-5">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D5FA8 100%)' }}
      >
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/10 shrink-0">
              <Map className="h-8 w-8 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
              <p className="text-white/90 text-sm mt-1 max-w-xl">{t('description')}</p>
            </div>
          </div>

          <button
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            style={{ background: '#E87722', minHeight: '44px' }}
          >
            <Compass className="h-4 w-4" />
            <span>{locationSource === 'gps' ? 'Live GPS Active' : 'Set Landmark'}</span>
          </button>
        </div>
      </div>

      {/* Amrit Snan High-Density Crowd Advisory Reminder Banner */}
      <div className="p-3 px-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 text-xs shadow-sm border border-slate-800 animate-fade-up">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-200 truncate sm:text-clip">
            {tCrowd('mapBanner.alert')}
          </span>
        </div>
        <Link
          href={`/${locale}/crowd-safety`}
          prefetch={true}
          className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white shrink-0 transition-colors"
        >
          <span>{tCrowd('mapBanner.link')}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Full-Height Leaflet Map Container */}
      <div className="card p-3 bg-white shadow-xl rounded-2xl">
        <LeafletMapWrapper
          places={ALL_MAP_PLACES}
          userLocation={userLocation}
          locationSource={locationSource}
          onOpenLocationPicker={() => setIsPickerOpen(true)}
          height="600px"
          initialZoom={13}
        />
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectPreset={setManualPreset}
        onRequestGps={requestGpsLocation}
        currentSource={locationSource}
        activePresetId={activePreset?.id}
        gpsError={gpsError}
        isLocating={isLocating}
      />
    </div>
  );
}
