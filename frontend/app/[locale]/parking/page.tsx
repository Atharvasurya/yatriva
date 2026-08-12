'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ParkingCircle, Car, Bus, Bike, MapPin, AlertTriangle } from 'lucide-react';
import { PARKING_ZONES } from '@/data/seed';

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #9A7208 0%, #1B2B4B 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <ParkingCircle className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{t('title')}</h1>
            <p className="text-white/90 text-sm mt-1 max-w-xl">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Unverified Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          {t('unverifiedNotice')}
        </p>
      </div>

      {/* Parking Zones Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PARKING_ZONES.map((zone, index) => {
          const name = zone.name[locale] || zone.name.en;

          return (
            <div
              key={zone.id}
              className={`card p-5 space-y-4 animate-fade-up delay-${(index + 1) * 100}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-black text-navy-800" style={{ color: '#1B2B4B' }}>
                  {name}
                </h2>
                <span className="placeholder-badge shrink-0 inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  <span>PLACEHOLDER</span>
                </span>
              </div>

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
                    <span className="font-bold text-slate-800">{zone.capacityVehicles} vehicles</span>
                  ) : (
                    <span className="placeholder-badge">PLACEHOLDER</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block">{t('shuttleLabel')}</span>
                  {zone.shuttleAvailable !== null ? (
                    <span className="font-bold text-slate-800">
                      {zone.shuttleAvailable ? t('shuttleYes') : t('shuttleNo')}
                    </span>
                  ) : (
                    <span className="placeholder-badge">PLACEHOLDER</span>
                  )}
                </div>
              </div>

              {/* Map Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Lat: {zone.coordinates.lat}, Lng: {zone.coordinates.lng}
                </span>

                <a
                  href={`https://maps.google.com/?q=${zone.coordinates.lat},${zone.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-saffron-600"
                  style={{ color: '#1B2B4B' }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Open Map</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
