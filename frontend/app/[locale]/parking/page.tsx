'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ParkingCircle, Car, Bus, Bike, MapPin, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PARKING_ZONES } from '@/data/seed';

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

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

      {/* Parking Zones Cards */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        {PARKING_ZONES.map((zone, index) => {
          const name = zone.name[locale] || zone.name.en;

          return (
            <div
              key={zone.id}
              className={`card overflow-hidden p-0 space-y-0 animate-fade-up delay-${(index + 1) * 100} hover:shadow-xl transition-all duration-300 border border-slate-200/80`}
            >
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Verified Badge over image */}
                  <div className="absolute top-3 right-3 z-10">
                    {zone.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md border border-emerald-400/40">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="placeholder-badge shrink-0 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        <span>PLACEHOLDER</span>
                      </span>
                    )}
                  </div>

                  {/* Title over bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h2 className="text-lg font-black text-white drop-shadow-md leading-snug">
                      {name}
                    </h2>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4">
                {!zone.imageUrl && (
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-black text-navy-800" style={{ color: '#1B2B4B' }}>
                      {name}
                    </h2>
                    {zone.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="placeholder-badge shrink-0 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        <span>PLACEHOLDER</span>
                      </span>
                    )}
                  </div>
                )}

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
                      {vType === 'car' && <Car className="h-3.5 w-3.5" />}
                      {vType === 'bus' && <Bus className="h-3.5 w-3.5" />}
                      {vType === 'two_wheeler' && <Bike className="h-3.5 w-3.5" />}
                      {vType === 'heavy_vehicle' && <Bus className="h-3.5 w-3.5 text-amber-600" />}
                      {vType.replace('_', ' ')}
                    </span>
                  ))}
                </div>
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
                    <span className="font-bold text-emerald-700">
                      {zone.shuttleAvailable ? t('shuttleYes') : t('shuttleNo')}
                    </span>
                  ) : (
                    <span className="placeholder-badge">PLACEHOLDER</span>
                  )}
                </div>
                {zone.distanceToMainGhatKm !== null && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 block">{t('distanceLabel')}</span>
                    <span className="font-bold text-slate-800">{zone.distanceToMainGhatKm} km to central ghat buffer</span>
                  </div>
                )}
              </div>

              {/* Map Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Lat: {zone.coordinates.lat.toFixed(4)}, Lng: {zone.coordinates.lng.toFixed(4)}
                </span>

                <a
                  href={`https://maps.google.com/?q=${zone.coordinates.lat},${zone.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-saffron-600"
                  style={{ color: '#1B2B4B' }}
                >
                  <MapPin className="h-3.5 w-3.5" />
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
