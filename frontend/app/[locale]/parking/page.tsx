'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  SquareParking,
  Car,
  Bus,
  Bike,
  Navigation,
  Sparkles,
  ArrowLeft,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Database,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { ALL_MAP_PLACES } from '@/data/seed';
import type { Place, ParkingZone } from '@/types/place';
import {
  useUserLocation,
  calculateDistanceKm,
  formatDistance,
} from '@/hooks/useUserLocation';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';

const DEFAULT_ITEMS_LIMIT = 12;

interface ParsedCapacity {
  totalVehicles?: number;
  cars?: number;
  twoWheelers?: number;
  buses?: number;
  rawText?: string;
}

function extractCapacity(place: Place): ParsedCapacity | null {
  // Check if hand-curated ParkingZone with capacityVehicles
  const pz = place as Partial<ParkingZone>;
  if (typeof pz.capacityVehicles === 'number' && pz.capacityVehicles > 0) {
    return {
      totalVehicles: pz.capacityVehicles,
    };
  }

  // Check description string for Nashik Monitor capacity figures
  const desc = place.description?.en || '';
  if (desc.includes('Capacity:')) {
    const match = desc.match(/Capacity:\s*([^\n—|]+)/i);
    if (match && match[1]) {
      const capStr = match[1].trim();
      const carMatch = capStr.match(/Cars:\s*(\d+)/i);
      const twMatch = capStr.match(/Two-Wheelers:\s*(\d+)/i);
      const busMatch = capStr.match(/Buses:\s*(\d+)/i);

      return {
        cars: carMatch ? parseInt(carMatch[1], 10) : undefined,
        twoWheelers: twMatch ? parseInt(twMatch[1], 10) : undefined,
        buses: busMatch ? parseInt(busMatch[1], 10) : undefined,
        rawText: capStr,
      };
    }
  }

  return null;
}

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'outer' | 'inner' | 'capacity'>('all');
  const [showAll, setShowAll] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    userLocation,
    locationSource,
    activePreset,
    setManualPreset,
    setCustomLocation,
    requestGpsLocation,
    userAccuracy,
    gpsError,
    isLocating,
  } = useUserLocation();

  // 1. Filter places to parking category from ALL_MAP_PLACES (includes 52 NM + 5 curated)
  const rawParkingPlaces = useMemo(() => {
    return ALL_MAP_PLACES.filter((p) => p.category === 'parking');
  }, []);

  // Active reference location label
  const activeLocationName = useMemo(() => {
    if (locationSource === 'gps') {
      return locale === 'hi' ? 'लाइव जीपीएस स्थिति' : locale === 'mr' ? 'थेट GPS स्थान' : 'Live GPS Location';
    }
    if (activePreset) {
      return activePreset[`name${locale === 'hi' ? 'Hi' : locale === 'mr' ? 'Mr' : 'En'}`] || activePreset.nameEn;
    }
    return 'Ramkund Ghat, Nashik';
  }, [locationSource, activePreset, locale]);

  // 2. Compute distance for each parking place and sort nearest first
  const parkingWithDistance = useMemo(() => {
    return rawParkingPlaces.map((place) => {
      const distKm = calculateDistanceKm(userLocation, place.coordinates);
      const capacity = extractCapacity(place);
      const isCurated = !place.id.startsWith('nm-');
      const isOuter = place.tags?.includes('outer-parking') || (place as Partial<ParkingZone>).slug?.includes('outer');
      const isInner = place.tags?.includes('inner-parking') || (place as Partial<ParkingZone>).slug?.includes('inner');

      return {
        place,
        distKm,
        distFormatted: formatDistance(distKm),
        capacity,
        isCurated,
        isOuter,
        isInner,
      };
    }).sort((a, b) => a.distKm - b.distKm);
  }, [rawParkingPlaces, userLocation]);

  // 3. Apply search query and category filters
  const filteredParking = useMemo(() => {
    let list = parkingWithDistance;

    // Filter by type
    if (filterType === 'outer') {
      list = list.filter((item) => item.isOuter);
    } else if (filterType === 'inner') {
      list = list.filter((item) => item.isInner);
    } else if (filterType === 'capacity') {
      list = list.filter((item) => !!item.capacity);
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter(({ place }) => {
        const nameEn = (place.name.en || '').toLowerCase();
        const nameHi = (place.name.hi || '').toLowerCase();
        const nameMr = (place.name.mr || '').toLowerCase();
        const descEn = (place.description?.en || '').toLowerCase();
        const address = (place.address || '').toLowerCase();
        return nameEn.includes(q) || nameHi.includes(q) || nameMr.includes(q) || descEn.includes(q) || address.includes(q);
      });
    }

    return list;
  }, [parkingWithDistance, filterType, searchQuery]);

  // 4. Handle scale: default 12 nearest unless showAll is true or query is active
  const displayedParking = useMemo(() => {
    if (showAll || searchQuery.trim().length > 0) {
      return filteredParking;
    }
    return filteredParking.slice(0, DEFAULT_ITEMS_LIMIT);
  }, [filteredParking, showAll, searchQuery]);

  const totalCount = rawParkingPlaces.length;
  const outerCount = parkingWithDistance.filter((i) => i.isOuter).length;
  const innerCount = parkingWithDistance.filter((i) => i.isInner).length;
  const capacityCount = parkingWithDistance.filter((i) => !!i.capacity).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* ── Back to Home Navigation ─────────────────────────────────────────── */}
      <Link
        href={`/${locale}`}
        prefetch={true}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 border border-slate-200/90 hover:border-amber-300 text-xs font-bold shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:scale-95 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 text-amber-700 transition-transform group-hover:-translate-x-0.5" />
        <span>
          {locale === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : locale === 'mr' ? 'मुख्य पृष्ठावर परत जा' : 'Back to Home'}
        </span>
      </Link>

      {/* ── Header Banner ───────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl space-y-3"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 50%, #C2581A 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Nashik Kumbh Mela 2027 • Official Mobility Plan</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner hidden sm:flex">
            <SquareParking className="h-9 w-9 text-amber-300 stroke-[2.2]" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {locale === 'hi'
                ? 'कुंभ मेले के लिए नाशिक और त्र्यंबकेश्वर में 57 आधिकारिक पार्किंग क्षेत्र — लाइव दूरी एवं नक्शा मार्ग।'
                : locale === 'mr'
                ? 'कुंभमेळ्यासाठी नाशिक व त्र्यंबकेश्वरमधील 57 अधिकृत पार्किंग क्षेत्रे — अंतर व नकाशा दिशा.'
                : '57 official outer and inner parking zones from the NTKMA Kumbh Mobility Plan with live distance and map directions.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Dynamic Reference Location Banner ───────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {locale === 'hi' ? 'दूरी का संदर्भ बिंदु' : locale === 'mr' ? 'अंतर संदर्भ बिंदू' : 'Sorted relative to'}
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate block">
              {activeLocationName}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          <MapPin className="h-3.5 w-3.5 text-amber-600" />
          <span>{locale === 'hi' ? 'स्थान बदलें' : locale === 'mr' ? 'स्थान बदला' : 'Change Location'}</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'hi'
                ? 'पार्किंग क्षेत्र या सड़क के नाम से खोजें...'
                : locale === 'mr'
                ? 'पार्किंगचे नाव किंवा रस्त्यानुसार शोधा...'
                : 'Search parking by name, road, or area...'
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all outline-none font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            {locale === 'hi' ? 'सभी पार्किंग' : locale === 'mr' ? 'सर्व पार्किंग' : 'All Parking'} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('outer')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'outer'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            {locale === 'hi' ? 'आउटर रिंग रोड' : locale === 'mr' ? 'आऊटर रिंग रोड' : 'Outer Ring'} ({outerCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('inner')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'inner'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            {locale === 'hi' ? 'इनर बफर जोन' : locale === 'mr' ? 'इनर बफर झोन' : 'Inner Zones'} ({innerCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('capacity')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'capacity'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            {locale === 'hi' ? 'सत्यापित क्षमता उपलब्ध' : locale === 'mr' ? 'सत्यापित क्षमता उपलब्ध' : 'With Capacity Data'} ({capacityCount})
          </button>
        </div>
      </div>

      {/* ── Results Count Indicator ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {locale === 'hi'
            ? `${filteredParking.length} पार्किंग स्थल मिले (दूरी के क्रम में)`
            : locale === 'mr'
            ? `${filteredParking.length} पार्किंग क्षेत्र आढळले (अंतराच्या क्रमाने)`
            : `Showing ${displayedParking.length} of ${filteredParking.length} parking zones (nearest first)`}
        </span>
        {filteredParking.length > DEFAULT_ITEMS_LIMIT && !searchQuery && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-amber-800 hover:text-amber-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{showAll ? 'Show nearest 12' : `Show all ${filteredParking.length}`}</span>
            {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* ── Parking Cards Grid (Structured list consistent with ghats/temples) ── */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {displayedParking.map(({ place, distFormatted, capacity, isCurated, isOuter }, index) => {
          const name = place.name[locale] || place.name.en;
          const pz = place as Partial<ParkingZone>;

          return (
            <div
              key={place.id}
              className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-4 animate-fade-up delay-${((index % 6) + 1) * 50}`}
            >
              <div className="space-y-3">
                {/* Top badges row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Zone Category Pill */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        isCurated
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : isOuter
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isCurated ? 'Corridor Hub' : isOuter ? 'Outer Ring' : 'Inner Zone'}
                    </span>

                    {/* Verified Confidence Badge */}
                    <ConfidenceBadge
                      confidence={place.locationConfidence || (place.verified ? 'verified' : null)}
                      verified={place.verified}
                      size="sm"
                    />
                  </div>

                  {/* Distance from selected spot */}
                  <span className="inline-flex items-center gap-1 text-xs font-black text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded-full shrink-0">
                    <Navigation className="h-3 w-3 text-amber-600" />
                    <span>{distFormatted}</span>
                  </span>
                </div>

                {/* Name & Origin Note */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {name}
                  </h3>
                  {place.description?.[locale] && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {place.description[locale]}
                    </p>
                  )}
                </div>

                {/* Real Capacity Info (Only shown when real source data exists — never guessed) */}
                {capacity && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t('capacityLabel')} (Official NTKMA Survey)
                    </span>
                    {capacity.totalVehicles ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          ~{capacity.totalVehicles.toLocaleString()} vehicles
                        </span>
                        {pz.shuttleAvailable && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Shuttle Available
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap font-semibold text-slate-700">
                        {capacity.cars !== undefined && (
                          <span className="inline-flex items-center gap-1">
                            <Car className="h-3.5 w-3.5 text-blue-600" />
                            <span>{capacity.cars} Cars</span>
                          </span>
                        )}
                        {capacity.twoWheelers !== undefined && (
                          <span className="inline-flex items-center gap-1">
                            <Bike className="h-3.5 w-3.5 text-amber-600" />
                            <span>{capacity.twoWheelers} Two-Wheelers</span>
                          </span>
                        )}
                        {capacity.buses !== undefined && (
                          <span className="inline-flex items-center gap-1">
                            <Bus className="h-3.5 w-3.5 text-purple-600" />
                            <span>{capacity.buses} Buses</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Pin on Map & External Directions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                </span>

                <div className="flex items-center gap-2">
                  {/* Link to Interactive Map (filtered to parking) */}
                  <Link
                    href={`/${locale}/map?place=${encodeURIComponent(place.slug || place.id)}&lat=${place.coordinates.lat}&lng=${place.coordinates.lng}&category=parking`}
                    prefetch={true}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-2xs active:scale-95 cursor-pointer"
                    aria-label={`View ${name} on Interactive Map`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>{locale === 'hi' ? 'नक्शे पर देखें' : locale === 'mr' ? 'नकाशावर पहा' : 'View on Map'}</span>
                  </Link>

                  {/* Google Maps External Directions */}
                  <a
                    href={`https://maps.google.com/?q=${place.coordinates.lat},${place.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Open in Google Maps"
                    aria-label="Open in Google Maps"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Scale Handling Show All / Collapse Toggle ───────────────────────── */}
      {filteredParking.length > DEFAULT_ITEMS_LIMIT && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>
              {showAll
                ? locale === 'hi'
                  ? 'केवल निकटतम 12 पार्किंग दिखाएं'
                  : locale === 'mr'
                  ? 'केवळ जवळचे 12 पार्किंग दाखवा'
                  : 'Collapse to Nearest 12 Parking Zones'
                : locale === 'hi'
                ? `सभी ${filteredParking.length} पार्किंग स्थल देखें`
                : locale === 'mr'
                ? `सर्व ${filteredParking.length} पार्किंग क्षेत्रे पहा`
                : `Show All ${filteredParking.length} Parking Zones`}
            </span>
            {showAll ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-amber-600" />}
          </button>
        </div>
      )}

      {/* ── Step 5: Civic Data Attribution ──────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Civic Infrastructure Attribution</span>
            <span className="text-slate-500 text-[11px]">
              Civic data: <strong>Nashik Monitor</strong> (Kumbhathon Innovation Foundation)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>NTKMA Kumbh Mela Mobility Plan • Centroid-verified coordinates</span>
        </div>
      </div>

      {/* ── Location Picker Modal ───────────────────────────────────────────── */}
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
        onSelectCustomCoords={setCustomLocation}
        allPlaces={ALL_MAP_PLACES}
      />
    </div>
  );
}
