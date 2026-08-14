'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  ParkingCircle,
  Car,
  Bus,
  Bike,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Phone,
  IndianRupee,
  Shield,
  Zap,
  Building2,
  Sparkles,
} from 'lucide-react';
import { PARKING_ZONES } from '@/data/seed';

type ParkingFilter = 'all' | 'official' | 'private';

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [activeFilter, setActiveFilter] = useState<ParkingFilter>('all');

  const filteredZones = PARKING_ZONES.filter((zone) => {
    if (activeFilter === 'official') return zone.parkingType === 'official';
    if (activeFilter === 'private') return zone.parkingType === 'private' || zone.parkingType === 'commercial';
    return true;
  });

  const officialCount = PARKING_ZONES.filter((z) => z.parkingType === 'official').length;
  const privateCount = PARKING_ZONES.filter((z) => z.parkingType === 'private' || z.parkingType === 'commercial').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #9A7208 0%, #1B2B4B 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <ParkingCircle className="h-8 w-8 sm:h-9 sm:w-9 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Verified Data Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold">
          {t('unverifiedNotice')}
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-navy-800 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
          style={activeFilter === 'all' ? { background: '#1B2B4B' } : {}}
        >
          {t('filterAll', { count: PARKING_ZONES.length })}
        </button>

        <button
          onClick={() => setActiveFilter('official')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] cursor-pointer flex items-center gap-2 ${
            activeFilter === 'official'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
          style={activeFilter === 'official' ? { background: '#047857' } : {}}
        >
          <Shield className="h-4 w-4" />
          <span>{t('filterOfficial', { count: officialCount })}</span>
        </button>

        <button
          onClick={() => setActiveFilter('private')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] cursor-pointer flex items-center gap-2 ${
            activeFilter === 'private'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
          style={activeFilter === 'private' ? { background: '#D97706' } : {}}
        >
          <Building2 className="h-4 w-4" />
          <span>{t('filterPrivate', { count: privateCount })}</span>
        </button>
      </div>

      {/* Parking Zones Cards */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        {filteredZones.map((zone, index) => {
          const name = zone.name[locale] || zone.name.en;
          const isPrivate = zone.parkingType === 'private' || zone.parkingType === 'commercial';

          return (
            <div
              key={zone.id}
              className="card overflow-hidden p-0 space-y-0 animate-fade-up hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Parking Zone Image */}
                {zone.imageUrl && (
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={zone.imageUrl}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    
                    {/* Badges over image */}
                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-md border ${
                          isPrivate
                            ? 'bg-amber-500/90 text-white border-amber-300/40'
                            : 'bg-blue-600/90 text-white border-blue-400/40'
                        }`}
                      >
                        {isPrivate ? <Building2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        <span>{isPrivate ? t('privateTag') : t('officialTag')}</span>
                      </span>

                      {zone.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md border border-emerald-400/40">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    {/* Title over bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h2 className="text-lg font-black text-white drop-shadow-md leading-snug">
                        {name}
                      </h2>
                      {zone.address && (
                        <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-medium">
                          {zone.address}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Supported Vehicles */}
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      {t('vehicleTypesLabel')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {zone.vehicleTypes.map((vType) => (
                        <span
                          key={vType}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider"
                        >
                          {vType === 'car' && <Car className="h-3.5 w-3.5 text-blue-600" />}
                          {vType === 'bus' && <Bus className="h-3.5 w-3.5 text-amber-600" />}
                          {vType === 'two_wheeler' && <Bike className="h-3.5 w-3.5 text-emerald-600" />}
                          {vType === 'heavy_vehicle' && <Bus className="h-3.5 w-3.5 text-purple-600" />}
                          {vType.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Pricing Box ────────────────────────────────────────────── */}
                  <div
                    className={`p-3.5 rounded-xl border ${
                      zone.pricing?.isFree
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span>{t('pricingLabel')}</span>
                      </div>
                      {zone.pricing?.isFree ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                          Free
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-600 text-white uppercase tracking-wider">
                          Standard Rates
                        </span>
                      )}
                    </div>

                    {zone.pricing?.isFree ? (
                      <p className="text-xs font-bold text-emerald-800">
                        {t('freeParking')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {zone.pricing?.carDaily && (
                          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">{t('carRate')}</span>
                            <span className="font-black text-slate-900 text-sm">₹{zone.pricing.carDaily}</span>
                            <span className="text-[10px] text-slate-400">/{t('perDay')}</span>
                          </div>
                        )}
                        {zone.pricing?.twoWheelerDaily && (
                          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">{t('bikeRate')}</span>
                            <span className="font-black text-slate-900 text-sm">₹{zone.pricing.twoWheelerDaily}</span>
                            <span className="text-[10px] text-slate-400">/{t('perDay')}</span>
                          </div>
                        )}
                        {zone.pricing?.hourlyRate && (
                          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">Hourly</span>
                            <span className="font-black text-slate-900 text-sm">₹{zone.pricing.hourlyRate}</span>
                            <span className="text-[10px] text-slate-400">/{t('perHour')}</span>
                          </div>
                        )}
                        {zone.pricing?.busDaily && (
                          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-slate-500 block">{t('busRate')}</span>
                            <span className="font-black text-slate-900 text-sm">₹{zone.pricing.busDaily}</span>
                            <span className="text-[10px] text-slate-400">/{t('perDay')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500 block">{t('capacityLabel')}</span>
                      {zone.capacityVehicles ? (
                        <span className="font-bold text-slate-800">~{zone.capacityVehicles.toLocaleString()} vehicles</span>
                      ) : (
                        <span className="placeholder-badge">PLACEHOLDER</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('shuttleLabel')}</span>
                      {zone.shuttleAvailable !== null ? (
                        <span className={`font-bold ${zone.shuttleAvailable ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {zone.shuttleAvailable ? t('shuttleYes') : t('shuttleNo')}
                        </span>
                      ) : (
                        <span className="placeholder-badge">PLACEHOLDER</span>
                      )}
                    </div>
                    {zone.distanceToMainGhatKm !== null && (
                      <div className="col-span-2 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 block">{t('distanceLabel')}</span>
                        <span className="font-bold text-slate-800">{zone.distanceToMainGhatKm} km to central ghat</span>
                      </div>
                    )}
                  </div>

                  {/* Amenities / Security Features */}
                  {zone.amenities && zone.amenities.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-1">
                        {t('amenitiesLabel')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {zone.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map & Call Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                {zone.contactPhone ? (
                  <a
                    href={`tel:${zone.contactPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{zone.contactPhone}</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">
                    {zone.coordinates.lat.toFixed(4)}, {zone.coordinates.lng.toFixed(4)}
                  </span>
                )}

                <a
                  href={`https://maps.google.com/?q=${zone.coordinates.lat},${zone.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-navy-800 transition-all ml-auto"
                  style={{ color: '#1B2B4B' }}
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-600" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
