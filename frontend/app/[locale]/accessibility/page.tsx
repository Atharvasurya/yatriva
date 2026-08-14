import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Heart, Shield, Accessibility, Armchair, Zap, HeartPulse, MapPin, Phone, CheckCircle2, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

const STEP_FREE_ROUTES = [
  {
    titleEn: 'Ramkund North Ghat Gentle Ramp Corridor',
    titleHi: 'रामकुंड उत्तर घाट सुगम रैंप मार्ग',
    titleMr: 'रामकुंड उत्तर घाट सुलभ रॅम्प कॉरिडॉर',
    location: 'From Panchavati Karanja via Malviya Chowk to Ramkund Ghat',
    gradient: 'Gentle 1:12 Incline (Full Wheelchair & Walker Compliant)',
    features: ['Non-slip rubber flooring', 'Dual stainless steel handrails', 'Zero stairs throughout the 400m path'],
    tag: 'Wheelchair & Walker Friendly',
  },
  {
    titleEn: 'Godavari Maha Aarti Step-Free Viewing Deck',
    titleHi: 'गोदावरी महा आरती सुगम दर्शन डेक',
    titleMr: 'गोदावरी महा आरती सुलभ दर्शन डेक',
    location: 'Godavari Riverfront South Bank (Near Gandhi Smarak)',
    gradient: 'Elevator & Ramp access directly to shaded seating enclosure',
    features: ['Reserved 150 wheelchair seats', 'Free drinking water at seat', 'Direct view of holy evening Aarti'],
    tag: 'Reserved Seating',
  },
  {
    titleEn: 'Trimbakeshwar Temple West Gate Accessibility Ramp',
    titleHi: 'त्र्यंबकेश्वर मंदिर पश्चिम द्वार सुलभ रैंप',
    titleMr: 'त्र्यंबकेश्वर मंदिर पश्चिम द्वार रॅम्प',
    location: 'Trimbak West Gate (Divyangjan & Senior Citizen Dedicated Queue)',
    gradient: 'Direct level pathway avoiding the main eastern stone staircase',
    features: ['Priority queue for elders (60+)', 'Motorized wheelchair charging point', 'First-aid post at entrance'],
    tag: 'Priority Darshan Line',
  },
];

const SENIOR_REST_LOUNGES = [
  {
    nameEn: 'Panchavati Senior Citizen Rest Shelter (विश्राम कक्ष)',
    nameHi: 'पंचवटी वरिष्ठ नागरिक विश्राम कक्ष',
    nameMr: 'पंचवटी ज्येष्ठ नागरिक विश्राम कक्ष',
    location: 'Near Kalaram Mandir East Gate (Shaded Hall)',
    capacity: '200 Seated Pilgrims',
    amenities: ['Air-cooled misting fans', 'Free RO drinking water & herbal tea', 'Reclining seating chairs', 'Doctor on standby'],
  },
  {
    nameEn: 'Ramkund Riverfront Senior Care Pavillion',
    nameHi: 'रामकुंड रिवरफ्रंट वरिष्ठ सेवा मंडप',
    nameMr: 'रामकुंड ज्येष्ठ नागरिक सेवा मंडप',
    location: 'Next to Ramkund Life-Guard Control Post',
    capacity: '150 Seated Pilgrims',
    amenities: ['Quiet resting zone', 'Free ORS & energy biscuits', 'Foot reflexology & basic physiotherapy'],
  },
  {
    nameEn: 'Tapovan Sadhugram Elder Shelter Sector 3',
    nameHi: 'तपोवन साधुग्राम वरिष्ठ विश्राम गृह',
    nameMr: 'तपोवन साधुग्राम ज्येष्ठ विश्राम कक्ष',
    location: 'Sadhugram Sector 3 Main Hub',
    capacity: '300 Seated Pilgrims',
    amenities: ['Clean mobile disabled toilets', 'Free 24x7 hot water', 'Charging stations for hearing aids/phones'],
  },
];

const E_RICKSHAW_STANDS = [
  {
    route: 'CBS Central Bus Stand ➔ Panchavati Karanja',
    distance: '2.4 km',
    fare: 'FREE for Seniors (60+) & Divyangjan',
    hours: '24 Hours on Snan Dates',
    note: 'Boarding at CBS Platform #6. Look for the yellow Senior Citizen E-Cart flag.',
  },
  {
    route: 'Vilholi Outer Ring Parking ➔ Old CBS Security Ring',
    distance: '4.8 km',
    fare: 'FREE Shuttle Service',
    hours: '04:00 AM – 11:00 PM',
    note: 'Battery operated low-floor 12-seater mini buses.',
  },
  {
    route: 'Trimbak Dugaon Parking ➔ Kushavarta Outer Cordon',
    distance: '3.2 km',
    fare: 'FREE Shuttle Service',
    hours: '24 Hours on Snan Dates',
    note: 'Priority boarding with helper assistance.',
  },
];

