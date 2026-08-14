'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Mail,
  MapPin,
  Sparkles,
  PhoneCall,
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Shield,
  Clock,
  HeartHandshake
} from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setSubmitting(true);
    // Simulate network transmission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
    }, 900);
  };

  const EMERGENCY_HELPLINES = [
    { title: 'Police Control Room', number: '112', desc: 'Immediate police response & lost person reports', color: 'border-blue-200 bg-blue-50/70 text-blue-900', btnColor: '#1E40AF' },
    { title: 'Ambulance & Medical', number: '108', desc: 'Emergency medical aid & hospital dispatch', color: 'border-red-200 bg-red-50/70 text-red-900', btnColor: '#DC2626' },
    { title: 'Disaster Management', number: '1077', desc: 'District Kumbh Mela disaster cell', color: 'border-amber-200 bg-amber-50/70 text-amber-900', btnColor: '#D97706' },
    { title: 'Fire Brigade', number: '101', desc: 'Fire & river rescue operations', color: 'border-orange-200 bg-orange-50/70 text-orange-900', btnColor: '#EA580C' },
    { title: 'Women Safety Helpline', number: '1091', desc: '24x7 women safety & assistance helpline', color: 'border-purple-200 bg-purple-50/70 text-purple-900', btnColor: '#7C3AED' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fade-up">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl space-y-4"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #1B2B4B 50%, #2D4A7A 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('badge')}</span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 font-medium">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── Direct Contact Cards ────────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Email Support */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700 w-fit border border-amber-200">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-slate-900">{t('emailCardTitle')}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{t('emailCardDesc')}</p>
          <div className="pt-2 space-y-1 text-xs font-bold text-amber-800">
            <a href="mailto:atharvasuryawanshi@gmail.com" className="block hover:underline truncate">
              atharvasuryawanshi@gmail.com
            </a>
            <a href="mailto:khushalkulkarni@gmail.com" className="block hover:underline truncate">
              khushalkulkarni@gmail.com
            </a>
          </div>
        </div>

        {/* Headquarters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700 w-fit border border-blue-200">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-slate-900">{t('locationCardTitle')}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{t('locationCardDesc')}</p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Serving Kumbh Mela 2027</span>
          </div>
        </div>

        {/* Community Initiative */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 w-fit border border-emerald-200">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-slate-900">{t('initiativeCardTitle')}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{t('initiativeCardDesc')}</p>
          <div className="pt-2">
            <Link
              href={`/${locale}/about`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>Learn about our team →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Section: Interactive Form & Live Assistance ────────────────── */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('formTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('formSubtitle')}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-black text-lg text-emerald-950">{t('successTitle')}</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  {t('successMsg')}
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {t('sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t('nameLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('namePlaceholder')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t('emailLabel')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('phonePlaceholder')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Topic / Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t('subjectLabel')}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  >
                    <option value="general">{t('subjects.general')}</option>
                    <option value="correction">{t('subjects.correction')}</option>
                    <option value="safety">{t('subjects.safety')}</option>
                    <option value="volunteer">{t('subjects.volunteer')}</option>
                    <option value="other">{t('subjects.other')}</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('messageLabel')} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('messagePlaceholder')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: '#1B2B4B' }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('sending')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('submitBtn')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Side Panel: AI Assistant CTA & Quick Answers */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Instant Assistant Card */}
          <div
            className="rounded-3xl p-6 text-white space-y-4 shadow-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)' }}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">Need Immediate Pilgrimage Answers?</h3>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Ask our grounded AI Pilgrim Assistant for instant questions regarding bathing dates, ghat locations, shuttle bus parking, and accessibility.
            </p>
            <Link
              href={`/${locale}/assistant`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 text-xs font-bold shadow-md hover:bg-slate-100 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Launch AI Assistant →</span>
            </Link>
          </div>

          {/* Quick Helpline Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Need Emergency Assistance?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              For on-ground medical emergencies, lost children, or security issues at Kumbh Mela, call the official helplines below.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Ambulance 108</span>
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Police 112</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Official Emergency Helplines Section ─────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t('emergencyHeading')}</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('emergencyNotice')}
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {EMERGENCY_HELPLINES.map((helpline, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${helpline.color}`}
            >
              <div className="space-y-0.5 min-w-0">
                <p className="font-black text-sm text-slate-900 leading-tight">{helpline.title}</p>
                <p className="text-[11px] text-slate-600 leading-snug">{helpline.desc}</p>
              </div>
              <a
                href={`tel:${helpline.number}`}
                className="px-3.5 py-2 rounded-xl text-white font-black text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                style={{ background: helpline.btnColor }}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{helpline.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
