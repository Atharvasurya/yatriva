'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Globe, Info, Users, Sparkles, MapPin, Mail } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');

  const teamMembers = [
    {
      name: 'Atharva Ravindra Suryawanshi',
      bio: 'Full-stack developer skilled in Next.js, React, Python, and cloud architecture. Focused on building high-performance, offline-first digital experiences.',
      location: 'Nashik, Maharashtra, India',
      email: 'atharvasuryawanshi@gmail.com',
      image: '/images/team/atharva.png',
    },
    {
      name: 'Khushal Hemant Kulkarni',
      bio: 'Management graduate skilled in UI/UX design, product strategy, and front-end development. Focused on user-centric product architecture and digital solutions.',
      location: 'Nashik, Maharashtra, India',
      email: 'khushalkulkarni@gmail.com',
      image: '/images/team/khushal.png',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12 sm:space-y-16">
      {/* ── Meet Our Team Section (Positioned First) ───────────────────────── */}
      <div className="space-y-8 animate-fade-up">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{t('teamBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">{t('teamTitle')}</h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('teamSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 text-center space-y-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Bigger Circle Profile Image */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover object-top border-4 border-amber-500 shadow-2xl"
                />
              </div>

              {/* Member Details */}
              <div className="space-y-3 pt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {member.bio}
                </p>

                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 font-semibold pt-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{member.location}</span>
                </div>

                <div className="pt-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-amber-600 hover:text-white text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    <Mail className="w-4 h-4 text-amber-300" />
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
        className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl animate-fade-up delay-100 text-center sm:text-left space-y-4"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D5FA8 100%)' }}
      >
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
            <Sparkles className="w-4 h-4" />
            {t('subtitle')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            {t('missionText')}
          </p>
        </div>
      </div>

      {/* Grid of Core Principles */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        <div className="bg-white rounded-3xl p-8 sm:p-9 space-y-4 shadow-xl border border-slate-200/80 animate-fade-up delay-200">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 w-fit shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">
            {t('dataTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('dataText')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-9 space-y-4 shadow-xl border border-slate-200/80 animate-fade-up delay-300">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-700 w-fit shadow-inner">
            <Globe className="h-7 w-7" />
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">
            {t('offlineTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('offlineText')}
          </p>
        </div>
      </div>

      {/* Legal & Governance */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 space-y-4 border-l-6 border-l-slate-900 shadow-xl border border-slate-200/80">
        <h2 className="font-extrabold text-xl text-slate-900 flex items-center gap-2.5">
          <Info className="h-6 w-6 text-amber-600 shrink-0" />
          {t('legalTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('legalText')}
        </p>
        <p className="text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
          {tFooter('unofficialNote')}
        </p>
      </div>
    </div>
  );
}
