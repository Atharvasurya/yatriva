'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Map, MapPin, Compass, Navigation } from 'lucide-react';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import { useUserLocation } from '@/hooks/useUserLocation';
import { ALL_MAP_PLACES } from '@/data/seed';

export default function MapPage() {
  const t = useTranslations('map');
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            style={{ background: '#E87722', minHeight: '44px' }}
          >
            <Compass className="h-4 w-4" />
            <span>{locationSource === 'gps' ? 'Live GPS Active' : 'Set Landmark'}</span>
          </button>
        </div>
      </div>

      {/* Main Full-Height Leaflet Map Container */}
      <div className="card p-3 bg-white shadow-xl rounded-2xl">
        <LeafletMapWrapper
          places={ALL_MAP_PLACES}
          userLocation={userLocation}
          locationSource={locationSource}
          onOpenLocationPicker={() => setIsPickerOpen(true)}
          height="620px"
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
