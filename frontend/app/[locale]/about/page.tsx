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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* ── Meet Our Team Section (Positioned First) ───────────────────────── */}
      <div className="space-y-6 animate-fade-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{t('teamBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t('teamTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t('teamSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/80 text-center space-y-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Bigger Circle Profile Image */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover object-top border-4 border-amber-500 shadow-xl"
                />
              </div>

              {/* Member Details */}
              <div className="space-y-2 pt-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {member.bio}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{member.location}</span>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-xs sm:text-sm font-bold transition-all border border-slate-200 shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-amber-600" />
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
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up delay-100 text-center sm:text-left"
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
        <div className="bg-white rounded-2xl p-6 space-y-3 shadow-md border border-slate-200/80 animate-fade-up delay-200">
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

        <div className="bg-white rounded-2xl p-6 space-y-3 shadow-md border border-slate-200/80 animate-fade-up delay-300">
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
