'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Waves, Church, Bus, ParkingCircle, AlertTriangle, Info, MapPin, Compass, Navigation, HeartPulse, Utensils, Bath, UserPlus, ShieldCheck
} from 'lucide-react';
import SnanDateCard from '@/components/ui/SnanDateCard';
import QuickActionTile from '@/components/ui/QuickActionTile';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import { useUserLocation, formatDistance, PRESET_PILGRIM_LOCATIONS } from '@/hooks/useUserLocation';
import { SNAN_DATES, ALL_MAP_PLACES } from '@/data/seed';
import type { PlaceCategory } from '@/types/place';

const QUICK_ACTIONS = [
  { key: 'ghats', href: '/ghats', Icon: Waves, color: 'rgba(91,155,213,0.15)', textColor: '#2D5FA8' },
  { key: 'temples', href: '/temples', Icon: Church, color: 'rgba(232,119,34,0.12)', textColor: '#C2581A' },
  { key: 'transport', href: '/transport', Icon: Bus, color: 'rgba(27,43,75,0.08)', textColor: '#1B2B4B' },
  { key: 'parking', href: '/parking', Icon: ParkingCircle, color: 'rgba(201,162,39,0.12)', textColor: '#9A7208' },
  { key: 'emergency', href: '/emergency', Icon: AlertTriangle, color: 'rgba(220,38,38,0.10)', textColor: '#B91C1C' },
  { key: 'about', href: '/about', Icon: Info, color: 'rgba(91,155,213,0.10)', textColor: '#2D5FA8' },
] as const;

