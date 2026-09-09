'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import {
  Waves, Landmark, ParkingCircle, Bus, HeartPulse, Shield, Bath, Utensils, Info, MapPin, Navigation, ExternalLink, X, Compass, BookOpen, AlertTriangle, LocateFixed, Maximize2
} from 'lucide-react';
import TempleIcon from '@/components/ui/TempleIcon';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import type { Place, PlaceCategory, Coordinates } from '@/types/place';
import { calculateDistanceKm, formatDistance } from '@/hooks/useUserLocation';

interface LeafletMapProps {
  places: Place[];
  userLocation: Coordinates | null;
  locationSource: 'gps' | 'manual';
  onOpenLocationPicker: () => void;
  height?: string;
  initialZoom?: number;
  userAccuracy?: number | null;
  focusedPlace?: Place | null;
  onSelectPlace?: (place: Place | null) => void;
  onMapClickCoords?: (coords: Coordinates) => void;
  isMapPinMode?: boolean;
  onUserLocationChange?: (coords: Coordinates) => void;
}

const CATEGORY_CONFIG: Record<
  PlaceCategory,
  { labelEn: string; labelHi: string; labelMr: string; color: string; bgClass: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }
> = {
  ghat: { labelEn: 'Ghats', labelHi: 'घाट', labelMr: 'घाट', color: '#2D5FA8', bgClass: 'bg-blue-600', Icon: Waves },
  temple: { labelEn: 'Temples', labelHi: 'मंदिर', labelMr: 'मंदिरे', color: '#E87722', bgClass: 'bg-orange-600', Icon: TempleIcon },
  parking: { labelEn: 'Parking', labelHi: 'पार्किंग', labelMr: 'पार्किंग', color: '#C9A227', bgClass: 'bg-amber-600', Icon: ParkingCircle },
  medical: { labelEn: 'Medical', labelHi: 'चिकित्सा', labelMr: 'वैद्यकीय', color: '#DC2626', bgClass: 'bg-red-600', Icon: HeartPulse },
  police: { labelEn: 'Police', labelHi: 'पुलिस', labelMr: 'पोलीस', color: '#1B2B4B', bgClass: 'bg-slate-900', Icon: Shield },
  toilet: { labelEn: 'Toilets', labelHi: 'शौचालय', labelMr: 'स्वच्छतागृह', color: '#0D9488', bgClass: 'bg-teal-600', Icon: Bath },
  food: { labelEn: 'Food / Meals', labelHi: 'भोजन', labelMr: 'अन्नछत्र', color: '#166534', bgClass: 'bg-green-700', Icon: Utensils },
  transport_hub: { labelEn: 'Transport', labelHi: 'परिवहन', labelMr: 'वाहतूक', color: '#475569', bgClass: 'bg-slate-600', Icon: Bus },
  information_centre: { labelEn: 'Info Desk', labelHi: 'सूचना केंद्र', labelMr: 'माहिती केंद्र', color: '#7C3AED', bgClass: 'bg-purple-600', Icon: Info },
};

export type MapFilterCategory = 'essentials' | 'all' | PlaceCategory;

const ESSENTIAL_CATEGORIES: PlaceCategory[] = ['ghat', 'medical', 'parking', 'police'];

const ORDERED_FILTER_CATEGORIES: PlaceCategory[] = [
  'ghat',
  'medical',
  'parking',
  'police',
  'temple',
  'toilet',
  'food',
  'transport_hub',
  'information_centre',
];

