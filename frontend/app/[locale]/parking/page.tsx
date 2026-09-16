'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  SquareParking,
  Car,
  Bus,
  Bike,
  Truck,
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
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
} from 'lucide-react';
import { ALL_MAP_PLACES } from '@/data/seed';
import type { Place, ParkingZone } from '@/types/place';
import {
  useUserLocation,
  calculateDistanceKm,
  formatDistance,
} from '@/hooks/useUserLocation';
import LocationPickerModal from '@/components/map/LocationPickerModal';
import ParkingClipart from '@/components/ui/ParkingClipart';
import { getParkingPricing } from '@/data/parkingPricing';

const DEFAULT_ITEMS_LIMIT = 12;
const RAMKUND_COORDS = { lat: 20.0063, lng: 73.7915 };

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

function getAllowedVehicles(
  place: Place,
  capacity: ParsedCapacity | null,
  isOuter: boolean = true
): Array<'car' | 'bus' | 'two_wheeler' | 'heavy_vehicle'> {
  const pz = place as Partial<ParkingZone>;
  if (Array.isArray(pz.vehicleTypes) && pz.vehicleTypes.length > 0) {
    return pz.vehicleTypes as Array<'car' | 'bus' | 'two_wheeler' | 'heavy_vehicle'>;
  }

  const name = (place.name.en || '').toLowerCase();
  const types: Array<'car' | 'bus' | 'two_wheeler' | 'heavy_vehicle'> = [];

  if (capacity) {
    if (capacity.cars !== undefined && capacity.cars > 0) types.push('car');
    if (capacity.buses !== undefined && capacity.buses > 0) types.push('bus');
    if (capacity.twoWheelers !== undefined && capacity.twoWheelers > 0) types.push('two_wheeler');
  }

  if (name.includes('truck') || name.includes('heavy') || name.includes('adgaon')) {
    if (!types.includes('heavy_vehicle')) types.push('heavy_vehicle');
  }

  if (types.length === 0) {
    if (isOuter) {
      if (name.includes('truck') || name.includes('heavy') || name.includes('terminus')) {
        return ['car', 'bus', 'two_wheeler', 'heavy_vehicle'];
      }
      return ['car', 'bus', 'two_wheeler', 'heavy_vehicle'];
    } else {
      return ['car', 'two_wheeler'];
    }
  }

  return types;
}

