'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Globe, Info, Users, Sparkles, MapPin, Mail, Award } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');

  const teamMembers = [
    {
      name: 'Atharva Ravindra Suryawanshi',
      role: 'Co-Founder & Lead Developer',
      location: 'Nashik, Maharashtra, India',
      email: 'atharvasuryawanshi@gmail.com',
      image: '/images/team/atharva.png',
    },
    {
      name: 'Khushal Kulkarni',
      role: 'Co-Founder & Product Architect',
      location: 'Nashik, Maharashtra, India',
      email: 'khushalkulkarni@gmail.com',
      image: '/images/team/khushal.png',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up text-center sm:text-left"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D5FA8 100%)' }}
      >
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            {t('subtitle')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            {t('missionText')}
          </p>
        </div>
      </div>

      {/* Grid of Core Principles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 space-y-3 shadow-md border border-slate-200/80 animate-fade-up delay-100">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">
            {t('dataTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('dataText')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-3 shadow-md border border-slate-200/80 animate-fade-up delay-200">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 w-fit">
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">
            {t('offlineTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('offlineText')}
          </p>
        </div>
      </div>

      {/* ── Meet Our Team Section ────────────────────────────────────────────── */}
      <div className="space-y-6 pt-4 animate-fade-up delay-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Users className="w-4 h-4 text-amber-600" />
            <span>The Minds Behind Yatriva</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Meet Our Team</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Engineers & product architects building multi-lingual, resilient digital guidance for Nashik Simhastha Kumbh Mela 2027.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-200/80 text-center space-y-4 hover:shadow-2xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1.5 relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Circle Profile Image with Ring Glow */}
              <div className="relative w-32 h-32 mx-auto pt-1">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 opacity-70 group-hover:opacity-100 blur-sm transition-opacity" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-full h-full rounded-full object-cover object-top border-4 border-white shadow-xl"
                />
              </div>

              {/* Member Details */}
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors">
                  {member.name}
                </h3>

                <p className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit mx-auto border border-amber-200/60">
                  {member.role}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{member.location}</span>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-bold transition-all border border-slate-200 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>{member.email}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Governance */}
      <div className="bg-white rounded-2xl p-6 space-y-3 border-l-4 border-l-slate-900 shadow-md border border-slate-200/80">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Info className="h-5 w-5 text-amber-600" />
          {t('legalTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('legalText')}
        </p>
        <p className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          {tFooter('unofficialNote')}
        </p>
      </div>
    </div>
  );
}
