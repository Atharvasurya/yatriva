'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Waves, Bus, ParkingCircle, AlertTriangle, Info, MapPin, Compass, Navigation, HeartPulse, Utensils, Bath, UserPlus, ShieldCheck, X, ExternalLink, ShieldAlert
} from 'lucide-react';
import SnanDateCard from '@/components/ui/SnanDateCard';
import QuickActionTile from '@/components/ui/QuickActionTile';
import TempleIcon from '@/components/ui/TempleIcon';
import HeroSlideshow from '@/components/ui/HeroSlideshow';
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
  { key: 'temples', href: '/temples', Icon: TempleIcon, color: 'rgba(173,78,17,0.12)', textColor: 'var(--color-accent-text)' },
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
      {/* ── Hero Slideshow Section ────────────────────────────────────────── */}
      <HeroSlideshow>
        <div className="px-4 pt-6 pb-10 max-w-2xl mx-auto text-center">
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
      </HeroSlideshow>

      {/* ── Central Feature: Interactive Pilgrim Map ────────────────────────── */}
      <section className="px-4 sm:px-6 -mt-8 max-w-5xl mx-auto relative z-20" aria-label="Interactive Map">
        <div className="p-5 sm:p-6 bg-white shadow-xl rounded-2xl border border-slate-200/90 space-y-4">
          {/* Professional Card Header */}
          <div className="flex items-center justify-between px-0.5 flex-wrap gap-2.5 pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 shadow-2xs">
                <MapPin className="h-4.5 w-4.5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 leading-tight">
                  Kumbh Wayfinding Map
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified sacred landmarks, bathing ghats & pilgrim amenities
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPickerOpen(true)}
              className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 min-h-[38px] px-3.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
              <span>Change Landmark</span>
            </Button>
          </div>

          {/* Map Component Wrapper */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <LeafletMapWrapper
              places={ALL_MAP_PLACES}
              userLocation={userLocation}
              locationSource={locationSource}
              onOpenLocationPicker={() => setIsPickerOpen(true)}
              height="420px"
            />
          </div>

          {/* "Find Nearest From Your Location" Shortcut Buttons */}
          <div className="pt-1 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Find Nearest From Your Location:
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                Instant 1-tap distance calculation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {/* Nearest Toilet */}
              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'toilet' ? null : 'toilet')}
                aria-pressed={activeNearestCategory === 'toilet'}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] cursor-pointer ${
                  activeNearestCategory === 'toilet'
                    ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500/25'
                    : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-teal-50/60 hover:border-teal-300 hover:text-teal-900'
                }`}
              >
                <Bath className={`h-4 w-4 shrink-0 ${activeNearestCategory === 'toilet' ? 'text-white' : 'text-teal-600'}`} aria-hidden="true" />
                <span>Nearest Toilet</span>
              </button>

              {/* Medical Post */}
              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'medical' ? null : 'medical')}
                aria-pressed={activeNearestCategory === 'medical'}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] cursor-pointer ${
                  activeNearestCategory === 'medical'
                    ? 'bg-rose-700 text-white border-rose-800 shadow-md ring-2 ring-rose-500/25'
                    : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-rose-50/60 hover:border-rose-300 hover:text-rose-900'
                }`}
              >
                <HeartPulse className={`h-4 w-4 shrink-0 ${activeNearestCategory === 'medical' ? 'text-white' : 'text-rose-600'}`} aria-hidden="true" />
                <span>Medical Post</span>
              </button>

              {/* Nearest Ghat */}
              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'ghat' ? null : 'ghat')}
                aria-pressed={activeNearestCategory === 'ghat'}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] cursor-pointer ${
                  activeNearestCategory === 'ghat'
                    ? 'bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-500/25'
                    : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-blue-50/60 hover:border-blue-300 hover:text-blue-900'
                }`}
              >
                <Waves className={`h-4 w-4 shrink-0 ${activeNearestCategory === 'ghat' ? 'text-white' : 'text-blue-600'}`} aria-hidden="true" />
                <span>Nearest Ghat</span>
              </button>

              {/* Nearest Parking */}
              <button
                type="button"
                onClick={() => setActiveNearestCategory(activeNearestCategory === 'parking' ? null : 'parking')}
                aria-pressed={activeNearestCategory === 'parking'}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[42px] cursor-pointer ${
                  activeNearestCategory === 'parking'
                    ? 'bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/25'
                    : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-amber-50/60 hover:border-amber-300 hover:text-amber-900'
                }`}
              >
                <ParkingCircle className={`h-4 w-4 shrink-0 ${activeNearestCategory === 'parking' ? 'text-white' : 'text-amber-600'}`} aria-hidden="true" />
                <span>Nearest Parking</span>
              </button>
            </div>
          </div>

          {/* Nearest Results Drawer */}
          {activeNearestCategory && (
            <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Nearest {activeNearestCategory === 'toilet' ? 'Sanitation Facilities' : activeNearestCategory === 'medical' ? 'Medical Posts' : activeNearestCategory === 'ghat' ? 'Sacred Bathing Ghats' : 'Parking Zones'}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    {nearestItems.length} Found
                  </span>
                </div>
                <button
                  onClick={() => setActiveNearestCategory(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors focus-visible:outline-none min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer"
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
                      className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                          {item.name[locale] || item.name.en}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <Navigation className="h-2.5 w-2.5 text-amber-600" />
                            <span>{formatDistance(item.distanceKm)} away</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                            • ~{Math.max(1, Math.ceil(item.distanceKm * 12))} min walk
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl text-white text-xs font-bold min-h-[38px] inline-flex items-center gap-1.5 bg-slate-900 hover:bg-amber-600 active:scale-95 transition-all shadow-xs shrink-0"
                      >
                        <span>Directions</span>
                        <ExternalLink className="h-3 w-3 opacity-80" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <p className="text-xs font-bold text-slate-900">
                    No nearby {activeNearestCategory} locations found from current landmark
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm mx-auto">
                    No verified {activeNearestCategory} points are registered within 10 km of your selected landmark. Select a different landmark or view all points on the wayfinding map.
                  </p>
                  <button
                    onClick={() => setIsPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold min-h-[38px] hover:brightness-110 active:scale-95 transition-all shadow-xs cursor-pointer"
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
        className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-4"
        aria-labelledby="snan-heading"
      >
        <div className="flex items-center gap-2">
          <Waves className="h-4.5 w-4.5 text-amber-600" aria-hidden="true" />
          <h2
            id="snan-heading"
            className="text-sm sm:text-base font-black uppercase tracking-widest"
            style={{ color: 'var(--color-primary)' }}
          >
            {t('snanSectionTitle')}
          </h2>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
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
      <section className="px-4 sm:px-6 py-3 max-w-5xl mx-auto w-full">
        <div
          className="p-5 sm:p-7 rounded-2xl text-white shadow-lg flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)' }}
        >
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="p-3 rounded-xl bg-white/10 shrink-0 mt-0.5 shadow-inner">
              <UserPlus className="h-6 w-6 text-amber-300" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg text-white">Family & Group Safety Registration</h3>
                <Badge variant="warning">Optional</Badge>
              </div>
              <p className="text-white/85 text-xs leading-relaxed">
                Create free printable ID cards with QR codes for children and elderly family members to prevent separation during crowd surges.
              </p>
            </div>
          </div>

          <a
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95 min-h-[42px] hover:brightness-110 focus-visible:outline-none"
            style={{ background: '#AD4E11' }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Register Group for Safety →</span>
          </a>
        </div>
      </section>

      {/* ── Crowd-Crush & Surge Safety Advisory Card ───────────────────────── */}
      <section className="px-4 sm:px-6 py-2 max-w-5xl mx-auto w-full">
        <Link
          href={`/${locale}/crowd-safety`}
          prefetch={true}
          className="block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/90 hover:border-red-400/90 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                    Pilgrim Advisory
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">30-sec safety rules</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-red-700 transition-colors">
                  Crowd-Crush & Surge Safety: 5 Life-Saving Rules
                </h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Read Guide</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </section>

      {/* ── Quick Guide Grid ──────────────────────────────────────────────── */}
      <section
        id="quick-guide"
        className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-4"
        aria-labelledby="quick-guide-heading"
      >
        <h2
          id="quick-guide-heading"
          className="text-sm sm:text-base font-black uppercase tracking-widest"
          style={{ color: 'var(--color-primary)' }}
        >
          {t('quickGuideTitle')}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
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

      {/* ── Nashik Darshan Video Virtual Tour ──────────────────────────────── */}
      <NashikDarshanVideo />

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
