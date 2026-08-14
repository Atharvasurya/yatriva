import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Bus, Navigation, Ban, ParkingCircle, AlertTriangle, Clock, MapPin, CheckCircle2, ShieldCheck, ChevronRight, Compass
} from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

const HIGHWAY_CORRIDORS = [
  {
    highway: 'Mumbai / Thane / Pune Highway (NH3 South)',
    parking: 'Vilholi Outer Ring Mega Parking (15,000 Vehicles)',
    shuttle: 'Shuttle Route #1 ➔ Old CBS Terminal (Travel Time: ~14 mins)',
    color: '#2563EB',
    tag: 'From Mumbai / Pune',
  },
  {
    highway: 'Dhule / Indore / Madhya Pradesh Highway (NH3 North)',
    parking: 'Adgaon Truck Terminus Satellite Parking (12,000 Vehicles)',
    shuttle: 'Shuttle Route #2 ➔ Tapovan Sadhugram Hub (Travel Time: ~10 mins)',
    color: '#059669',
    tag: 'From North India',
  },
  {
    highway: 'Aurangabad / Jalna / Solapur Highway (NH753F)',
    parking: 'Nilgiri Baug Mega Parking (10,000 Vehicles)',
    shuttle: 'Shuttle Route #3 ➔ Panchavati Karanja Drop (Travel Time: ~12 mins)',
    color: '#D97706',
    tag: 'From Marathwada',
  },
  {
    highway: 'Nashik to Trimbakeshwar Highway (NH848)',
    parking: 'Dugaon Outer Satellite Parking (8,000 Vehicles)',
    shuttle: 'Shuttle Route #4 ➔ Kushavarta Outer Cordon (Travel Time: ~8 mins)',
    color: '#7C3AED',
    tag: 'For Trimbakeshwar',
  },
];

const PEDESTRIAN_CORRIDORS = [
  {
    nameEn: 'Saffron Corridor (CBS ➔ Ramkund Ghat)',
    nameHi: 'भगवा गलियारा (CBS ➔ रामकुंड)',
    nameMr: 'भगवा कॉरिडॉर (CBS ➔ रामकुंड)',
    distance: '2.1 km (Pedestrian Only)',
    features: ['Completely barricaded from shuttle buses', 'Free drinking water kiosks every 200m', 'Misting fans & shade tarpaulins'],
  },
  {
    nameEn: 'Green Corridor (Tapovan ➔ Ramkund North)',
    nameHi: 'हरा गलियारा (तपोवन ➔ रामकुंड उत्तर)',
    nameMr: 'हिरवा कॉरिडॉर (तपोवन ➔ रामकुंड उत्तर)',
    distance: '2.8 km (Pedestrian Only)',
    features: ['Direct walking route for Sadhus & Akharas', 'Wide 4-lane paved road with lighting', 'Emergency ambulance corridor on left lane'],
  },
  {
    nameEn: 'Blue Corridor (Trimbak Parking ➔ Kushavarta)',
    nameHi: 'नीला गलियारा (त्र्यंबक पार्किंग ➔ कुशावर्त)',
    nameMr: 'निळा कॉरिडॉर (त्र्यंबक पार्किंग ➔ कुशावर्त)',
    distance: '1.8 km (Pedestrian Only)',
    features: ['Covered canopy protecting from monsoon showers', 'Senior citizen battery cart bypass lane', 'Lost & Found booth #2 at midway point'],
  },
];

export default async function TrafficAdvisoryPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen text-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation & Page Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}`}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
              <Bus className="h-3.5 w-3.5 text-amber-600" />
              <span>Shahi Snan Transit Plan</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Traffic, Parking & Feeder Shuttle Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Private vehicle restrictions, outer satellite parking lots, and 24x7 free feeder shuttle bus networks for Simhastha Kumbh 2027.
            </p>
          </div>
        </div>

        {/* No Vehicle Zone Restriction Banner */}
        <div
          className="p-6 rounded-3xl border text-white space-y-3 shadow-xl"
          style={{ background: '#0F1E35', borderColor: '#DC2626' }}
        >
          <div className="flex items-center gap-2">
            <Ban className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-black text-white">
              Pedestrian-Only Core Zone (No Private Vehicles)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
            On all <strong>Amrit Snan (Shahi Snan) dates</strong> and their eve, a 10–15 km perimeter around Panchavati, Godavari Ghats, and Trimbakeshwar is strictly closed to all private cars, taxis, and auto-rickshaws. All pilgrims arriving by car must park at designated Outer Ring Mega Parking lots and board free feeder shuttle buses.
          </p>
        </div>

        {/* Highway-to-Parking Corridor Matrix */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ParkingCircle className="h-5 w-5 text-saffron-600" style={{ color: '#E87722' }} />
              <span>Highway-to-Parking Transit Routes</span>
            </h2>
            <p className="text-xs text-slate-600">
              Select your incoming highway route to find your designated satellite parking and connecting feeder bus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HIGHWAY_CORRIDORS.map((c, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white inline-block"
                    style={{ background: c.color }}
                  >
                    {c.tag}
                  </span>
                  <h3 className="font-black text-sm text-slate-900">{c.highway}</h3>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ParkingCircle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{c.parking}</span>
                    </p>
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                      <Bus className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{c.shuttle}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-2 border-t border-slate-200/60">
                  <span>Frequency: Every 5–8 mins</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    FREE Service
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color-Coded Pedestrian Walking Corridors */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Navigation className="h-5 w-5 text-indigo-600" />
              <span>Color-Coded Pedestrian Walking Corridors</span>
            </h2>
            <p className="text-xs text-slate-600">
              Safe walking corridors physically separated from active bus routes to ensure zero vehicle-pedestrian conflict.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PEDESTRIAN_CORRIDORS.map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/70 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-sm text-navy-950">
                    {locale === 'hi' ? p.nameHi : locale === 'mr' ? p.nameMr : p.nameEn}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-200 text-indigo-900">
                    {p.distance}
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-indigo-200/60">
                  {p.features.map((f, i) => (
                    <p key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-indigo-600 shrink-0" />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
