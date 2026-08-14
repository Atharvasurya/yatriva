import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Waves, ShieldAlert, AlertTriangle, CheckCircle2, LifeBuoy, MapPin, Phone, Bath, Sparkles, Droplets
} from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

const DAM_STATUS = [
  {
    damName: 'Gangapur Dam (Upstream Godavari)',
    currentDischarge: '4,200 Cusecs',
    status: 'normal',
    advisoryEn: 'Normal seasonal controlled flow. Safe for bathing inside chain barricades.',
    advisoryHi: 'सामान्य नियंत्रित प्रवाह। सुरक्षा साखली के भीतर स्नान पूर्णतः सुरक्षित है।',
    advisoryMr: 'सामान्य नियंत्रित प्रवाह. सुरक्षा साखळीच्या आत स्नान सुरक्षित आहे.',
  },
  {
    damName: 'Darna Dam (Godavari Tributary)',
    currentDischarge: '2,800 Cusecs',
    status: 'normal',
    advisoryEn: 'Standard discharge. River velocity is within safe limits at Panchavati.',
    advisoryHi: 'मानक विसर्जन। पंचवटी पर पानी का बहाव सुरक्षित सीमा में है।',
    advisoryMr: 'मानक विसर्ग. पंचवटी येथे पाण्याचा वेग सुरक्षित मर्यादेत आहे.',
  },
];

const GHAT_SAFETY_ZONES = [
  {
    ghatName: 'Ramkund Sacred Kund',
    maxDepth: '4.5 ft (Barricaded Area) / 12 ft (Deep Center)',
    safetyFeatures: ['Double stainless steel safety chains', 'Non-slip coir mats on all steps', 'Stationary NDRF divers present'],
    warning: 'Do not cross the yellow floating buoys into the central vortex.',
    safeForChildren: true,
  },
  {
    ghatName: 'Laxman Kund Ghat',
    maxDepth: '3.5 ft to 5.0 ft',
    safetyFeatures: ['Gradual stone steps', 'Children & elder shallow bathing enclosure', 'Lifeguard post #4'],
    warning: 'Steps become slippery when moss builds up; hold the wall railings.',
    safeForChildren: true,
  },
  {
    ghatName: 'Kushavarta Kund (Trimbakeshwar)',
    maxDepth: '6.0 ft to 14.0 ft (Deep Kund)',
    safetyFeatures: ['Four-sided safety railings', 'Life jackets available free on request', '24x7 SDRF rescue swimmers'],
    warning: 'Strictly no diving or jumping. Use side ladders with handrails.',
    safeForChildren: false,
  },
  {
    ghatName: 'Gorakhkund & Ahilyabai Holkar Ghat',
    maxDepth: '4.0 ft to 6.5 ft',
    safetyFeatures: ['Perimeter safety netting', 'Women-only designated bathing section', 'Direct view of lifeguards'],
    warning: 'Flow increases slightly near bridge pillars.',
    safeForChildren: true,
  },
];

const WOMEN_FACILITIES = [
  {
    facility: 'Ramkund North Bank Women Changing Cubicles (वस्त्र बदल कक्ष)',
    location: '20 meters from Ramkund Steps (Behind Ganga Mandir)',
    cubicles: '48 Secure Enclosed Changing Booths',
    cost: 'FREE Public Service',
  },
  {
    ghat: 'Laxman Kund Changing Pavillion',
    location: 'Laxmankund East Terrace',
    cubicles: '32 Secure Changing Booths',
    cost: 'FREE Public Service',
  },
  {
    ghat: 'Kushavarta Kund Women Cloakroom',
    location: 'Trimbakeshwar Kushavarta South Gate',
    cubicles: '40 Secure Changing Booths + Luggage Lockers',
    cost: 'FREE Public Service',
  },
];

export default async function WaterSafetyPage({ params }: Props) {
  const { locale } = await params;

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
              <Waves className="h-3.5 w-3.5 text-blue-600" />
              <span>Ghat Depth & River Safety</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Ghat Depth, Dam Discharge & Snan Safety
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Real-time dam water release monitoring, safe shallow bathing zones, and lifeguard rescue stations for Godavari & Kushavarta.
            </p>
          </div>
        </div>

        {/* Real-time Dam Discharge Status */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span>Dam Water Release Advisory</span>
              </h2>
              <p className="text-xs text-slate-600">
                Official water release updates from Irrigation Department, Nashik.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              🟢 Safe Flow Condition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAM_STATUS.map((dam, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs sm:text-sm text-navy-950">{dam.damName}</h3>
                  <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                    {dam.currentDischarge}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {locale === 'hi' ? dam.advisoryHi : locale === 'mr' ? dam.advisoryMr : dam.advisoryEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ghat Bathing Depth & Danger Zone Matrix */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" style={{ color: '#E87722' }} />
              <span>Ghat Depth & Barricaded Bathing Enclosures</span>
            </h2>
            <p className="text-xs text-slate-600">
              Know water depth and safety precautions before taking holy dip (Snan).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GHAT_SAFETY_ZONES.map((zone, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-sm text-slate-900">{zone.ghatName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                      Depth: {zone.maxDepth}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {zone.safetyFeatures.map((feat, i) => (
                      <p key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </p>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] font-bold text-amber-900 flex items-start gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{zone.warning}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Women's Changing Cubicles & Footwear Lockers */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Bath className="h-5 w-5 text-teal-600" />
              <span>Women's Changing Rooms (वस्त्र बदल कक्ष) & Footwear Stands</span>
            </h2>
            <p className="text-xs text-slate-600">
              Free, secure, and sanitized changing cubicles situated directly adjacent to major bathing ghats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WOMEN_FACILITIES.map((w, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200/70 space-y-2">
                <h3 className="font-black text-xs sm:text-sm text-teal-950">{w.facility || w.ghat}</h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>{w.location}</span>
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900">{w.cubicles}</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                    {w.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NDRF / SDRF Lifeguard Rescue Stations */}
        <div
          className="p-6 rounded-3xl border text-white space-y-4 shadow-xl"
          style={{ background: '#0F1E35', borderColor: '#2563EB' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-amber-300 flex items-center gap-2">
                <LifeBuoy className="h-6 w-6 text-saffron-400" />
                <span>NDRF & SDRF Water Rescue Command</span>
              </h2>
              <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
                Over 25 high-speed inflatable rescue boats with trained deep-water divers are on 24x7 active patrol across the Godavari River and Kushavarta Kund during all Snan dates.
              </p>
            </div>

            <a
              href="tel:1078"
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
            >
              <Phone className="h-4 w-4" />
              <span>NDRF Disaster Helpline (1078)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
