'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  Bath,
  HeartPulse,
  Waves,
  ParkingCircle,
  Shield,
  Navigation,
  ExternalLink,
  MapPin,
  Compass,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { Place, PlaceCategory, Coordinates } from '@/types/place';
import type { NearestEssentials, PlaceWithDistance } from '@/hooks/useUserLocation';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import TempleIcon from '@/components/ui/TempleIcon';

interface NearestFacilitiesPanelProps {
  essentials: NearestEssentials;
  allPlaces: Place[];
  userLocation: Coordinates | null;
  locationSource: 'gps' | 'manual';
  userAccuracy?: number | null;
  activePresetName?: string;
  onSelectPlace: (place: Place) => void;
  onOpenLocationPicker: () => void;
  findNearestPois: (
    places: Place[],
    category?: PlaceCategory,
    limit?: number,
    maxDistanceKm?: number
  ) => PlaceWithDistance[];
}

export default function NearestFacilitiesPanel({
  essentials,
  allPlaces,
  userLocation,
  locationSource,
  userAccuracy,
  activePresetName,
  onSelectPlace,
  onOpenLocationPicker,
  findNearestPois,
}: NearestFacilitiesPanelProps) {
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const [activeTab, setActiveTab] = useState<'essentials' | 'all-near'>('essentials');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(3); // 3 km default walking/transit zone

  // Compute all nearby places sorted by distance within chosen radius
  const nearbyPlaces = useMemo(() => {
    if (!userLocation) return [];
    const cat = selectedCategory === 'all' ? undefined : selectedCategory;
    return findNearestPois(allPlaces, cat, 20, maxRadiusKm);
  }, [allPlaces, userLocation, selectedCategory, maxRadiusKm, findNearestPois]);

  const essentialCards = [
    {
      id: 'toilet',
      title: locale === 'hi' ? 'निकटतम शौचालय' : locale === 'mr' ? 'जवळचे स्वच्छतागृह' : 'Nearest Toilet',
      item: essentials.toilet,
      Icon: Bath,
      color: '#0D9488',
      bgClass: 'bg-teal-50 border-teal-200 text-teal-900',
      iconBg: 'bg-teal-600 text-white',
    },
    {
      id: 'medical',
      title: locale === 'hi' ? 'निकटतम चिकित्सा केंद्र' : locale === 'mr' ? 'जवळचे वैद्यकीय केंद्र' : 'Nearest Medical Post',
      item: essentials.medical,
      Icon: HeartPulse,
      color: '#DC2626',
      bgClass: 'bg-rose-50 border-rose-200 text-rose-900',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'ghat',
      title: locale === 'hi' ? 'निकटतम स्नान घाट' : locale === 'mr' ? 'जवळचा स्नान घाट' : 'Nearest Ghat',
      item: essentials.ghat,
      Icon: Waves,
      color: '#2D5FA8',
      bgClass: 'bg-blue-50 border-blue-200 text-blue-900',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'parking',
      title: locale === 'hi' ? 'निकटतम पार्किंग' : locale === 'mr' ? 'जवळचे वाहनतळ' : 'Nearest Parking',
      item: essentials.parking,
      Icon: ParkingCircle,
      color: '#C9A227',
      bgClass: 'bg-amber-50 border-amber-200 text-amber-900',
      iconBg: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Current User Location Status Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
              locationSource === 'gps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-orange-500 text-white shadow-sm'
            }`}
          >
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Your Current Reference Point:
              </span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  locationSource === 'gps'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {locationSource === 'gps'
                  ? `Live GPS ${userAccuracy ? `(±${userAccuracy}m)` : ''}`
                  : 'Selected Landmark'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-navy-800 mt-0.5" style={{ color: '#1B2B4B' }}>
              {locationSource === 'gps'
                ? userLocation
                  ? `Realtime Coordinates (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                  : 'Detecting Location...'
                : activePresetName || 'Ramkund Ghat, Nashik'}
            </h3>
          </div>
        </div>

        <button
          onClick={onOpenLocationPicker}
          className="px-4 py-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-white text-slate-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 min-h-[38px]"
        >
          <MapPin className="h-3.5 w-3.5 text-saffron-600" style={{ color: '#E87722' }} />
          <span>Change Location</span>
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('essentials')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'essentials'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
            style={activeTab === 'essentials' ? { background: '#1B2B4B' } : {}}
          >
            4 Essential Facilities (Nearest)
          </button>
          <button
            onClick={() => setActiveTab('all-near')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all-near'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
            style={activeTab === 'all-near' ? { background: '#1B2B4B' } : {}}
          >
            Browse All Pins Near You ({nearbyPlaces.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: 4 Essential Facilities (Toilet, Medical, Ghat, Parking) ── */}
      {activeTab === 'essentials' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
          {essentialCards.map((card) => {
            const { id, title, item, Icon, color, bgClass, iconBg } = card;

            if (!item) {
              return (
                <div
                  key={id}
                  className={`p-4 rounded-2xl border ${bgClass} flex flex-col justify-between opacity-80`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold">{title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">No pin found nearby</p>
                </div>
              );
            }

            const itemName = item.name[locale] || item.name.en;

            return (
              <div
                key={id}
                className={`p-4 rounded-2xl border ${bgClass} shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${iconBg} shadow-2xs`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                        {title}
                      </span>
                    </div>

                    {/* Distance Pill */}
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white text-slate-900 shadow-2xs border border-slate-200 shrink-0">
                      {item.distanceFormatted}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 mt-1" title={itemName}>
                    {itemName}
                  </h4>

                  {item.description?.[locale] && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                      {item.description[locale]}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <ConfidenceBadge
                      confidence={item.locationConfidence}
                      verified={item.verified}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPlace(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-navy-900 transition-colors py-1 cursor-pointer"
                  >
                    <span>Show on Map</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-2xs border border-slate-200 transition-all active:scale-95"
                    title="Navigate in Google Maps"
                    aria-label={`Navigate to ${itemName}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 2: Browse All Pins Near You ── */}
      {activeTab === 'all-near' && (
        <div className="space-y-3 animate-fade-in">
          {/* Filters Bar */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {(['toilet', 'medical', 'ghat', 'parking', 'temple', 'police'] as PlaceCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Radius filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold">Radius:</span>
              {[1, 3, 5, 10].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setMaxRadiusKm(radius)}
                  className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                    maxRadiusKm === radius
                      ? 'bg-saffron-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={maxRadiusKm === radius ? { background: '#E87722' } : {}}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>

          {/* List of Nearby Pins */}
          {nearbyPlaces.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
              <Compass className="h-8 w-8 mx-auto mb-2 text-slate-400 opacity-60" />
              <p className="text-sm font-bold">No places found within {maxRadiusKm} km</p>
              <p className="text-xs text-slate-400 mt-1">Try expanding the radius or changing your location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {nearbyPlaces.map((place) => {
                const name = place.name[locale] || place.name.en;

                return (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                          {place.category}
                        </span>
                        <span className="text-[11px] font-extrabold text-saffron-600" style={{ color: '#E87722' }}>
                          {place.distanceFormatted} away
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {name}
                      </h4>

                      {place.description?.[locale] && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {place.description[locale]}
                        </p>
                      )}

                      <div className="mt-2">
                        <ConfidenceBadge
                          confidence={place.locationConfidence}
                          verified={place.verified}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
