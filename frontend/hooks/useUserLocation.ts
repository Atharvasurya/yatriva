'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Coordinates, Place, PlaceCategory } from '@/types/place';

export interface PilgrimPresetLocation {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  coordinates: Coordinates;
}

export const PRESET_PILGRIM_LOCATIONS: PilgrimPresetLocation[] = [
  {
    id: 'loc-ramkund',
    nameEn: 'Ramkund Ghat, Nashik',
    nameHi: 'रामकुंड घाट, नाशिक',
    nameMr: 'रामकुंड घाट, नाशिक',
    coordinates: { lat: 20.0063, lng: 73.7915 },
  },
  {
    id: 'loc-panchvati',
    nameEn: 'Panchavati & Kalaram Mandir',
    nameHi: 'पंचवटी एवं कालाराम मंदिर',
    nameMr: 'पंचवटी व काळाराम मंदिर',
    coordinates: { lat: 20.0076, lng: 73.7942 },
  },
  {
    id: 'loc-trimbakeshwar',
    nameEn: 'Trimbakeshwar & Kushavarta Kund',
    nameHi: 'त्र्यंबकेश्वर एवं कुशावर्त कुंड',
    nameMr: 'त्र्यंबकेश्वर व कुशावर्त कुंड',
    coordinates: { lat: 19.9325, lng: 73.5306 },
  },
  {
    id: 'loc-tapovan',
    nameEn: 'Tapovan Sadhugram Hub',
    nameHi: 'तपोवन साधुग्राम केंद्र',
    nameMr: 'तपोवन साधुग्राम परिसर',
    coordinates: { lat: 19.9942, lng: 73.8185 },
  },
  {
    id: 'loc-cbs',
    nameEn: 'CBS Central Bus Stand',
    nameHi: 'सीबीएस सेंट्रल बस स्टैंड',
    nameMr: 'सीबीएस मध्यवर्ती बस स्थानक',
    coordinates: { lat: 19.9972, lng: 73.7845 },
  },
  {
    id: 'loc-nashik-road',
    nameEn: 'Nashik Road Railway Station',
    nameHi: 'नाशिक रोड रेलवे स्टेशन',
    nameMr: 'नाशिक रोड रेल्वे स्टेशन',
    coordinates: { lat: 19.9576, lng: 73.8344 },
  },
];

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance in km or meters for UI display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(
    PRESET_PILGRIM_LOCATIONS[0].coordinates // default to Ramkund Ghat
  );
  const [locationSource, setLocationSource] = useState<'gps' | 'manual'>('manual');
  const [activePreset, setActivePreset] = useState<PilgrimPresetLocation | null>(
    PRESET_PILGRIM_LOCATIONS[0]
  );
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Request GPS position from browser
  const requestGpsLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationSource('gps');
        setActivePreset(null);
        setIsLocating(false);
      },
      (error) => {
        let msg = 'Unable to get location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please select a landmark manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable in crowd area. Switched to manual picker.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS request timed out. Switched to manual picker.';
        }
        setGpsError(msg);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Select a preset location manually (crowd fallback)
  const setManualPreset = useCallback((preset: PilgrimPresetLocation) => {
    setUserLocation(preset.coordinates);
    setActivePreset(preset);
    setLocationSource('manual');
    setGpsError(null);
  }, []);

  // Find nearest POI of a specific category from user's current location
  const findNearestPois = useCallback(
    (places: Place[], category?: PlaceCategory, limit: number = 3): Array<Place & { distanceKm: number }> => {
      if (!userLocation) return [];

      const filtered = category ? places.filter((p) => p.category === category) : places;

      const withDistances = filtered.map((p) => ({
        ...p,
        distanceKm: calculateDistanceKm(userLocation, p.coordinates),
      }));

      withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

      return withDistances.slice(0, limit);
    },
    [userLocation]
  );

  return {
    userLocation,
    locationSource,
    activePreset,
    gpsError,
    isLocating,
    requestGpsLocation,
    setManualPreset,
    findNearestPois,
  };
}
