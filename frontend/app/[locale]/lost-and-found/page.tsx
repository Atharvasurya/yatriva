'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Search, PlusCircle, UserX, UserCheck, Phone, MapPin, ShieldAlert, AlertCircle, Filter, HelpCircle, CheckCircle2, X, MessageSquare, Radio, User, Clock, Languages, Shirt
} from 'lucide-react';

interface MissingPersonRecord {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'child';
  status: 'missing' | 'found' | 'reunited';
  lastSeenLocation: string;
  lastSeenTime: string;
  clothingDescription: string;
  primaryLanguage: string;
  contactNumber: string;
  reportedBy: string;
}

const INITIAL_RECORDS: MissingPersonRecord[] = [];

const POLICE_KHOYA_PAYA_BOOTHS = [
  {
    name: 'Ramkund Main Police Assistance & Khoya-Paya Booth',
    location: 'Ramkund Riverfront (Opposite Ganga Godavari Temple)',
    phone: '0253-2571234',
    frequency: 'PA Loudspeakers broadcasting across 12 zones',
  },
  {
    name: 'CBS Bus Stand Khoya-Paya Cell',
    location: 'Central Bus Stand (CBS) Terminal 1',
    phone: '0253-2575678',
    frequency: 'MSRTC Public Announcement Network',
  },
  {
    name: 'Trimbakeshwar Police Khoya-Paya Center',
    location: 'Near Kushavarta Kund Security Gate #2',
    phone: '02594-233100',
    frequency: 'Dedicated Temple Area Loudspeaker System',
  },
  {
    name: 'Tapovan Sadhugram Control Booth',
    location: 'Sadhugram Sector 2 Main Entrance',
    phone: '0253-2598877',
    frequency: 'Camp Wide Wireless Announcement Booth',
  },
];

