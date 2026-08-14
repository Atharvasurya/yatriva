'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Sun, CloudRain, Thermometer, Droplets, ShieldAlert, HeartPulse, CheckSquare, Square, MapPin, Phone, Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react';

const WATER_BOOTH_CLUSTERS = [
  {
    cluster: 'Ramkund & Godavari Ghats Ring',
    kiosksCount: '48 RO Water Kiosks',
    location: 'Every 50 meters along riverbank steps',
    amenities: 'Chilled RO drinking water + ORS electrolyte powder sachets',
  },
  {
    cluster: 'Tapovan Sadhugram Sector 1-4',
    kiosksCount: '65 RO Water Kiosks',
    location: 'At every camp crossroad and dining pandal',
    amenities: 'Free filtered water + hot water for tea/seniors',
  },
  {
    cluster: 'Trimbakeshwar Temple & Kushavarta Ring',
    kiosksCount: '35 RO Water Kiosks',
    location: 'Along the pedestrian queue barricades',
    amenities: 'Continuous water dispensers with recyclable paper cups',
  },
  {
    cluster: 'CBS & Outer Satellite Parking Lots',
    kiosksCount: '50 RO Water Kiosks',
    location: 'At every shuttle bus boarding platform',
    amenities: 'Bottled water refill stations',
  },
];

const PACKING_ITEMS = [
  { id: 'water', labelEn: 'Reusable water bottle or hydration pouch', labelHi: 'पानी की बोतल या हाइड्रेशन पाउच', labelMr: 'पाण्याची बाटली किंवा हायड्रेशन पाऊच' },
  { id: 'pass', labelEn: 'Offline Pilgrim Safety Pass (Saved to Lockscreen)', labelHi: 'ऑफलाइन तीर्थयात्री सुरक्षा पास (फोन वॉलपेपर)', labelMr: 'ऑफलाइन भाविक सुरक्षा पास (फोन वॉलपेपर)' },
  { id: 'rain', labelEn: 'Compact umbrella or lightweight raincoat', labelHi: 'छोटा छाता या रेनकोट (मानसून बारिश हेतु)', labelMr: 'लहान छत्री किंवा रेनकोट' },
  { id: 'meds', labelEn: '5-Day personal prescription medications', labelHi: 'व्यक्तिगत 5 दिनों की आवश्यक दवाइयां', labelMr: 'वैयक्तिक ५ दिवसांची आवश्यक औषधे' },
  { id: 'cash', labelEn: 'Emergency cash reserve (₹2,000–₹5,000)', labelHi: 'पर्याप्त नकद राशि (UPI नेटवर्क धीमा हो सकता है)', labelMr: 'पुरेशी रोख रक्कम (गर्दीत UPI मंद होऊ शकते)' },
  { id: 'shoes', labelEn: 'Comfortable non-slip walking footwear', labelHi: 'आरामदायक नॉन-स्लिप जूते या चप्पल', labelMr: 'आरामदायी न घसरणाऱ्या चपला' },
  { id: 'power', labelEn: 'Fully charged power bank for phone', labelHi: 'फुल चार्ज पावर बैंक', labelMr: 'चार्ज केलेला पॉवर बँक' },
];

export default function WeatherHealthPage() {
  const t = useTranslations('weatherHealth');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    water: true,
    pass: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen text-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation & Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all inline-flex items-center justify-center min-h-[40px] min-w-[40px] shadow-2xs group shrink-0"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <Sun className="h-3.5 w-3.5 text-amber-600" />
              <span>Weather, Heat & Health</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Weather, Heatstroke & Pilgrim Health
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Free drinking water points, heat exhaustion first-aid, monsoon alerts, and essential pilgrimage packing.
            </p>
          </div>
        </div>

        {/* Live Weather Forecast Card */}
        <div
          className="p-6 rounded-3xl border text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: '#0F1E35', borderColor: '#E87722' }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-amber-400 animate-spin-slow" />
              <h2 className="text-xl font-black text-amber-300">
                Nashik-Trimbak Seasonal Weather Snapshot
              </h2>
            </div>
            <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
              Monsoon Kumbh brings humid mornings (26°C–31°C) with sudden heavy rain showers. River steps become slippery quickly.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-white">29°C</span>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Avg Temp</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">74%</span>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Humidity</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-300">Moderate</span>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Rain Risk</p>
            </div>
          </div>
        </div>

        {/* Free RO Drinking Water Booths */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span>Free RO Drinking Water Points (जल सेवा) & ORS Booths</span>
            </h2>
            <p className="text-xs text-slate-600">
              Over 250 free community water distribution kiosks and ORS electrolyte booths across the Mela perimeter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WATER_BOOTH_CLUSTERS.map((w, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-navy-950">{w.cluster}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-200 text-blue-900">
                    {w.kiosksCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{w.location}</span>
                </p>
                <p className="text-xs font-semibold text-slate-700 pt-1 border-t border-blue-200/50">
                  💧 {w.amenities}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Heat Exhaustion & First Aid Guide */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-red-600" />
              <span>Heat Exhaustion, Cramps & Sunstroke First-Aid</span>
            </h2>
            <p className="text-xs text-slate-600">
              How to recognize early signs of dehydration and what immediate steps to take.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <h3 className="font-black text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Early Warning Symptoms</span>
              </h3>
              <ul className="text-xs text-slate-700 list-disc list-inside space-y-1">
                <li>Sudden dizziness, lightheadedness or headache</li>
                <li>Excessive sweating followed by clammy skin</li>
                <li>Painful leg or stomach muscle cramps</li>
                <li>Dark yellow urine or extreme dry mouth</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <h3 className="font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Immediate 4-Step Action</span>
              </h3>
              <ol className="text-xs text-slate-700 list-decimal list-inside space-y-1">
                <li>Move to a shaded rest lounge (*विश्राम कक्ष*) immediately.</li>
                <li>Loosen tight clothing and remove footwear.</li>
                <li>Sip cool water mixed with 1 packet of ORS (Electrolytes).</li>
                <li>If confused or vomiting, call <strong>108 Ambulance</strong> immediately.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Interactive Packing Checklist */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-saffron-600" style={{ color: '#E87722' }} />
                <span>Pilgrim Essentials Packing Checklist</span>
              </h2>
              <p className="text-xs text-slate-600">
                Check off items before leaving your home or hotel for the sacred ghats.
              </p>
            </div>
            <span className="text-xs font-extrabold text-saffron-800 bg-saffron-50 px-3 py-1 rounded-full border border-saffron-200">
              {Object.values(checkedItems).filter(Boolean).length} of {PACKING_ITEMS.length} Packed
            </span>
          </div>

          <div className="space-y-2.5">
            {PACKING_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              const label =
                locale === 'hi'
                  ? item.labelHi
                  : locale === 'mr'
                  ? item.labelMr
                  : item.labelEn;

              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{label}</span>
                  {isChecked ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