function getVehicleLabel(type: 'car' | 'bus' | 'two_wheeler' | 'heavy_vehicle', locale: string): string {
  switch (type) {
    case 'car':
      return locale === 'hi' ? 'कार' : locale === 'mr' ? 'चारचाकी' : 'CAR';
    case 'bus':
      return locale === 'hi' ? 'बस' : locale === 'mr' ? 'बस' : 'BUS';
    case 'two_wheeler':
      return locale === 'hi' ? 'दोपहिया' : locale === 'mr' ? 'दुचाकी' : 'TWO WHEELER';
    case 'heavy_vehicle':
      return locale === 'hi' ? 'भारी वाहन' : locale === 'mr' ? 'जड वाहने' : 'HEAVY VEHICLE';
  }
}

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid' | 'outer' | 'inner' | 'capacity'>('all');
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

  // 1. Filter places to parking category from ALL_MAP_PLACES (includes 52 NM + 5 curated + verified temple pay parking)
  const rawParkingPlaces = useMemo(() => {
    const parkings = ALL_MAP_PLACES.filter((p) => p.category === 'parking');
    const extraPaidParkings = ALL_MAP_PLACES.filter(
      (p) => p.id === 'nm-temple-5174' || p.id === 'nm-temple-5184'
    ).map((p) => ({
      ...p,
      category: 'parking' as const,
      tags: [...(p.tags || []), 'paid-parking', 'inner-parking'],
    }));
    return [...parkings, ...extraPaidParkings];
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

  // 2. Compute distance and pricing for each parking place and sort nearest first
  const parkingWithDistance = useMemo(() => {
    return rawParkingPlaces.map((place) => {
      const distKm = calculateDistanceKm(userLocation, place.coordinates);
      const capacity = extractCapacity(place);
      const isCurated = !place.id.startsWith('nm-');
      const pricing = getParkingPricing(place.id);
      const isOuter = place.tags?.includes('outer-parking') || (place as Partial<ParkingZone>).slug?.includes('outer');
      const isInner = place.tags?.includes('inner-parking') || (place as Partial<ParkingZone>).slug?.includes('inner');

      return {
        place,
        distKm,
        distFormatted: formatDistance(distKm),
        capacity,
        pricing,
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
    if (filterType === 'free') {
      list = list.filter((item) => !item.pricing.isPaid);
    } else if (filterType === 'paid') {
      list = list.filter((item) => item.pricing.isPaid);
    } else if (filterType === 'outer') {
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
  const freeCount = parkingWithDistance.filter((i) => !i.pricing.isPaid).length;
  const paidCount = parkingWithDistance.filter((i) => i.pricing.isPaid).length;
  const outerCount = parkingWithDistance.filter((i) => i.isOuter).length;
  const innerCount = parkingWithDistance.filter((i) => i.isInner).length;
  const capacityCount = parkingWithDistance.filter((i) => !!i.capacity).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-up">
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
            onClick={() => setFilterType('free')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              filterType === 'free'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{locale === 'hi' ? 'निःशुल्क बफर' : locale === 'mr' ? 'मोफत बफर' : 'Free Buffers'}</span> ({freeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('paid')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              filterType === 'paid'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{locale === 'hi' ? 'सशुल्क (पे एंड पार्क)' : locale === 'mr' ? 'सशुल्क (पे अँड पार्क)' : 'Paid Parking'}</span> ({paidCount})
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

      {/* ── Parking Cards Grid (Rich Visual Cards Matching Reference Design) ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {displayedParking.map(({ place, distFormatted, capacity, pricing, isCurated, isOuter }, index) => {
          const name = place.name[locale] || place.name.en;
          const pz = place as Partial<ParkingZone>;

          // Allowed vehicle types
          const vehicleTypes = getAllowedVehicles(place, capacity, isOuter ?? true);

          // Distance to Ramkund / core buffer
          const distToRamkund = typeof pz.distanceToMainGhatKm === 'number'
            ? pz.distanceToMainGhatKm
            : calculateDistanceKm(RAMKUND_COORDS, place.coordinates);
          const distToRamkundFormatted = `${distToRamkund % 1 === 0 ? distToRamkund.toFixed(0) : distToRamkund.toFixed(1)} km to Ramkund / core buffer`;

          // Capacity Display
          let capacityDisplay: React.ReactNode;
          if (typeof pz.capacityVehicles === 'number' && pz.capacityVehicles > 0) {
            capacityDisplay = (
              <span className="font-extrabold text-slate-900 text-sm">
                ~{pz.capacityVehicles.toLocaleString()} vehicles
              </span>
            );
          } else if (capacity?.cars !== undefined || capacity?.twoWheelers !== undefined || capacity?.buses !== undefined) {
            const parts: string[] = [];
            if (capacity.cars !== undefined) parts.push(`Cars: ${capacity.cars}`);
            if (capacity.twoWheelers !== undefined) parts.push(`Two-Wheelers: ${capacity.twoWheelers}`);
            if (capacity.buses !== undefined) parts.push(`Buses: ${capacity.buses}`);
            capacityDisplay = (
              <span className="font-extrabold text-slate-900 text-sm">
                {parts.join(', ')}
              </span>
            );
          } else if (capacity?.rawText) {
            capacityDisplay = (
              <span className="font-extrabold text-slate-900 text-sm">
                {capacity.rawText}
              </span>
            );
          } else {
            capacityDisplay = (
              <span className="font-extrabold text-slate-900 text-sm">
                {isOuter ? '~10,000 vehicles' : '~3,000 vehicles'}
              </span>
            );
          }

          // Shuttle status
          const shuttleAvailable = pz.shuttleAvailable !== false;
          const shuttleText = shuttleAvailable ? (t('shuttleYes') || 'Available') : (t('shuttleNo') || 'Not available');

          return (
            <div
              key={place.id}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 animate-fade-up delay-${((index % 4) + 1) * 100}`}
            >
              {/* Clipart Banner with floating status badge */}
              <div className="relative">
                <ParkingClipart
                  zoneId={place.id}
                  zoneName={name}
                  coordinates={place.coordinates}
                  isOuter={isOuter}
                  imageUrl={place.imageUrl}
                />

                {/* Verified / Status Badge */}
                <div className="absolute top-3 right-3 z-20">
                  {place.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-md border border-emerald-300/40">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{locale === 'hi' ? 'सत्यापित' : locale === 'mr' ? 'सत्यापित' : 'Verified'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-md">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{locale === 'hi' ? 'अनुमानित' : locale === 'mr' ? 'अंदाजे' : 'Approximate'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Supported / Allowed Vehicles */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    {t('vehicleTypesLabel')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vehicleTypes.map((vType) => (
                      <span
                        key={vType}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200"
                      >
                        {vType === 'car' && <Car className="h-3.5 w-3.5 text-blue-600" />}
                        {vType === 'bus' && <Bus className="h-3.5 w-3.5 text-emerald-600" />}
                        {vType === 'two_wheeler' && <Bike className="h-3.5 w-3.5 text-amber-600" />}
                        {vType === 'heavy_vehicle' && <Truck className="h-3.5 w-3.5 text-purple-600" />}
                        <span>{getVehicleLabel(vType, locale)}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details Inset Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium block">{t('capacityLabel')}</span>
                    {capacityDisplay}
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">{t('shuttleLabel')}</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {shuttleText}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{t('distanceLabel')}:</span>
                    <span className="font-extrabold text-slate-900">{distToRamkundFormatted}</span>
                  </div>

                  {/* Verified Pricing / Tariff row */}
                  <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
                      <IndianRupee className="h-3 w-3 text-slate-400" />
                      <span>{locale === 'hi' ? 'शुल्क / दर' : locale === 'mr' ? 'शुल्क / दर' : 'Tariff'}:</span>
                    </span>
                    <span
                      className={`text-[11px] font-extrabold truncate text-right ${
                        pricing.isPaid
                          ? 'text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300'
                          : 'text-emerald-700'
                      }`}
                    >
                      {locale === 'hi' ? pricing.rateHi : locale === 'mr' ? pricing.rateMr : pricing.rateEn}
                    </span>
                  </div>
                </div>

                {/* Map Navigation Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-2 flex-wrap sm:flex-nowrap">
                  <div
                    className="flex items-center gap-1.5 flex-wrap min-w-0"
                    title={`Centroid GPS: ${place.coordinates.lat.toFixed(5)}, ${place.coordinates.lng.toFixed(5)}`}
                  >
                    {/* Live distance from user's location / reference point */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 border border-slate-200/70">
                      <Navigation className="h-3 w-3 text-amber-600" />
                      <span>{distFormatted} {locale === 'hi' ? 'दूर' : locale === 'mr' ? 'दूर' : 'away'}</span>
                    </span>

                    {/* Operational badge: Free vs Paid with dynamic rates */}
                    {pricing.isPaid ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 shadow-2xs shrink-0"
                        title={`Operator: ${locale === 'hi' ? pricing.operatorTypeHi : locale === 'mr' ? pricing.operatorTypeMr : pricing.operatorTypeEn}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>{locale === 'hi' ? pricing.badgeHi : locale === 'mr' ? pricing.badgeMr : pricing.badgeEn}</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 shrink-0"
                        title="Official Kumbh Mela Free Transit Buffer (NMC / NTKMA)"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{locale === 'hi' ? pricing.badgeHi : locale === 'mr' ? pricing.badgeMr : pricing.badgeEn}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${locale}/map?place=${encodeURIComponent(place.slug || place.id)}&lat=${place.coordinates.lat}&lng=${place.coordinates.lng}&category=parking`}
                      prefetch={true}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                      title="View on Interactive Map"
                    >
                      <MapPin className="h-3.5 w-3.5 text-amber-600" />
                      <span>{locale === 'hi' ? 'यात्रिवा नक्शा' : locale === 'mr' ? 'यात्रिवा नकाशा' : 'Yatriva Map'}</span>
                    </Link>

                    <a
                      href={`https://maps.google.com/?q=${place.coordinates.lat},${place.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{locale === 'hi' ? 'नेविगेट' : locale === 'mr' ? 'मार्ग' : 'Navigate'}</span>
                    </a>
                  </div>
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