export default function LostAndFoundPage() {
  const t = useTranslations('lostAndFound');
  const locale = useLocale();

  const [records, setRecords] = useState<MissingPersonRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'missing' | 'found'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'missing' | 'found'>('missing');

  // Form State
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female' | 'child'>('male');
  const [formLocation, setFormLocation] = useState('');
  const [formClothes, setFormClothes] = useState('');
  const [formLang, setFormLang] = useState('Hindi / Marathi');
  const [formContact, setFormContact] = useState('');
  const [formReporter, setFormReporter] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yatriva_khoya_paya_records');
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim()) return;

    const newRecord: MissingPersonRecord = {
      id: `mp-${Date.now()}`,
      name: formName.trim(),
      age: parseInt(formAge, 10) || 0,
      gender: formGender,
      status: reportType,
      lastSeenLocation: formLocation.trim() || 'Nashik Kumbh Mela Area',
      lastSeenTime: 'Just now',
      clothingDescription: formClothes.trim() || 'No clothing description provided.',
      primaryLanguage: formLang.trim() || 'Hindi / Marathi',
      contactNumber: formContact.trim(),
      reportedBy: formReporter.trim() || 'Family / Volunteer',
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    try {
      localStorage.setItem('yatriva_khoya_paya_records', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      // Reset form
      setFormName('');
      setFormAge('');
      setFormLocation('');
      setFormClothes('');
      setFormContact('');
      setFormReporter('');
    }, 1200);
  };

  const filteredRecords = records.filter((rec) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'missing' && rec.status === 'missing') ||
      (filterStatus === 'found' && (rec.status === 'found' || rec.status === 'reunited'));
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      rec.name.toLowerCase().includes(q) ||
      rec.clothingDescription.toLowerCase().includes(q) ||
      rec.lastSeenLocation.toLowerCase().includes(q) ||
      rec.primaryLanguage.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-7">
        {/* ── Top Header Bar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <Link
              href={`/${locale}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center justify-center min-h-[42px] min-w-[42px] shadow-2xs"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-navy-900/5 text-navy-900 border border-navy-900/10 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" style={{ background: '#E87722' }} />
                <span>Digital Khoya-Paya Bulletin</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t('title')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Action CTA buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setReportType('missing');
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              style={{ background: '#0F1E35', border: '1px solid rgba(232,119,34,0.4)' }}
            >
              <UserX className="h-4 w-4 text-rose-400" />
              <span>{t('reportMissing')}</span>
            </button>
            <button
              onClick={() => {
                setReportType('found');
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>{t('reportFound')}</span>
            </button>
          </div>
        </div>

        {/* ── Search & Filter Controls Bar ───────────────────────────── */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterAll')} ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('missing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === 'missing'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterMissing')} ({records.filter((r) => r.status === 'missing').length})
            </button>
            <button
              onClick={() => setFilterStatus('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === 'found'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterFound')} ({records.filter((r) => r.status === 'found' || r.status === 'reunited').length})
            </button>
          </div>
        </div>

        {/* ── Person Records Cards Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Avatar, Name, Age/Gender & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-black text-sm">
                        {rec.gender === 'child' ? '👶' : rec.gender === 'female' ? '👩' : '👨'}
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 leading-snug">
                          {rec.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-slate-600">
                            {rec.age} yrs
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-500 capitalize">
                            {rec.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        rec.status === 'missing'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : rec.status === 'found'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  {/* Clean Structured Info Grid */}
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-2 text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-saffron-600 shrink-0 mt-0.5" style={{ color: '#E87722' }} />
                      <div>
                        <strong className="text-slate-900 font-bold">Last Seen:</strong>{' '}
                        <span>{rec.lastSeenLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Shirt className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Appearance:</strong>{' '}
                        <span>{rec.clothingDescription}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Languages className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <div>
                        <strong className="text-slate-900 font-bold">Language:</strong>{' '}
                        <span>{rec.primaryLanguage}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        Reported: {rec.lastSeenTime} by {rec.reportedBy}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2.5">
                  <a
                    href={`tel:${rec.contactNumber}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-navy-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-navy-950 transition-colors"
                    style={{ background: '#0F1E35' }}
                  >
                    <Phone className="h-3.5 w-3.5 text-saffron-400" style={{ color: '#E87722' }} />
                    <span>Call Contact</span>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🚨 *LOST & FOUND ALERT — NASHIK KUMBH 2027*\nName: ${rec.name} (${rec.age} yrs)\nLast Seen: ${rec.lastSeenLocation}\nAppearance: ${rec.clothingDescription}\nContact: ${rec.contactNumber}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Share</span>
                  </a>
                </div>
              </div>
            ))
          ) : records.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mx-auto text-slate-400">
                <UserCheck className="h-7 w-7 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-black text-base text-slate-900">
                  No Active Reports on the Board
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This bulletin board is updated in real-time. Use the <strong className="text-slate-800">Report Missing Person</strong> or <strong className="text-slate-800">Report Found Individual</strong> buttons above to register an entry.
                </p>
              </div>
            </div>
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
              <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">No records found matching your search</p>
              <p className="text-xs text-slate-500 mt-0.5">Try searching with a different name or clear filters</p>
            </div>
          )}
        </div>

        {/* ── Official Police Khoya Paya Booths Section ─────────────── */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-900 border border-navy-200 mb-1">
              <Radio className="h-3.5 w-3.5 text-navy-700" />
              <span>Public Broadcast Network</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {t('policeBoothsTitle')}
            </h2>
            <p className="text-xs text-slate-600">
              {t('policeBoothsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICE_KHOYA_PAYA_BOOTHS.map((b, idx) => (
              <div key={idx} className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5">
                <h3 className="font-black text-xs sm:text-sm text-slate-900 leading-snug">{b.name}</h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{b.location}</span>
                </p>
                <p className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl font-medium border border-amber-200/60">
                  📢 {b.frequency}
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-navy-950"
                  >
                    <Phone className="h-3.5 w-3.5 text-saffron-600" style={{ color: '#E87722' }} />
                    <span>Control Room: {b.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Modal: Report Missing / Found Person ──────────────────── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {reportType === 'missing' ? t('reportMissing') : t('reportFound')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t('offlineNotice')}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-slate-900">Report Registered Successfully!</h4>
                  <p className="text-xs text-slate-600">Saved to bulletin board and cached for offline access.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('nameLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Radhabai Kulkarni"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('ageLabel')} *
                      </label>
                      <input
                        type="number"
                        required
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value)}
                        placeholder="65"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('genderLabel')}
                      </label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
                      >
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                        <option value="child">{t('child')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('lastSeenLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Ramkund Laxman Kund Ghat Steps"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t('clothesLabel')}
                    </label>
                    <textarea
                      rows={2}
                      value={formClothes}
                      onChange={(e) => setFormClothes(e.target.value)}
                      placeholder="e.g. Wearing Pink Saree, black spectacles, carrying red cloth bag"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-rose-700">
                      {t('contactLabel')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-600 bg-rose-50/20"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5"
                      style={{ background: '#0F1E35' }}
                    >
                      <span>{t('submitBtn')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