export default function HomePageContent() {
  const t = useTranslations('home');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeNearestCategory, setActiveNearestCategory] = useState<PlaceCategory | null>(null);

  const {
    userLocation,
    locationSource,
    activePreset,
    gpsError,
    isLocating,
    requestGpsLocation,
    setManualPreset,
    findNearestPois,
  } = useUserLocation();

  // Find nearest POIs for quick section
  const nearestItems = activeNearestCategory
    ? findNearestPois(ALL_MAP_PLACES, activeNearestCategory, 3)
    : [];

  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden hero-silhouette"
        aria-labelledby="hero-heading"
        style={{
          background: 'linear-gradient(180deg, #0F1E35 0%, #1B2B4B 35%, #2D4A7A 65%, #4A2E10 100%)',
          minHeight: '260px',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(232,119,34,0.25) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-5 pt-8 pb-12 max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#E87722' }}>
            {t('heroTagline')}
          </p>

          <h1
            id="hero-heading"
            className="text-white font-black text-3xl sm:text-4xl leading-tight mb-2"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            {t('heroSubtitle')}
          </h1>

          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-4">
            {t('heroDescription')}
          </p>

          {/* Location Bar Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold">
            <Compass className="h-4 w-4 text-saffron-400" />
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-saffron-400 shrink-0" />
              {locationSource === 'gps'
                ? 'Live GPS Location Active'
                : `Selected: ${activePreset?.nameEn || 'Ramkund Ghat'}`}
            </span>
            <button
              onClick={() => setIsPickerOpen(true)}
              className="ml-2 text-saffron-400 font-bold underline hover:text-white transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* ── Central Feature: Interactive Pilgrim Map ────────────────────────── */}
      <section className="px-4 -mt-6 max-w-4xl mx-auto relative z-20" aria-label="Interactive Map">
        <div className="card p-3 sm:p-4 bg-white shadow-xl rounded-2xl space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
              <h2 className="text-base font-black text-navy-800 uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
                Kumbh Wayfinding Map
              </h2>
            </div>

            <button
              onClick={() => setIsPickerOpen(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-navy-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Location Picker</span>
            </button>
          </div>

          {/* Map Component Wrapper */}
          <LeafletMapWrapper
            places={ALL_MAP_PLACES}
            userLocation={userLocation}
            locationSource={locationSource}
            onOpenLocationPicker={() => setIsPickerOpen(true)}
            height="420px"
          />

          {/* "Find Nearest X from Here" Quick Shortcut Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-1">
              Find Nearest From Your Location:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'toilet' ? null : 'toilet')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'toilet'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bath className="h-4 w-4 shrink-0" />
                <span>Nearest Toilet</span>
              </button>

              <button
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'medical' ? null : 'medical')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'medical'
                    ? 'bg-red-600 text-white border-red-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HeartPulse className="h-4 w-4 shrink-0" />
                <span>Medical Post</span>
              </button>

              <button
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'ghat' ? null : 'ghat')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'ghat'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Waves className="h-4 w-4 shrink-0" />
                <span>Nearest Ghat</span>
              </button>

              <button
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'food' ? null : 'food')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'food'
                    ? 'bg-green-700 text-white border-green-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Utensils className="h-4 w-4 shrink-0" />
                <span>Free Meals</span>
              </button>
            </div>
          </div>

          {/* Nearest Results Drawer */}
          {activeNearestCategory && nearestItems.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-up">
              <h3 className="text-xs font-bold text-navy-800 flex items-center justify-between">
                <span>Nearest {activeNearestCategory.toUpperCase()} Locations</span>
                <button
                  onClick={() => setActiveNearestCategory(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </h3>
              <div className="space-y-2">
                {nearestItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-xs text-navy-800">{item.name[locale] || item.name.en}</p>
                      <p className="text-[11px] font-semibold text-saffron-600">
                        {formatDistance(item.distanceKm)} away
                      </p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md bg-navy-800 text-white text-xs font-bold"
                    >
                      Maps
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Snan Dates Section ────────────────────────────────────────────── */}
      <section
        id="snan-dates"
        className="px-4 py-6 max-w-4xl mx-auto w-full"
        aria-labelledby="snan-heading"
      >
        <h2
          id="snan-heading"
          className="text-base font-black uppercase tracking-widest mb-4 flex items-center gap-2"
          style={{ color: '#1B2B4B' }}
        >
          <Waves className="h-5 w-5" style={{ color: '#E87722' }} aria-hidden="true" />
          {t('snanSectionTitle')}
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {SNAN_DATES.map((snan, i) => (
            <SnanDateCard
              key={snan.id}
              snanKey={snan.labelKey as 'snan1' | 'snan2' | 'snan3'}
              isoDate={snan.date}
              isoEndDate={snan.endDate ?? undefined}
              verified={snan.verified}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ── Family & Group Safety Registration Banner ─────────────────────── */}
      <section className="px-4 py-2 max-w-4xl mx-auto w-full">
        <div
          className="card p-5 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-700 text-white shadow-lg flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)' }}
        >
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="p-3 rounded-xl bg-white/10 shrink-0 mt-0.5">
              <UserPlus className="h-6 w-6 text-saffron-400" style={{ color: '#E87722' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">Family & Group Safety Registration</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  Optional
                </span>
              </div>
              <p className="text-white/80 text-xs mt-1 leading-relaxed">
                Create free printable ID cards with QR codes for children and elderly family members to prevent separation during crowd surges.
              </p>
            </div>
          </div>

          <a
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 min-h-[44px]"
            style={{ background: '#E87722' }}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Register Group for Safety →</span>
          </a>
        </div>
      </section>

      {/* ── Quick Guide Grid ──────────────────────────────────────────────── */}
      <section
        id="quick-guide"
        className="px-4 pb-6 max-w-4xl mx-auto w-full"
        aria-labelledby="quick-guide-heading"
      >
        <h2
          id="quick-guide-heading"
          className="text-base font-black uppercase tracking-widest mb-4"
          style={{ color: '#1B2B4B' }}
        >
          {t('quickGuideTitle')}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map(({ key, href, Icon, color, textColor }, i) => (
            <QuickActionTile
              key={key}
              href={href}
              label={t(`tiles.${key}`)}
              description={t(`tilesDescription.${key}`)}
              Icon={Icon}
              color={color}
              textColor={textColor}
              index={i}
            />
          ))}
        </div>
      </section>

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
    </>
  );
}