export default async function AccessibilityPage({ params }: Props) {
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
              <Accessibility className="h-3.5 w-3.5 text-indigo-600" />
              <span>Elderly & Divyangjan Assistance</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Senior Citizen & Accessibility Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Comfort, mobility, step-free routes, and medical care for senior citizens and Divyangjan at Simhastha Kumbh 2027.
            </p>
          </div>
        </div>

        {/* Priority Emergency Call Banner */}
        <div
          className="p-5 rounded-3xl border text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
          style={{ background: '#0F1E35', borderColor: 'rgba(232, 119, 34, 0.4)' }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-saffron-500 animate-ping" />
              <h3 className="font-black text-base text-amber-300">
                Senior Emergency Transfer & Stretcher Assistance
              </h3>
            </div>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              If an elderly relative experiences extreme fatigue, dizziness, or is unable to climb ghat stairs, contact the dedicated 24x7 Senior Care Desk for immediate battery-cart or stretcher evacuation.
            </p>
          </div>
          <a
            href="tel:108"
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span>Dial Medical Care (108)</span>
          </a>
        </div>

        {/* Step-Free & Wheelchair Routes */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-indigo-600" />
              <span>Step-Free & Wheelchair Corridors</span>
            </h2>
            <p className="text-xs text-slate-600">
              Verified accessible routes avoiding high-step staircases along Ramkund and Trimbakeshwar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEP_FREE_ROUTES.map((route, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 inline-block">
                    {route.tag}
                  </span>
                  <h3 className="font-black text-sm text-slate-900 leading-snug">
                    {locale === 'hi' ? route.titleHi : locale === 'mr' ? route.titleMr : route.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{route.location}</span>
                  </p>
                  <p className="text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
                    📐 {route.gradient}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  {route.features.map((f, idx) => (
                    <p key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Senior Citizen Rest Lounges */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Armchair className="h-5 w-5 text-amber-600" style={{ color: '#E87722' }} />
              <span>Senior Citizen Rest Lounges (विश्राम कक्ष)</span>
            </h2>
            <p className="text-xs text-slate-600">
              Shaded, air-cooled resting shelters with free seating, clean drinking water, and basic health triage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SENIOR_REST_LOUNGES.map((lounge, i) => (
              <div key={i} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3">
                <div>
                  <h3 className="font-black text-sm text-navy-950 leading-snug">
                    {locale === 'hi' ? lounge.nameHi : locale === 'mr' ? lounge.nameMr : lounge.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{lounge.location}</span>
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-200/60 text-amber-900">
                    Capacity: {lounge.capacity}
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-amber-200/60">
                  {lounge.amenities.map((a, idx) => (
                    <p key={idx} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>{a}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free E-Rickshaw & Battery Cart Stand Directory */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <span>Free E-Rickshaw & Battery Cart Boarding</span>
            </h2>
            <p className="text-xs text-slate-600">
              Complimentary transit carts exclusively for elderly pilgrims (60+) and Divyangjan between outer cordons and sacred ghats.
            </p>
          </div>

          <div className="space-y-3">
            {E_RICKSHAW_STANDS.map((stand, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-slate-900">{stand.route}</h3>
                  <p className="text-xs text-slate-600">{stand.note}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {stand.fare}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    ⏱️ {stand.hours}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Triage & Insulin Storage */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-red-600" />
              <span>Insulin Cold Storage & Blood Pressure Checkpoints</span>
            </h2>
            <p className="text-xs text-slate-600">
              Free 24x7 medical support kiosks for diabetic care and elderly monitoring during peak heat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-2">
              <h3 className="font-black text-xs sm:text-sm text-red-950">
                🧊 Free Insulin Cold-Storage Vaults
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Diabetic pilgrims carrying insulin pens can deposit them in temperature-monitored refrigerated lockers located at:
              </p>
              <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                <li>Ramkund 24x7 Emergency Medical Hospital Post</li>
                <li>Panchavati Karanja Red Cross Clinic</li>
                <li>Trimbakeshwar Government Hospital Camp</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <h3 className="font-black text-xs sm:text-sm text-blue-950">
                🩺 Free Vitals & BP Kiosks
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Every 500 meters along walking corridors, volunteers and nursing staff provide free:
              </p>
              <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                <li>Instant Blood Pressure & Pulse-Oximeter checks</li>
                <li>Rapid blood sugar test strips</li>
                <li>Free ORS & electrolyte rehydration packets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
