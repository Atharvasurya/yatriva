'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  ParkingCircle,
  Car,
  Bus,
  Bike,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Navigation,
  Sparkles
} from 'lucide-react';
import { PARKING_ZONES } from '@/data/seed';
import ParkingClipart from '@/components/ui/ParkingClipart';

export default function ParkingPage() {
  const t = useTranslations('parking');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl space-y-3"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #3B2A10 50%, #9A7208 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nashik Kumbh Mela 2027 Parking Plan</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner hidden sm:flex">
            <ParkingCircle className="h-9 w-9 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">{t('title')}</h1>
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

      {/* Parking Zones Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {PARKING_ZONES.map((zone, index) => {
          const name = zone.name[locale] || zone.name.en;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 animate-fade-up delay-${((index % 4) + 1) * 100}`}
            >
              {/* Clipart Banner with floating status badge */}
              <div className="relative">
                <ParkingClipart zoneId={zone.id} zoneName={name} />

                {/* Verified / Status Badge */}
                <div className="absolute top-3 right-3 z-20">
                  {zone.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-md border border-emerald-300/40">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-md">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Approximate</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Supported Vehicles */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    {t('vehicleTypesLabel')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.vehicleTypes.map((vType) => (
                      <span
                        key={vType}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200"
                      >
                        {vType === 'car' && <Car className="h-3.5 w-3.5 text-blue-600" />}
                        {vType === 'bus' && <Bus className="h-3.5 w-3.5 text-emerald-600" />}
                        {vType === 'two_wheeler' && <Bike className="h-3.5 w-3.5 text-amber-600" />}
                        {vType === 'heavy_vehicle' && <Bus className="h-3.5 w-3.5 text-purple-600" />}
                        <span>{vType.replace('_', ' ')}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium block">{t('capacityLabel')}</span>
                    {zone.capacityVehicles ? (
                      <span className="font-extrabold text-slate-900 text-sm">~{zone.capacityVehicles.toLocaleString()} vehicles</span>
                    ) : (
                      <span className="text-amber-700 font-semibold italic">5,000+ est.</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">{t('shuttleLabel')}</span>
                    {zone.shuttleAvailable !== null ? (
                      <span className="font-bold text-emerald-700 text-sm">
                        {zone.shuttleAvailable ? t('shuttleYes') : t('shuttleNo')}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-semibold">Available</span>
                    )}
                  </div>
                  {zone.distanceToMainGhatKm !== null && (
                    <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t('distanceLabel')}:</span>
                      <span className="font-extrabold text-slate-900">{zone.distanceToMainGhatKm} km to Ramkund / core buffer</span>
                    </div>
                  )}
                </div>

                {/* Map Navigation Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Lat: {zone.coordinates.lat.toFixed(4)}, Lng: {zone.coordinates.lng.toFixed(4)}
                  </span>

                  <a
                    href={`https://maps.google.com/?q=${zone.coordinates.lat},${zone.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Navigate</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
