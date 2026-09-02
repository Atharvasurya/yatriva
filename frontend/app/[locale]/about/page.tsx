'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, Globe, Info, Users, Sparkles, MapPin, Mail, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  const teamMembers = [
    {
      name: 'Atharva Ravindra Suryawanshi',
      bio: 'Full-stack developer skilled in Next.js, React, Python, and cloud architecture. Creator of Yatriva — building civic-tech visitor tools for Nashik Simhastha Kumbh Mela 2027.',
      location: 'Nashik, Maharashtra, India',
      email: 'atharvasuryawanshi@gmail.com',
      image: '/images/team/atharva.png',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Back to Home Navigation */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 border border-slate-200/90 hover:border-amber-300 text-xs font-bold shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:scale-95 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 text-amber-700 transition-transform group-hover:-translate-x-0.5" />
        <span>
          {locale === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : locale === 'mr' ? 'मुख्य पृष्ठावर परत जा' : 'Back to Home'}
        </span>
      </Link>

      {/* ── Meet Our Team Section (Positioned First) ───────────────────────── */}
      <div className="space-y-6 animate-fade-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('teamBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('teamTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t('teamSubtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-200/80 text-center space-y-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Profile Image */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover object-top border-3 border-amber-500 shadow-lg"
                />
              </div>

              {/* Member Details */}
              <div className="space-y-2 pt-0.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {member.bio}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{member.location}</span>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all border border-slate-200"
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

      {/* ── About Yatriva Hero Banner ───────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up delay-100 text-center sm:text-left space-y-3"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D5FA8 100%)' }}
      >
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
            <Sparkles className="w-3 h-3" />
            {t('subtitle')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            {t('missionText')}
          </p>
        </div>
      </div>

      {/* Grid of Core Principles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-md border border-slate-200/80 animate-fade-up delay-200">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 w-fit shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
            {t('dataTitle')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('dataText')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-md border border-slate-200/80 animate-fade-up delay-300">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 w-fit shadow-xs">
            <Globe className="h-5 w-5" />
          </div>
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
            {t('offlineTitle')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('offlineText')}
          </p>
        </div>
      </div>

      {/* Legal & Governance */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-3 border-l-4 border-l-slate-900 shadow-md border border-slate-200/80">
        <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <Info className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          {t('legalTitle')}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('legalText')}
        </p>
        <p className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          {tFooter('unofficialNote')}
        </p>
      </div>
    </div>
  );
}
