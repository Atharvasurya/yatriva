'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import {
  Waves, Landmark, ParkingCircle, Bus, HeartPulse, Shield, Bath, Utensils, Info, MapPin, Navigation, ExternalLink, X, Compass, BookOpen, AlertTriangle
} from 'lucide-react';
import TempleIcon from '@/components/ui/TempleIcon';
import type { Place, PlaceCategory, Coordinates } from '@/types/place';
import { calculateDistanceKm, formatDistance } from '@/hooks/useUserLocation';

interface LeafletMapProps {
  places: Place[];
  userLocation: Coordinates | null;
  locationSource: 'gps' | 'manual';
  onOpenLocationPicker: () => void;
  height?: string;
  initialZoom?: number;
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

export default function LeafletMap({
  places,
  userLocation,
  locationSource,
  onOpenLocationPicker,
  height = '500px',
  initialZoom = 13,
}: LeafletMapProps) {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);

  // Filter places based on selected category chip
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return places;
    return places.filter((p) => p.category === selectedCategory);
  }, [places, selectedCategory]);

  // Compute zoom-dependent clustering grid
  const clusteredItems = useMemo(() => {
    if (currentZoom >= 15) {
      return filteredPlaces.map((place) => ({
        isCluster: false as const,
        place,
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
      }));
    }

    const gridSize = currentZoom <= 12 ? 0.02 : 0.008;
    const clusters: Record<
      string,
      { count: number; latSum: number; lngSum: number; places: Place[] }
    > = {};

    filteredPlaces.forEach((place) => {
      const gridX = Math.floor(place.coordinates.lat / gridSize);
      const gridY = Math.floor(place.coordinates.lng / gridSize);
      const key = `${gridX}_${gridY}`;

      if (!clusters[key]) {
        clusters[key] = { count: 0, latSum: 0, lngSum: 0, places: [] };
      }
      clusters[key].count += 1;
      clusters[key].latSum += place.coordinates.lat;
      clusters[key].lngSum += place.coordinates.lng;
      clusters[key].places.push(place);
    });

    const results: Array<
      | { isCluster: true; count: number; lat: number; lng: number; places: Place[] }
      | { isCluster: false; place: Place; lat: number; lng: number }
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
        results.push({
          isCluster: true,
          count: cluster.count,
          lat: cluster.latSum / cluster.count,
          lng: cluster.lngSum / cluster.count,
          places: cluster.places,
        });
      }
    });

    return results;
  }, [filteredPlaces, currentZoom]);

  // Initialize map instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [20.0063, 73.7915]; // Ramkund fallback center

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

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialZoom, userLocation]);

  // Sync markers when items or user location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Render User Location Pin (Distinct pulses)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            background: #E87722;
            width: 18px; height: 18px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 12px rgba(232,119,34,0.6);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="background: white; width: 6px; height: 6px; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(layerGroup)
        .bindTooltip(locationSource === 'gps' ? 'Live Location' : 'Selected Landmark', {
          permanent: false,
          direction: 'top',
        });
    }

    // Render Clustered or Individual Pins
    clusteredItems.forEach((item) => {
      if (item.isCluster) {
        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div style="
              background: #1B2B4B;
              color: white;
              width: 36px; height: 36px;
              border-radius: 50%;
              border: 3px solid #E87722;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex; align-items: center; justify-content: center;
              font-weight: 900; font-size: 13px;
            ">
              ${item.count}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const clusterMarker = L.marker([item.lat, item.lng], { icon: clusterIcon }).addTo(layerGroup);

        clusterMarker.on('click', () => {
          mapInstanceRef.current?.setView([item.lat, item.lng], Math.min(currentZoom + 2, 16));
        });
      } else {
        const place = item.place;
        const config = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.ghat;
        const IconComponent = config.Icon;
        const iconSvg = renderToString(<IconComponent className="h-3 w-3 text-white" />);
        const placeName = place.name[locale] || place.name.en;

        const pinIcon = L.divIcon({
          className: 'custom-poi-marker',
          html: `
            <div class="yatriva-poi-tag" title="${placeName}">
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: #FFFFFF;
                color: #0F172A;
                padding: 2.5px 8px 2.5px 3.5px;
                border-radius: 9999px;
                border: 1.5px solid ${config.color};
                box-shadow: 0 2px 6px rgba(0,0,0,0.16);
                white-space: nowrap;
                line-height: 1;
              ">
                <div style="
                  width: 18px;
                  height: 18px;
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
                  color: #0F172A;
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
                border-top: 4.5px solid ${config.color};
                margin-top: -1px;
              "></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: pinIcon }).addTo(
          layerGroup
        );

        marker.on('click', () => {
          setActivePlace(place);
          mapInstanceRef.current?.panTo([place.coordinates.lat, place.coordinates.lng]);
        });
      }
    });
  }, [clusteredItems, userLocation, locationSource, locale]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
      {/* Category Filter Chips Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none pointer-events-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md min-h-[36px] whitespace-nowrap flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-navy-800 text-white border-2 border-saffron-500'
              : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200'
          }`}
          style={selectedCategory === 'all' ? { background: '#1B2B4B' } : {}}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>All Pins ({places.length})</span>
        </button>

        {(Object.keys(CATEGORY_CONFIG) as PlaceCategory[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const IconComponent = cfg.Icon;
          const label = locale === 'hi' ? cfg.labelHi : locale === 'mr' ? cfg.labelMr : cfg.labelEn;
          const isSelected = selectedCategory === cat;

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
              <span>{label}</span>
            </button>
          );
        })}
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

            {!activePlace.verified && (
              <span className="placeholder-badge text-[10px] inline-flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                <span>PLACEHOLDER</span>
              </span>
            )}

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
    </div>
  );
}
