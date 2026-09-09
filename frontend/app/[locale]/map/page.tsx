'use client';

import { useState, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Map, Compass, ShieldAlert, ChevronRight, Navigation, Sparkles } from 'lucide-react';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import NearestFacilitiesPanel from '@/components/map/NearestFacilitiesPanel';
import { useUserLocation } from '@/hooks/useUserLocation';
import { ALL_MAP_PLACES } from '@/data/seed';
import type { Place, Coordinates } from '@/types/place';

export default function MapPage() {
  const t = useTranslations('map');
  const tCrowd = useTranslations('crowdSafety');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [isMapPinMode, setIsMapPinMode] = useState<boolean>(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const {
    userLocation,
    locationSource,
    activePreset,
    userAccuracy,
    gpsError,
    isLocating,
    requestGpsLocation,
    setManualPreset,
    setCustomLocation,
    findNearestPois,
    getNearestEssentials,
  } = useUserLocation();

  // Compute nearest essentials (toilet, medical post, ghat, parking, police)
  const essentials = useMemo(() => {
    return getNearestEssentials(ALL_MAP_PLACES);
  }, [getNearestEssentials]);

  // Focus and highlight place on map
  const handleSelectPlace = (place: Place) => {
    setFocusedPlace(place);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Map tap coordinates callback
  const handleMapClickCoords = (coords: Coordinates) => {
    if (isMapPinMode) {
      setCustomLocation(coords, `Pinned (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
      setIsMapPinMode(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 sm:space-y-6">
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="h-3 w-3" />
                <span>Realtime Pilgrim Wayfinding</span>
              </div>
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
            <span>
              {locationSource === 'gps'
                ? `GPS Active ${userAccuracy ? `(±${userAccuracy}m)` : ''}`
                : activePreset
                ? activePreset.nameEn
                : 'Set Landmark'}
            </span>
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
      <div ref={mapSectionRef} className="card p-3 bg-white shadow-xl rounded-2xl border border-slate-200">
        <LeafletMapWrapper
          places={ALL_MAP_PLACES}
          userLocation={userLocation}
          locationSource={locationSource}
          userAccuracy={userAccuracy}
          focusedPlace={focusedPlace}
          onSelectPlace={setFocusedPlace}
          onMapClickCoords={handleMapClickCoords}
          isMapPinMode={isMapPinMode}
          onOpenLocationPicker={() => setIsPickerOpen(true)}
          onUserLocationChange={(coords) => setCustomLocation(coords, 'Adjusted Spot')}
          height="580px"
          initialZoom={14}
        />
      </div>

      {/* ── Nearest Facilities & Places Near You Panel ───────────────────────── */}
      <div className="animate-fade-up">
        <NearestFacilitiesPanel
          essentials={essentials}
          allPlaces={ALL_MAP_PLACES}
          userLocation={userLocation}
          locationSource={locationSource}
          userAccuracy={userAccuracy}
          activePresetName={activePreset ? (activePreset[`name${locale === 'hi' ? 'Hi' : locale === 'mr' ? 'Mr' : 'En'}`] || activePreset.nameEn) : undefined}
          onSelectPlace={handleSelectPlace}
          onOpenLocationPicker={() => setIsPickerOpen(true)}
          findNearestPois={findNearestPois}
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
        userAccuracy={userAccuracy}
        userLocation={userLocation}
        onEnableMapPinMode={() => setIsMapPinMode(true)}
        onSelectCustomCoords={setCustomLocation}
        allPlaces={ALL_MAP_PLACES}
      />
    </div>
  );
}