export default function LeafletMap({
  places,
  userLocation,
  locationSource,
  onOpenLocationPicker,
  height = '500px',
  initialZoom = 14,
  userAccuracy,
  focusedPlace,
  onSelectPlace,
  onMapClickCoords,
  isMapPinMode = false,
  onUserLocationChange,
}: LeafletMapProps) {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activePlace, setActivePlace] = useState<Place | null>(null);
  // Default to 'essentials' (Ghats, Medical, Parking, Police) as a compact, safe starting set
  const [selectedCategory, setSelectedCategory] = useState<MapFilterCategory>('essentials');
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);
  const [viewportBounds, setViewportBounds] = useState<L.LatLngBounds | null>(null);

  // Compute category counts across dataset for chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: places.length,
      essentials: 0,
    };
    places.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
      if (ESSENTIAL_CATEGORIES.includes(p.category)) {
        counts.essentials += 1;
      }
    });
    return counts;
  }, [places]);

  // Filter places based on selected category chip
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return places;
    if (selectedCategory === 'essentials') {
      return places.filter((p) => ESSENTIAL_CATEGORIES.includes(p.category));
    }
    return places.filter((p) => p.category === selectedCategory);
  }, [places, selectedCategory]);

  // Grid size tuned specifically to Nashik & Trimbakeshwar coordinate spread
  const getGridSize = (zoom: number) => {
    if (zoom <= 10) return 0.08;
    if (zoom <= 11) return 0.045;
    if (zoom <= 12) return 0.025;
    if (zoom <= 13) return 0.014;
    if (zoom <= 14) return 0.007;
    if (zoom <= 15) return 0.0035;
    if (zoom <= 16) return 0.0016;
    if (zoom <= 17) return 0.0008;
    return 0.0002;
  };

  // Compute zoom-dependent clustering grid to prevent label collisions
  const clusteredItems = useMemo(() => {
    const gridSize = getGridSize(currentZoom);
    const clusters: Record<
      string,
      {
        count: number;
        latSum: number;
        lngSum: number;
        places: Place[];
        hasMedical: boolean;
        hasPolice: boolean;
        medicalCount: number;
        policeCount: number;
        categoryCounts: Partial<Record<PlaceCategory, number>>;
      }
    > = {};

    filteredPlaces.forEach((place) => {
      const gridX = Math.floor(place.coordinates.lat / gridSize);
      const gridY = Math.floor(place.coordinates.lng / gridSize);
      const key = `${gridX}_${gridY}`;

      if (!clusters[key]) {
        clusters[key] = {
          count: 0,
          latSum: 0,
          lngSum: 0,
          places: [],
          hasMedical: false,
          hasPolice: false,
          medicalCount: 0,
          policeCount: 0,
          categoryCounts: {},
        };
      }
      const c = clusters[key];
      c.count += 1;
      c.latSum += place.coordinates.lat;
      c.lngSum += place.coordinates.lng;
      c.places.push(place);
      c.categoryCounts[place.category] = (c.categoryCounts[place.category] || 0) + 1;
      if (place.category === 'medical') {
        c.hasMedical = true;
        c.medicalCount += 1;
      }
      if (place.category === 'police') {
        c.hasPolice = true;
        c.policeCount += 1;
      }
    });

    const results: Array<
      | {
          isCluster: true;
          count: number;
          lat: number;
          lng: number;
          places: Place[];
          hasMedical: boolean;
          hasPolice: boolean;
          medicalCount: number;
          policeCount: number;
          dominantCategory: PlaceCategory;
        }
      | {
          isCluster: false;
          place: Place;
          lat: number;
          lng: number;
        }
    > = [];

    Object.values(clusters).forEach((cluster) => {
      if (cluster.count === 1) {
        results.push({
          isCluster: false,
          place: cluster.places[0],
          lat: cluster.places[0].coordinates.lat,
          lng: cluster.places[0].coordinates.lng,
        });
      } else {
        let dominantCategory: PlaceCategory = 'ghat';
        let maxCatCount = 0;
        for (const [cat, cnt] of Object.entries(cluster.categoryCounts)) {
          if (cnt && cnt > maxCatCount) {
            maxCatCount = cnt;
            dominantCategory = cat as PlaceCategory;
          }
        }

        results.push({
          isCluster: true,
          count: cluster.count,
          lat: cluster.latSum / cluster.count,
          lng: cluster.lngSum / cluster.count,
          places: cluster.places,
          hasMedical: cluster.hasMedical,
          hasPolice: cluster.hasPolice,
          medicalCount: cluster.medicalCount,
          policeCount: cluster.policeCount,
          dominantCategory,
        });
      }
    });

    return results;
  }, [filteredPlaces, currentZoom]);

  // Count how many individual unclustered pins are currently within the map viewport
  const visibleIndividualPinsCount = useMemo(() => {
    if (!viewportBounds) return 999;
    let count = 0;
    for (const item of clusteredItems) {
      if (!item.isCluster && viewportBounds.contains([item.lat, item.lng])) {
        count++;
      }
    }
    return count;
  }, [clusteredItems, viewportBounds]);

  // Recenter map smoothly on current selected landmark or GPS location
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !userLocation) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  };

  // Fit all landmarks into view
  const handleFitBounds = () => {
    if (!mapInstanceRef.current || filteredPlaces.length === 0) return;
    const bounds = L.latLngBounds(filteredPlaces.map((p) => [p.coordinates.lat, p.coordinates.lng]));
    if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  };

  // Initialize map instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [20.0063, 73.7915]; // Ramkund verified center

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | Yatriva',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    const handleViewportChange = () => {
      if (!map) return;
      setCurrentZoom(map.getZoom());
      setViewportBounds(map.getBounds());
    };

    map.on('zoomend', handleViewportChange);
    map.on('moveend', handleViewportChange);
    // Initial viewport update
    handleViewportChange();

    return () => {
      map.off('zoomend', handleViewportChange);
      map.off('moveend', handleViewportChange);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialZoom, userLocation]);

  // Pan / FlyTo whenever userLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;
    map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 15), {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [userLocation]);

  // FlyTo and open detail card whenever focusedPlace changes from parent
  useEffect(() => {
    if (!focusedPlace) return;
    setActivePlace(focusedPlace);
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([focusedPlace.coordinates.lat, focusedPlace.coordinates.lng], 16, {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [focusedPlace]);

  // Map click listener for click-to-pin mode or dismissing selected pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isMapPinMode && onMapClickCoords) {
        onMapClickCoords({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
      } else {
        // Tapping map background dismisses active pin card
        setActivePlace(null);
        onSelectPlace?.(null);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [onMapClickCoords, isMapPinMode, onSelectPlace]);

  // Sync markers when items, zoom, viewport, or user location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Render User Location Pin (Distinct precision radar beacon)
    if (userLocation) {
      const isLive = locationSource === 'gps';
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 32px; height: 32px;
              border-radius: 50%;
              background: ${isLive ? 'rgba(37, 99, 235, 0.25)' : 'rgba(232, 119, 34, 0.25)'};
              border: 1.5px solid ${isLive ? '#2563EB' : '#E87722'};
              animation: yatriva-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              background: ${isLive ? '#2563EB' : '#E87722'};
              width: 14px; height: 14px;
              border-radius: 50%;
              border: 2.5px solid #FFFFFF;
              box-shadow: 0 0 10px ${isLive ? 'rgba(37,99,235,0.7)' : 'rgba(232,119,34,0.7)'}, 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 2000,
        draggable: true,
      }).addTo(layerGroup);

      const tooltipText = isLive
        ? userAccuracy && userAccuracy > 800
          ? `📍 Approximate Location (±${Math.round(userAccuracy / 1000)} km) • Drag to your exact spot`
          : `📍 Live Location${userAccuracy ? ` (±${userAccuracy}m)` : ''} • Drag to adjust`
        : '📍 Your Location • Drag to adjust';

      userMarker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top',
        offset: [0, -12],
        className: 'yatriva-map-tooltip',
      });

      userMarker.on('dragend', (e) => {
        const target = e.target as L.Marker;
        const latLng = target.getLatLng();
        onUserLocationChange?.({
          lat: Number(latLng.lat.toFixed(6)),
          lng: Number(latLng.lng.toFixed(6)),
        });
      });

      // Render GPS accuracy radius circle ONLY if live GPS and accuracy is reasonably local (<= 600m)
      if (isLive && userAccuracy && userAccuracy > 0 && userAccuracy <= 600) {
        L.circle([userLocation.lat, userLocation.lng], {
          radius: userAccuracy,
          color: '#2563EB',
          fillColor: '#3B82F6',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(layerGroup);
      }
    }

    // Render Clustered or Individual Pins
    clusteredItems.forEach((item) => {
      if (item.isCluster) {
        // High visibility badge with emergency indicators (Red + for medical, Blue shield for police)
        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div class="yatriva-cluster-badge" style="
              position: relative;
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <div style="
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: #0F1E35;
                color: #FFFFFF;
                border: 2.5px solid #E87722;
                box-shadow: 0 4px 12px rgba(15,30,53,0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 850;
                font-size: 13px;
                transition: transform 0.15s ease;
              ">
                ${item.count}
              </div>

              ${
                item.hasMedical
                  ? `
                <div style="
                  position: absolute;
                  top: -4px;
                  right: -5px;
                  background: #DC2626;
                  color: #FFFFFF;
                  border: 1.5px solid #FFFFFF;
                  border-radius: 9999px;
                  padding: 0 4px;
                  min-width: 17px;
                  height: 17px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  font-weight: 900;
                  box-shadow: 0 2px 6px rgba(220,38,38,0.6);
                  z-index: 10;
                " title="${item.medicalCount} Medical facility inside">
                  +${item.medicalCount > 1 ? item.medicalCount : ''}
                </div>
              `
                  : ''
              }

              ${
                item.hasPolice
                  ? `
                <div style="
                  position: absolute;
                  bottom: -4px;
                  right: -5px;
                  background: #1B2B4B;
                  color: #93C5FD;
                  border: 1.5px solid #FFFFFF;
                  border-radius: 9999px;
                  padding: 0 4px;
                  min-width: 17px;
                  height: 17px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 9px;
                  font-weight: 900;
                  box-shadow: 0 2px 6px rgba(27,43,75,0.6);
                  z-index: 10;
                " title="${item.policeCount} Police post inside">
                  🛡️
                </div>
              `
                  : ''
              }
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const clusterMarker = L.marker([item.lat, item.lng], { icon: clusterIcon }).addTo(layerGroup);

        const clusterDesc = `Cluster: ${item.count} places${
          item.hasMedical ? ` (${item.medicalCount} Medical)` : ''
        }${item.hasPolice ? ` (${item.policeCount} Police)` : ''}`;

        clusterMarker.bindTooltip(clusterDesc, {
          permanent: false,
          direction: 'top',
          offset: [0, -18],
          className: 'yatriva-map-tooltip',
        });

        clusterMarker.on('click', () => {
          if (!mapInstanceRef.current || item.places.length === 0) return;
          const clusterBounds = L.latLngBounds(item.places.map((p) => [p.coordinates.lat, p.coordinates.lng]));
          mapInstanceRef.current.fitBounds(clusterBounds, {
            padding: [45, 45],
            maxZoom: 18,
          });
        });
      } else {
        const place = item.place;
        const config = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.ghat;
        const IconComponent = config.Icon;
        const iconSvg = renderToString(<IconComponent className="h-3.5 w-3.5 text-white" />);
        const placeName = place.name[locale] || place.name.en;
        const isSelected = activePlace?.id === place.id;

        // Core Rule: text label appears ONLY when pin is tapped/selected OR viewport has < 15 pins at close zoom
        const showLabel = isSelected || (visibleIndividualPinsCount < 15 && currentZoom >= 16);

        const pinHtml = showLabel
          ? `
            <div class="yatriva-poi-tag ${isSelected ? 'active-poi-tag' : ''}" style="
              transform: translate(-50%, -100%);
              cursor: pointer;
              z-index: ${isSelected ? 1000 : 400};
            " title="${placeName}">
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: ${isSelected ? '#0F1E35' : '#FFFFFF'};
                color: ${isSelected ? '#FFFFFF' : '#0F172A'};
                padding: ${isSelected ? '3.5px 10px 3.5px 4.5px' : '2.5px 8px 2.5px 3.5px'};
                border-radius: 9999px;
                border: ${isSelected ? '2px solid #E87722' : `1.5px solid ${config.color}`};
                box-shadow: ${isSelected ? '0 4px 14px rgba(15,30,53,0.45)' : '0 2px 6px rgba(0,0,0,0.16)'};
                white-space: nowrap;
                line-height: 1;
              ">
                <div style="
                  width: ${isSelected ? '22px' : '18px'};
                  height: ${isSelected ? '22px' : '18px'};
                  border-radius: 50%;
                  background: ${config.color};
                  color: #FFFFFF;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                ">
                  ${iconSvg}
                </div>
                <span style="
                  font-size: 11px;
                  font-weight: 750;
                  letter-spacing: -0.01em;
                  color: ${isSelected ? '#FFFFFF' : '#0F172A'};
                  max-width: 140px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                ">
                  ${placeName}
                </span>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 5px solid ${isSelected ? '#0F1E35' : config.color};
                margin: -1px auto 0 auto;
              "></div>
            </div>
          `
          : `
            <div class="yatriva-poi-tag" style="
              transform: translate(-50%, -100%);
              cursor: pointer;
            " title="${placeName}">
              <div style="
                position: relative;
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: ${config.color};
                border: 2px solid #FFFFFF;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${iconSvg}
                ${
                  place.category === 'medical'
                    ? '<span style="position:absolute; top:-2px; right:-2px; width:8px; height:8px; border-radius:50%; background:#DC2626; border:1px solid #FFF;"></span>'
                    : ''
                }
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 3.5px solid transparent;
                border-right: 3.5px solid transparent;
                border-top: 4px solid ${config.color};
                margin: -1px auto 0 auto;
              "></div>
            </div>
          `;

        const pinIcon = L.divIcon({
          className: 'custom-poi-marker',
          html: pinHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: pinIcon,
          zIndexOffset: isSelected ? 1000 : 100,
        }).addTo(layerGroup);

        if (!showLabel) {
          marker.bindTooltip(placeName, {
            permanent: false,
            direction: 'top',
            className: 'yatriva-map-tooltip',
            offset: [0, -18],
          });
        }

        marker.on('click', () => {
          setActivePlace(place);
          onSelectPlace?.(place);
          mapInstanceRef.current?.panTo([place.coordinates.lat, place.coordinates.lng]);
        });
      }
    });
  }, [clusteredItems, userLocation, locationSource, userAccuracy, locale, selectedCategory, currentZoom, activePlace, visibleIndividualPinsCount, onSelectPlace, onUserLocationChange]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
      {/* Tap Mode Banner */}
      {isMapPinMode && (
        <div className="absolute top-14 left-3 right-3 z-[410] p-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-lg flex items-center justify-between gap-2 pointer-events-auto animate-fade-down">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-200" />
            <span>📍 Tap Mode Active: Click anywhere on the map to set your location</span>
          </div>
        </div>
      )}

      {/* High Uncertainty / Desktop Wi-Fi Geolocation Notification */}
      {!isMapPinMode && locationSource === 'gps' && userAccuracy && userAccuracy > 800 && (
        <div className="absolute top-14 left-3 right-3 z-[410] p-2.5 rounded-xl bg-amber-600/95 text-white font-medium text-xs shadow-lg flex items-center justify-between gap-2 pointer-events-auto backdrop-blur-xs border border-amber-400/60 animate-fade-down">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-4 w-4 text-amber-200 shrink-0" />
            <span className="truncate">
              PC Wi-Fi location is approximate (±{Math.round(userAccuracy / 1000)} km). Drag the blue beacon or search your area.
            </span>
          </div>
          <button
            onClick={onOpenLocationPicker}
            className="px-2.5 py-1 rounded-lg bg-white text-slate-900 text-[11px] font-black shrink-0 hover:bg-amber-50 cursor-pointer shadow-xs"
          >
            Adjust Spot
          </button>
        </div>
      )}

      {/* Category Filter Chips Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none pointer-events-auto">
        {/* Essentials Chip (Default Selected) */}
        <button
          onClick={() => setSelectedCategory('essentials')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[36px] whitespace-nowrap flex items-center gap-1.5 ${
            selectedCategory === 'essentials'
              ? 'bg-navy-800 text-white border-2 border-saffron-500'
              : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200'
          }`}
          style={selectedCategory === 'essentials' ? { background: '#0F1E35' } : {}}
        >
          <span className="text-amber-400">⭐</span>
          <span>Essentials ({categoryCounts.essentials})</span>
        </button>

        {/* Individual Filter Categories */}
        {ORDERED_FILTER_CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const IconComponent = cfg.Icon;
          const label = locale === 'hi' ? cfg.labelHi : locale === 'mr' ? cfg.labelMr : cfg.labelEn;
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[36px] whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'text-white border-2 border-white'
                  : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200'
              }`}
              style={{ background: isSelected ? cfg.color : undefined }}
            >
              <IconComponent className="h-3.5 w-3.5" />
              <span>
                {label} ({count})
              </span>
            </button>
          );
        })}

        {/* All Pins (Explicit Selection, Not Default) */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[36px] whitespace-nowrap flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-navy-800 text-white border-2 border-saffron-500'
              : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200'
          }`}
          style={selectedCategory === 'all' ? { background: '#0F1E35' } : {}}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>All Pins ({categoryCounts.all})</span>
        </button>
      </div>

      {/* Floating Map Action Controls (Recenter & Fit Bounds) */}
      <div className="absolute top-16 right-3 z-[400] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleRecenter}
          title="Center on Selected Location"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-90"
        >
          <LocateFixed className="h-4 w-4 text-saffron-600" style={{ color: '#E87722' }} />
        </button>
        <button
          onClick={handleFitBounds}
          title="Fit All Places"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-90"
        >
          <Maximize2 className="h-4 w-4 text-slate-700" />
        </button>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} style={{ height }} className="w-full bg-slate-100 z-[100]" />

      {/* Bottom Controls Bar (One-Handed Mobile Reachable by Thumb) */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onOpenLocationPicker}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-navy-800 text-xs font-bold shadow-lg border border-slate-200 transition-all active:scale-95 min-h-[44px]"
        >
          <Compass className="h-4 w-4 text-saffron-500" style={{ color: '#E87722' }} />
          <span>{locationSource === 'gps' ? 'GPS Active' : 'Change Location'}</span>
        </button>
      </div>

      {/* Compact Pin Detail Card Drawer Modal */}
      {activePlace && (
        <div
          className="absolute bottom-16 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 z-[500] bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 animate-slide-up pointer-events-auto"
          role="dialog"
          aria-labelledby="place-card-title"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {(() => {
                const ActiveIcon = CATEGORY_CONFIG[activePlace.category]?.Icon || MapPin;
                return (
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                    <ActiveIcon className="h-4 w-4" style={{ color: CATEGORY_CONFIG[activePlace.category]?.color }} />
                  </div>
                );
              })()}
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                style={{
                  background: CATEGORY_CONFIG[activePlace.category]?.color || '#1B2B4B',
                }}
              >
                {CATEGORY_CONFIG[activePlace.category]?.[`label${locale === 'hi' ? 'Hi' : locale === 'mr' ? 'Mr' : 'En'}`] || activePlace.category}
              </span>
            </div>

            <button
              onClick={() => setActivePlace(null)}
              className="p-1 rounded-full hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700"
              aria-label="Close detail card"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 id="place-card-title" className="text-lg font-black text-navy-800 mb-1" style={{ color: '#1B2B4B' }}>
            {activePlace.name[locale] || activePlace.name.en}
          </h3>

          {/* Distance calculation */}
          {userLocation && (
            <p className="text-xs font-bold text-saffron-600 mb-2 flex items-center gap-1" style={{ color: '#E87722' }}>
              <Navigation className="h-3.5 w-3.5" />
              <span>
                {formatDistance(calculateDistanceKm(userLocation, activePlace.coordinates))} away from your location
              </span>
            </p>
          )}

          {activePlace.description?.[locale] && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {activePlace.description[locale]}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 flex-wrap">
            {activePlace.cultureSlug && (
              <a
                href={`/${locale}/culture/${activePlace.cultureSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold transition-all"
              >
                <BookOpen className="h-3.5 w-3.5 text-saffron-600" />
                <span>Culture Guide</span>
              </a>
            )}

            <div className="flex items-center gap-1.5 flex-wrap">
              <ConfidenceBadge
                confidence={activePlace.locationConfidence}
                verified={activePlace.verified}
              />
              {activePlace.dataSource === 'nashik-monitor' && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  Nashik Monitor
                </span>
              )}
            </div>

            <a
              href={`https://maps.google.com/?q=${activePlace.coordinates.lat},${activePlace.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy-800 text-white text-xs font-bold transition-all hover:bg-navy-900 active:scale-95 min-h-[40px]"
              style={{ background: '#1B2B4B' }}
            >
              <span>Navigate</span>
              <ExternalLink className="h-3.5 w-3.5 text-saffron-400" />
            </a>
          </div>
        </div>
      )}

      {/* Nashik Monitor Data Attribution Notice */}
      <div className="absolute bottom-1 right-2 z-[400] text-[10px] text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-slate-200/80 pointer-events-auto flex items-center gap-1">
        <span>Civic data: <strong>Nashik Monitor</strong> (Kumbhathon Foundation)</span>
      </div>
    </div>
  );
}
