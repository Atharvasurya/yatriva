'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Waves, Church, Bus, ParkingCircle, AlertTriangle, Info, MapPin, Compass, Navigation, HeartPulse, Utensils, Bath, UserPlus, ShieldCheck, X, ExternalLink
} from 'lucide-react';
import SnanDateCard from '@/components/ui/SnanDateCard';
import QuickActionTile from '@/components/ui/QuickActionTile';
import NashikDarshanVideo from '@/components/ui/NashikDarshanVideo';
import LeafletMapWrapper from '@/components/map/LeafletMapWrapper';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import { Button } from '@/components/ds/Button';
import { Badge } from '@/components/ds/Badge';
import { useUserLocation, formatDistance } from '@/hooks/useUserLocation';
import { SNAN_DATES, ALL_MAP_PLACES } from '@/data/seed';
import type { PlaceCategory } from '@/types/place';

const QUICK_ACTIONS = [
  { key: 'ghats', href: '/ghats', Icon: Waves, color: 'rgba(27,43,75,0.08)', textColor: 'var(--color-primary)' },
  { key: 'temples', href: '/temples', Icon: Church, color: 'rgba(173,78,17,0.12)', textColor: 'var(--color-accent-text)' },
  { key: 'transport', href: '/transport', Icon: Bus, color: 'rgba(27,43,75,0.08)', textColor: 'var(--color-primary)' },
  { key: 'parking', href: '/parking', Icon: ParkingCircle, color: 'rgba(173,78,17,0.12)', textColor: 'var(--color-accent-text)' },
  { key: 'emergency', href: '/emergency', Icon: AlertTriangle, color: 'rgba(220,38,38,0.10)', textColor: '#B91C1C' },
  { key: 'about', href: '/about', Icon: Info, color: 'rgba(27,43,75,0.08)', textColor: 'var(--color-primary)' },
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
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat shadow-inner"
        aria-labelledby="hero-heading"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.25) 50%, rgba(15, 23, 42, 0.65) 100%), url('/images/godaghat_hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          minHeight: '340px',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20 shimmer-effect"
          aria-hidden="true"
        />

        <div className="relative z-10 px-5 pt-10 pb-16 max-w-2xl mx-auto text-center">
          <p
            className="text-xs font-black uppercase tracking-[0.2em] mb-2 animate-fade-down text-amber-300 drop-shadow-md"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {t('heroTagline')}
          </p>

          <h1
            id="hero-heading"
            className="text-white font-black text-3xl sm:text-5xl leading-tight mb-2.5 animate-fade-up delay-100 drop-shadow-xl"
            style={{ textShadow: '0 3px 15px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {t('heroSubtitle')}
          </h1>

          <p
            className="text-white font-semibold text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6 animate-fade-up delay-200 drop-shadow-md"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          >
            {t('heroDescription')}
          </p>

          {/* Location Bar Pill */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/25 text-white text-xs font-semibold min-h-[44px] shadow-lg animate-fade-up delay-300 hover:bg-white/20 transition-all">
            <Compass className="h-4 w-4 text-amber-400 shrink-0 animate-spin-slow" />
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              {locationSource === 'gps'
                ? 'Live GPS Location Active'
                : `Selected: ${activePreset?.nameEn || 'Ramkund Ghat'}`}
            </span>
            <button
              onClick={() => setIsPickerOpen(true)}
              className="ml-2 text-amber-300 font-bold underline hover:text-white transition-colors py-1 px-1.5 rounded focus-visible:outline-none cursor-pointer"
              aria-label="Change current landmark location"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* ── Central Feature: Interactive Pilgrim Map ────────────────────────── */}
      <section className="px-4 -mt-6 max-w-4xl mx-auto relative z-20" aria-label="Interactive Map">
        <div className="card p-4 sm:p-5 bg-white shadow-xl rounded-[var(--radius-card)] space-y-4">
          <div className="flex items-center justify-between px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-saffron-500" style={{ color: '#AD4E11' }} aria-hidden="true" />
              <h2 className="text-base font-black uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Kumbh Wayfinding Map
              </h2>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPickerOpen(true)}
              className="border border-slate-200 text-xs text-slate-700 min-h-[44px]"
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Location Picker</span>
            </Button>
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5 px-1">
              Find Nearest From Your Location:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'toilet' ? null : 'toilet')}
                aria-pressed={activeNearestCategory === 'toilet'}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'toilet'
                    ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                    : 'bg-[var(--color-surface-alt)] border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Bath className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Nearest Toilet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'medical' ? null : 'medical')}
                aria-pressed={activeNearestCategory === 'medical'}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'medical'
                    ? 'bg-red-700 text-white border-red-800 shadow-sm'
                    : 'bg-[var(--color-surface-alt)] border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <HeartPulse className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Medical Post</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'ghat' ? null : 'ghat')}
                aria-pressed={activeNearestCategory === 'ghat'}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'ghat'
                    ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                    : 'bg-[var(--color-surface-alt)] border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Waves className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Nearest Ghat</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'parking' ? null : 'parking')}
                aria-pressed={activeNearestCategory === 'parking'}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  activeNearestCategory === 'parking'
                    ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                    : 'bg-[var(--color-surface-alt)] border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ParkingCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                <span>Nearest Parking</span>
              </button>
            </div>
          </div>

          {/* Nearest Results Drawer / Direct Empty State */}
          {activeNearestCategory && (
            <div className="p-4 bg-[var(--color-surface-alt)] rounded-xl border border-slate-200 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                  Nearest {activeNearestCategory.toUpperCase()} Locations
                </h3>
                <button
                  onClick={() => setActiveNearestCategory(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="Close nearest list"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {nearestItems.length > 0 ? (
                <div className="space-y-2">
                  {nearestItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                          {item.name[locale] || item.name.en}
                        </p>
                        <p className="text-[11px] font-bold" style={{ color: '#AD4E11' }}>
                          {formatDistance(item.distanceKm)} away
                        </p>
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg text-white text-xs font-bold min-h-[44px] inline-flex items-center gap-1 hover:brightness-90 transition-all"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        <span>Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center bg-white rounded-lg border border-slate-200 space-y-2">
                  <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    No nearby {activeNearestCategory} locations found from current landmark
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm mx-auto">
                    No verified {activeNearestCategory} points are registered within 10 km of your selected landmark. Select a different landmark or view all points on the wayfinding map.
                  </p>
                  <button
                    onClick={() => setIsPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold min-h-[44px] hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Change Landmark</span>
                  </button>
                </div>
              )}
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
          style={{ color: 'var(--color-primary)' }}
        >
          <Waves className="h-5 w-5" style={{ color: '#AD4E11' }} aria-hidden="true" />
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

      {/* ── Nashik Darshan Video Virtual Tour ──────────────────────────────── */}
      <NashikDarshanVideo />

      {/* ── Family & Group Safety Registration Banner ─────────────────────── */}
      <section className="px-4 py-2 max-w-4xl mx-auto w-full">
        <div
          className="card p-6 rounded-[var(--radius-card)] text-white shadow-lg flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)' }}
        >
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="p-3 rounded-xl bg-white/10 shrink-0 mt-0.5">
              <UserPlus className="h-6 w-6 text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">Family & Group Safety Registration</h3>
                <Badge variant="warning">Optional</Badge>
              </div>
              <p className="text-white/80 text-xs mt-1 leading-relaxed">
                Create free printable ID cards with QR codes for children and elderly family members to prevent separation during crowd surges.
              </p>
            </div>
          </div>

          <a
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-xs shadow-md transition-all active:scale-95 min-h-[44px] hover:brightness-95 focus-visible:outline-none"
            style={{ background: '#AD4E11' }}
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
          style={{ color: 'var(--color-primary)' }}
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
