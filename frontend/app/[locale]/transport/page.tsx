'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Bus, Train, Car, Footprints, Route as RouteIcon, MapPin, AlertCircle, ArrowRight, ShieldAlert, AlertTriangle, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TRANSPORT_HUBS, TRANSPORT_ROUTES } from '@/data/seed';

type Scenario = 'car' | 'train' | 'bus' | 'foot';

export default function TransportPage() {
  const t = useTranslations('transport');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [activeScenario, setActiveScenario] = useState<Scenario>('car');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D5FA8 50%, #3B82F6 100%)' }}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <Bus className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Official Schedule Verification Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold">
          {t('unverifiedNotice')}
        </p>
      </div>

      {/* ── Traveler Scenario Tabs ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-navy-800 uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
          {t('scenarioTitle')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveScenario('car')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeScenario === 'car'
                ? 'bg-navy-800 text-white border-navy-900 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            style={activeScenario === 'car' ? { background: '#1B2B4B' } : {}}
          >
            <Car className="h-4 w-4 text-saffron-400" />
            <span>{t('scenarioCar')}</span>
          </button>

          <button
            onClick={() => setActiveScenario('train')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeScenario === 'train'
                ? 'bg-navy-800 text-white border-navy-900 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            style={activeScenario === 'train' ? { background: '#1B2B4B' } : {}}
          >
            <Train className="h-4 w-4 text-saffron-400" />
            <span>{t('scenarioTrain')}</span>
          </button>

          <button
            onClick={() => setActiveScenario('bus')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeScenario === 'bus'
                ? 'bg-navy-800 text-white border-navy-900 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            style={activeScenario === 'bus' ? { background: '#1B2B4B' } : {}}
          >
            <Bus className="h-4 w-4 text-saffron-400" />
            <span>{t('scenarioBus')}</span>
          </button>

          <button
            onClick={() => setActiveScenario('foot')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeScenario === 'foot'
                ? 'bg-navy-800 text-white border-navy-900 shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            style={activeScenario === 'foot' ? { background: '#1B2B4B' } : {}}
          >
            <Footprints className="h-4 w-4" />
            <span>On Foot</span>
          </button>
        </div>

        {/* Scenario Details Box */}
        <div className="card p-5 space-y-4 animate-fade-up bg-slate-50 border-l-4 border-l-saffron-500" style={{ borderLeftColor: '#E87722' }}>
          {activeScenario === 'car' && (
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-black text-sm text-navy-800 flex items-center gap-2" style={{ color: '#1B2B4B' }}>
                <Car className="h-4 w-4 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
                <span>Guidance for Pilgrims Arriving by Car / Private Vehicle</span>
              </h3>
              <p>
                Private vehicles are restricted from entering inner city zones on Amrit Snan days. Drivers must park at outer ring Parking Zones (Zone A — Nashik Road or Zone B — Panchvati) and transfer to official Mela shuttle buses.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Key Vehicle Parking Rule:</p>
                <p>Outer parking capacity: <span className="font-semibold text-emerald-700">12,000 to 15,000 vehicles per outer sector (Vilholi, Adgaon, Nilgiri Baug, Dugaon)</span></p>
                <p>Shuttle bus frequency: <span className="font-semibold text-emerald-700">Dedicated high-frequency electric/CNG feeder shuttles every 5 minutes</span></p>
              </div>
            </div>
          )}

          {activeScenario === 'train' && (
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-black text-sm text-navy-800 flex items-center gap-2" style={{ color: '#1B2B4B' }}>
                <Train className="h-4 w-4 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
                <span>Guidance for Rail Passengers (Nashik Road Station - NK)</span>
              </h3>
              <p>
                Nashik Road Railway Station (NK) is the primary rail gateway, located ~9 km from Panchvati and Ramkund ghats. Special Kumbh Mela passenger trains will operate from Mumbai, Pune, Nagpur, Varanasi, and Delhi.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Station Connectivity:</p>
                <p>Mela direct rail shuttles: <span className="font-semibold text-emerald-700">MSRTC Mela Shuttle (MSRTC-K2) running 24x7 every 5 minutes</span></p>
                <p>Station to Ramkund route: <span className="font-semibold text-emerald-700">Direct transit via Dwarka Circle to Nimani / Panchavati terminal</span></p>
              </div>
            </div>
          )}

          {activeScenario === 'bus' && (
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-black text-sm text-navy-800 flex items-center gap-2" style={{ color: '#1B2B4B' }}>
                <Bus className="h-4 w-4 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
                <span>Guidance for Bus Travelers (CBS & Satellite Bus Stands)</span>
              </h3>
              <p>
                Central Bus Stand (CBS) Nashik handles intercity MSRTC buses. During peak Snan days, buses terminate at temporary satellite bus stands (Tapovan, Panchvati, Trimbak Road) to prevent inner city traffic gridlock.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">MSRTC Bus Operations:</p>
                <p>Nashik ⇄ Trimbakeshwar Express: <span className="font-semibold text-emerald-700">Route MSRTC-K1 every 5-10 minutes via NH848</span></p>
                <p>Inter-hub satellite shuttles: <span className="font-semibold text-emerald-700">Continuous loop shuttles connecting outer parkings to ghat buffers</span></p>
              </div>
            </div>
          )}

          {activeScenario === 'foot' && (
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-black text-sm text-navy-800 flex items-center gap-2" style={{ color: '#1B2B4B' }}>
                <Footprints className="h-4 w-4 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
                <span>Pedestrian Routes & Riverfront Foot Movements</span>
              </h3>
              <p>
                On Amrit Snan days, the Panchvati and Ramkund riverfront zones become 100% pedestrian-only zones. One-way walking loops guide pilgrims across Godavari footbridges to prevent surge congestion.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Pedestrian Safety Rules:</p>
                <p>Follow designated green-arrow walking corridors between Panchvati, Kalaram Temple, and Ramkund Ghat.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Nashik-Trimbakeshwar 28 km Logistics Split Banner ──────────────── */}
      <section className="card p-5 space-y-3 bg-gradient-to-r from-navy-800 to-navy-700 text-white rounded-2xl" style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)' }}>
        <div className="flex items-center gap-2.5 text-saffron-400 font-bold text-sm" style={{ color: '#E87722' }}>
          <RouteIcon className="h-5 w-5" />
          <span>{t('splitTitle')}</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed">
          {t('splitDescription')}
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
          <div>
            <span className="text-white/60 block">Nashik City Hub</span>
            <span className="font-bold text-white">Godavari Ramkund & Panchvati</span>
          </div>
          <div>
            <span className="text-white/60 block">Trimbak Hub (~28 km)</span>
            <span className="font-bold text-white">Trimbakeshwar Jyotirlinga & Kushavarta</span>
          </div>
        </div>
      </section>

      {/* Transport Hubs Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-navy-800 uppercase tracking-wider flex items-center gap-2" style={{ color: '#1B2B4B' }}>
          <Train className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
          {t('hubsTitle')}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {TRANSPORT_HUBS.map((hub, index) => {
            const name = hub.name[locale] || hub.name.en;
            const isRail = hub.hubType === 'railway_station';

            return (
              <div
                key={hub.id}
                className={`card p-5 animate-fade-up delay-${(index + 1) * 100} space-y-3`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-100 text-navy-700">
                      {isRail ? <Train className="h-5 w-5" /> : <Bus className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-navy-800" style={{ color: '#1B2B4B' }}>
                        {name}
                      </h3>
                      <p className="text-xs text-slate-500 capitalize">
                        {hub.hubType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {hub.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified Hub</span>
                    </span>
                  ) : (
                    <span className="placeholder-badge inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>PLACEHOLDER</span>
                    </span>
                  )}

                  <a
                    href={`https://maps.google.com/?q=${hub.coordinates.lat},${hub.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:underline"
                    style={{ color: '#1B2B4B' }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>View Map</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Routes Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-black text-navy-800 uppercase tracking-wider flex items-center gap-2" style={{ color: '#1B2B4B' }}>
          <RouteIcon className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
          {t('routesTitle')}
        </h2>

        <div className="space-y-3">
          {TRANSPORT_ROUTES.map((route) => {
            const routeName = locale === 'hi'
              ? route.routeNameHi
              : locale === 'mr'
              ? route.routeNameMr
              : route.routeNameEn;

            return (
              <div key={route.id} className="card p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {route.routeNumber && (
                      <span className="px-2.5 py-0.5 rounded bg-saffron-100 text-saffron-800 font-bold text-xs" style={{ background: '#FEF3C7', color: '#B45309' }}>
                        {route.routeNumber}
                      </span>
                    )}
                    <h3 className="font-bold text-lg" style={{ color: '#1B2B4B' }}>
                      {routeName}
                    </h3>
                  </div>
                  {route.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{route.operatorEn}</span>
                    </span>
                  ) : (
                    <span className="placeholder-badge inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>{route.operatorEn}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Route Segment</span>
                    <span className="font-bold text-slate-800">{route.origin} → {route.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('frequencyLabel')}</span>
                    {route.frequencyMinutes ? (
                      <span className="font-bold text-emerald-700">Every {route.frequencyMinutes} minutes (24x7 during Mela)</span>
                    ) : (
                      <span className="placeholder-badge">[PLACEHOLDER — verify]</span>
                    )}
                  </div>
                </div>

                {route.notes && (
                  <p className="text-xs text-slate-700 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5 font-medium">
                    <Info className="h-4 w-4 text-navy-700 shrink-0" style={{ color: '#1B2B4B' }} />
                    <span>{route.notes}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
