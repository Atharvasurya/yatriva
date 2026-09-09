'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import {
  MapPin,
  Navigation,
  X,
  Check,
  ShieldAlert,
  Radio,
  Search,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { PRESET_PILGRIM_LOCATIONS, PilgrimPresetLocation } from '@/hooks/useUserLocation';
import type { Coordinates, Place } from '@/types/place';

interface SearchResultItem {
  id: string;
  name: string;
  detail?: string;
  coordinates: Coordinates;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PilgrimPresetLocation) => void;
  onRequestGps: (continuousWatch?: boolean) => void;
  currentSource: 'gps' | 'manual';
  activePresetId?: string;
  gpsError?: string | null;
  isLocating?: boolean;
  userAccuracy?: number | null;
  userLocation?: Coordinates | null;
  onEnableMapPinMode?: () => void;
  onSelectCustomCoords?: (coords: Coordinates, name: string) => void;
  allPlaces?: Place[];
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectPreset,
  onRequestGps,
  currentSource,
  activePresetId,
  gpsError,
  isLocating = false,
  userAccuracy,
  userLocation,
  onEnableMapPinMode,
  onSelectCustomCoords,
  allPlaces = [],
}: LocationPickerModalProps) {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Realtime search: immediate local matches + debounced OpenStreetMap Nominatim geocoding
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // 1. Immediate local matching (0ms latency)
    const localMatches: SearchResultItem[] = [];
    const lower = q.toLowerCase();

    // Check presets
    PRESET_PILGRIM_LOCATIONS.forEach((p) => {
      const name = p[`name${locale === 'hi' ? 'Hi' : locale === 'mr' ? 'Mr' : 'En'}`] || p.nameEn;
      if (name.toLowerCase().includes(lower) || p.nameEn.toLowerCase().includes(lower)) {
        localMatches.push({
          id: p.id,
          name,
          detail: 'Preset Landmark • Nashik',
          coordinates: p.coordinates,
        });
      }
    });

    // Check POIs in dataset
    allPlaces.forEach((p) => {
      const name = p.name[locale] || p.name.en;
      if (
        name.toLowerCase().includes(lower) ||
        p.name.en.toLowerCase().includes(lower) ||
        (p.address && p.address.toLowerCase().includes(lower))
      ) {
        if (!localMatches.some((m) => m.name === name)) {
          localMatches.push({
            id: p.id,
            name,
            detail: p.address || `${p.category.toUpperCase()} • Nashik`,
            coordinates: p.coordinates,
          });
        }
      }
    });

    setSearchResults(localMatches.slice(0, 6));

    // 2. Realtime online geocoding (debounced 300ms) for any custom street, locality, or landmark
    setIsSearching(true);
    const timer = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const queryWithContext = lower.includes('nashik') || lower.includes('trimbak')
          ? q
          : `${q}, Nashik`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            queryWithContext
          )}&limit=5&addressdetails=1`,
          {
            signal: controller.signal,
            headers: {
              'Accept-Language': locale === 'mr' ? 'mr,hi,en' : locale === 'hi' ? 'hi,en' : 'en',
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const geoMatches: SearchResultItem[] = data.map((item: { place_id: number; display_name: string; lat: string; lon: string }) => ({
            id: `geo-${item.place_id}`,
            name: item.display_name.split(',')[0].trim(),
            detail: item.display_name.split(',').slice(1, 3).join(',').trim() || 'Nashik, Maharashtra',
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
          }));

          // Merge without duplicates
          const combined = [...localMatches];
          geoMatches.forEach((geo) => {
            if (!combined.some((c) => c.name.toLowerCase() === geo.name.toLowerCase())) {
              combined.push(geo);
            }
          });
          setSearchResults(combined.slice(0, 6));
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          // Keep local results if network failed
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery, locale, allPlaces]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="picker-title"
      >
        {/* Handle pill for mobile dragging UI */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2
              id="picker-title"
              className="font-bold text-base sm:text-lg text-slate-900"
            >
              Choose Location
            </h2>
            <p className="text-xs text-slate-500">
              Find facilities and ghats near you
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Custom Location Search with Realtime Dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom area, hotel, street, or landmark..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100 border border-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3 h-4 w-4 text-saffron-600 animate-spin" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Realtime Floating Dropdown */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-fade-down max-h-56 flex flex-col">
              <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider bg-slate-50/70 shrink-0">
                <span>Matching Locations</span>
                {isSearching && (
                  <span className="flex items-center gap-1 text-saffron-600 normal-case font-semibold">
                    Searching...
                  </span>
                )}
              </div>
              <div className="overflow-y-auto divide-y divide-slate-100 p-1 flex-1 scrollbar-thin">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      onSelectCustomCoords?.(result.coordinates, result.name);
                      setSearchQuery('');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-orange-50 group-hover:text-saffron-600 text-slate-500 flex items-center justify-center shrink-0 transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {result.name}
                        </p>
                        {result.detail && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {result.detail}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-saffron-600 bg-orange-50 group-hover:bg-orange-100 px-2.5 py-1 rounded-full shrink-0 ml-2 transition-colors">
                      Select
                    </span>
                  </button>
                ))}
                {!isSearching && searchResults.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching location found. Try typing a street or area name.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: Use Current Location (Clean & Simple) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onRequestGps(true);
              setTimeout(() => {
                onClose();
              }, 400);
            }}
            disabled={isLocating}
            className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              currentSource === 'gps'
                ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  currentSource === 'gps'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Navigation
                  className={`h-4.5 w-4.5 ${isLocating ? 'animate-spin' : ''}`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Use Current Location
                  </span>
                  {currentSource === 'gps' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      <Radio className="h-2 w-2 text-blue-600 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {isLocating
                    ? 'Getting your location...'
                    : currentSource === 'gps'
                    ? 'Using live GPS position'
                    : 'Find nearest facilities around you'}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                currentSource === 'gps'
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              }`}
            >
              {isLocating ? 'Locating...' : currentSource === 'gps' ? 'Refresh' : 'Locate'}
            </span>
          </button>

          {/* Optional Pin on Map Action */}
          {onEnableMapPinMode && (
            <button
              type="button"
              onClick={() => {
                onEnableMapPinMode();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-saffron-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-4.5 w-4.5" style={{ color: '#E87722' }} />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    Choose on Map
                  </span>
                  <span className="text-xs text-slate-500">
                    Click anywhere to drop a pin
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">Choose →</span>
            </button>
          )}

          {/* GPS Error Message */}
          {gpsError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <p className="flex-1">{gpsError}</p>
            </div>
          )}
        </div>

        {/* Preset Landmarks Section */}
        <div className="pt-2 border-t border-slate-100 flex-1 overflow-hidden flex flex-col">
          <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Popular Landmarks
          </span>

          <div className="space-y-1 overflow-y-auto pr-1 flex-1 scrollbar-thin">
            {PRESET_PILGRIM_LOCATIONS.map((preset) => {
              const isSelected = currentSource === 'manual' && activePresetId === preset.id;
              const name =
                locale === 'hi'
                  ? preset.nameHi
                  : locale === 'mr'
                  ? preset.nameMr
                  : preset.nameEn;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate text-xs sm:text-sm">{name}</span>
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
