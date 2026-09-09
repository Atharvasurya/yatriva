'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Coordinates, Place, PlaceCategory } from '@/types/place';

export interface PilgrimPresetLocation {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  coordinates: Coordinates;
}

export interface PlaceWithDistance extends Place {
  distanceKm: number;
  distanceFormatted: string;
}

export interface NearestEssentials {
  toilet: PlaceWithDistance | null;
  medical: PlaceWithDistance | null;
  ghat: PlaceWithDistance | null;
  parking: PlaceWithDistance | null;
  police: PlaceWithDistance | null;
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
  const [userLocation, setUserLocation] = useState<Coordinates>(
    PRESET_PILGRIM_LOCATIONS[0].coordinates // default to Ramkund Ghat
  );
  const [locationSource, setLocationSource] = useState<'gps' | 'manual'>('manual');
  const [activePreset, setActivePreset] = useState<PilgrimPresetLocation | null>(
    PRESET_PILGRIM_LOCATIONS[0]
  );
  const [userAccuracy, setUserAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isWatchingGps, setIsWatchingGps] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // Restore saved location from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('yatriva_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) {
          setUserLocation({ lat: parsed.lat, lng: parsed.lng });
          if (parsed.source) setLocationSource(parsed.source);
          if (parsed.accuracy) setUserAccuracy(parsed.accuracy);
          if (parsed.presetId) {
            const found = PRESET_PILGRIM_LOCATIONS.find((p) => p.id === parsed.presetId);
            if (found) setActivePreset(found);
          }
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Persist location updates
  const persistLocation = (coords: Coordinates, source: 'gps' | 'manual', presetId?: string, accuracy?: number | null) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'yatriva_user_location',
        JSON.stringify({
          lat: coords.lat,
          lng: coords.lng,
          source,
          presetId: presetId || null,
          accuracy: accuracy || null,
        })
      );
    } catch {
      // Ignore quota errors
    }
  };

  // Clean up watchPosition on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Stop active GPS watcher
  const stopGpsWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatchingGps(false);
  }, []);

  // Request high-accuracy real-time GPS position with automatic fallback
  const requestGpsLocation = useCallback((continuousWatch: boolean = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser or device');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    const handleSuccess = (position: GeolocationPosition) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : null;

      setUserLocation(coords);
      setUserAccuracy(accuracy);
      setLocationSource('gps');
      setActivePreset(null);
      setIsLocating(false);
      setGpsError(null);

      persistLocation(coords, 'gps', undefined, accuracy);
    };

    const handleError = (error: GeolocationPositionError, isRetry: boolean = false) => {
      if (!isRetry && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
        // Fallback: retry with lower accuracy tolerance if high accuracy satellite timed out
        console.warn('High-accuracy GPS timed out; falling back to standard accuracy...');
        navigator.geolocation.getCurrentPosition(
          (pos) => handleSuccess(pos),
          (fallbackErr) => handleError(fallbackErr, true),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
        return;
      }

      let msg = 'Unable to fetch current GPS location.';
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'Location permission denied in your browser settings. Please allow location access or select a landmark.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        msg = 'GPS signal unavailable. Please ensure Location/GPS is turned ON in your system settings.';
      } else if (error.code === error.TIMEOUT) {
        msg = 'GPS satellite request timed out. Please try again or select a nearby landmark.';
      }
      setGpsError(msg);
      setIsLocating(false);
      stopGpsWatch();
    };

    // Primary request: fresh position (maximumAge: 0) with high accuracy
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSuccess(pos);

        // Optionally start continuous real-time watch
        if (continuousWatch) {
          stopGpsWatch();
          watchIdRef.current = navigator.geolocation.watchPosition(
            (watchPos) => handleSuccess(watchPos),
            (watchErr) => console.warn('GPS Watch update warning:', watchErr.message),
            { enableHighAccuracy: true, maximumAge: 2000 }
          );
          setIsWatchingGps(true);
        }
      },
      (err) => handleError(err, false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force fresh satellite/WiFi query, NO stale cache
      }
    );
  }, [stopGpsWatch]);

  // Select a preset landmark manually (crowd fallback)
  const setManualPreset = useCallback((preset: PilgrimPresetLocation) => {
    stopGpsWatch();
    setUserLocation(preset.coordinates);
    setActivePreset(preset);
    setUserAccuracy(null);
    setLocationSource('manual');
    setGpsError(null);
    persistLocation(preset.coordinates, 'manual', preset.id, null);
  }, [stopGpsWatch]);

  // Set custom coordinates (e.g. clicking anywhere on the map)
  const setCustomLocation = useCallback((coords: Coordinates, customName: string = 'Custom Pinned Location') => {
    stopGpsWatch();
    setUserLocation(coords);
    setActivePreset({
      id: 'custom-pin',
      nameEn: customName,
      nameHi: customName,
      nameMr: customName,
      coordinates: coords,
    });
    setUserAccuracy(null);
    setLocationSource('manual');
    setGpsError(null);
    persistLocation(coords, 'manual', 'custom-pin', null);
  }, [stopGpsWatch]);

  // Find nearest POIs of a specific category from user's current location
  const findNearestPois = useCallback(
    (
      places: Place[],
      category?: PlaceCategory,
      limit: number = 5,
      maxDistanceKm?: number
    ): PlaceWithDistance[] => {
      if (!userLocation || !places || places.length === 0) return [];

      let filtered = category ? places.filter((p) => p.category === category) : places;

      const withDistances: PlaceWithDistance[] = filtered.map((p) => {
        const d = calculateDistanceKm(userLocation, p.coordinates);
        return {
          ...p,
          distanceKm: d,
          distanceFormatted: formatDistance(d),
        };
      });

      withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

      const constrained = maxDistanceKm
        ? withDistances.filter((p) => p.distanceKm <= maxDistanceKm)
        : withDistances;

      return constrained.slice(0, limit);
    },
    [userLocation]
  );

  // Compute the 4 essential nearest facilities (Toilet, Medical, Ghat, Parking, plus Police)
  const getNearestEssentials = useCallback(
    (places: Place[]): NearestEssentials => {
      if (!userLocation || !places || places.length === 0) {
        return { toilet: null, medical: null, ghat: null, parking: null, police: null };
      }

      const nearestToilet = findNearestPois(places, 'toilet', 1)[0] || null;
      const nearestMedical = findNearestPois(places, 'medical', 1)[0] || null;
      const nearestGhat = findNearestPois(places, 'ghat', 1)[0] || null;
      const nearestParking = findNearestPois(places, 'parking', 1)[0] || null;
      const nearestPolice = findNearestPois(places, 'police', 1)[0] || null;

      return {
        toilet: nearestToilet,
        medical: nearestMedical,
        ghat: nearestGhat,
        parking: nearestParking,
        police: nearestPolice,
      };
    },
    [userLocation, findNearestPois]
  );

  return {
    userLocation,
    locationSource,
    activePreset,
    userAccuracy,
    gpsError,
    isLocating,
    isWatchingGps,
    requestGpsLocation,
    stopGpsWatch,
    setManualPreset,
    setCustomLocation,
    findNearestPois,
    getNearestEssentials,
  };
}
