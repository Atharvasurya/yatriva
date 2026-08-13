'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Heart, Cpu, Globe, Info, Users, Code, Sparkles, Mail } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');

  const teamMembers = [
    {
      name: 'Atharva Ravindra Suryawanshi',
      role: 'Co-Founder & Lead Developer',
      bio: 'Passionate full-stack developer dedicated to building high-performance, offline-first digital experiences for millions of pilgrims visiting Nashik Kumbh Mela 2027.',
      image: '/images/team/atharva.png',
      tags: ['Full Stack', 'Next.js', 'System Architecture'],
    },
    {
      name: 'Khushal Kulkarni',
      role: 'Co-Founder & Product Architect',
      bio: 'Innovator and product strategist focused on user experience, AI assistance integration, and accessible smart navigation tools for sacred heritage exploration.',
      image: '/images/team/khushal.png',
      tags: ['Product Design', 'AI Integration', 'UX Strategy'],
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-600" />
            <span>The Minds Behind Yatriva</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Meet Our Team</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Engineers and designers building multi-lingual, resilient digital tools for Nashik Simhastha Kumbh Mela 2027.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div>
                {/* Team Member Photo */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold tracking-tight drop-shadow-md">{member.name}</h3>
                    <p className="text-xs font-semibold text-amber-300 drop-shadow">{member.role}</p>
                  </div>
                </div>

                {/* Team Member Info */}
                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {member.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
