'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft, Search, PlusCircle, UserX, UserCheck, Phone, MapPin, ShieldAlert, AlertCircle, Filter, HelpCircle, CheckCircle2, X, MessageSquare, Radio
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

const INITIAL_RECORDS: MissingPersonRecord[] = [
  {
    id: 'mp-1',
    name: 'Kanta Devi Agarwal',
    age: 68,
    gender: 'female',
    status: 'missing',
    lastSeenLocation: 'Ramkund Ghat (Near Laxman Kund Steps)',
    lastSeenTime: 'Today, 08:30 AM',
    clothingDescription: 'Wearing Yellow Saree with Red Border, carrying a blue steel water bottle, glasses.',
    primaryLanguage: 'Hindi / Marwari',
    contactNumber: '+91 98234 56781',
    reportedBy: 'Son: Rajesh Agarwal',
  },
  {
    id: 'mp-2',
    name: 'Aarav Patil',
    age: 7,
    gender: 'child',
    status: 'found',
    lastSeenLocation: 'CBS Central Bus Stand Booth #3',
    lastSeenTime: 'Today, 09:15 AM',
    clothingDescription: 'Red T-shirt, blue denim shorts, white sports shoes.',
    primaryLanguage: 'Marathi',
    contactNumber: '+91 94222 11099',
    reportedBy: 'Found by Police Booth #3 (Safe with Constable More)',
  },
  {
    id: 'mp-3',
    name: 'Vitthalrao Joshi',
    age: 74,
    gender: 'male',
    status: 'missing',
    lastSeenLocation: 'Trimbakeshwar Kushavarta Kund Entrance',
    lastSeenTime: 'Yesterday, 05:45 PM',
    clothingDescription: 'White Kurta Dhoti, maroon shawl, wooden walking stick.',
    primaryLanguage: 'Marathi',
    contactNumber: '+91 98900 44321',
    reportedBy: 'Daughter: Sunita Joshi',
  },
  {
    id: 'mp-4',
    name: 'Shanti Devi Sharma',
    age: 65,
    gender: 'female',
    status: 'reunited',
    lastSeenLocation: 'Tapovan Sadhugram Sector 4',
    lastSeenTime: 'Yesterday, 02:00 PM',
    clothingDescription: 'Green floral Salwar Suit, brown handbag.',
    primaryLanguage: 'Hindi',
    contactNumber: '+91 91580 99887',
    reportedBy: 'Reunited at Tapovan Police Assistance Booth',
  },
];

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
    }, 1500);
  };

  const filteredRecords = records.filter((rec) => {
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 mb-1">
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                <span>24x7 Digital Khoya-Paya Board</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Action CTA buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setReportType('missing');
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
              style={{ background: '#DC2626' }}
            >
              <UserX className="h-4 w-4" />
              <span>{t('reportMissing')}</span>
            </button>
            <button
              onClick={() => {
                setReportType('found');
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
              style={{ background: '#166534' }}
            >
              <UserCheck className="h-4 w-4" />
              <span>{t('reportFound')}</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === 'all' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={filterStatus === 'all' ? { background: '#0F1E35' } : {}}
            >
              {t('filterAll')} ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('missing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === 'missing' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {t('filterMissing')} ({records.filter((r) => r.status === 'missing').length})
            </button>
            <button
              onClick={() => setFilterStatus('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === 'found' ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {t('filterFound')} ({records.filter((r) => r.status === 'found').length})
            </button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-900">{rec.name}</h3>
                        <span className="text-xs font-bold text-slate-500">
                          {rec.age} yrs • {rec.gender}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-saffron-600 shrink-0" style={{ color: '#E87722' }} />
                        <span>{rec.lastSeenLocation}</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        rec.status === 'missing'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : rec.status === 'found'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                    <p>
                      <strong className="text-slate-900">Appearance:</strong> {rec.clothingDescription}
                    </p>
                    <p>
                      <strong className="text-slate-900">Language:</strong> {rec.primaryLanguage}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Reported: {rec.lastSeenTime} by {rec.reportedBy}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${rec.contactNumber}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-navy-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-navy-900 transition-colors"
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
                    className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Share Alert</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
              <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">No records found matching your search</p>
              <p className="text-xs text-slate-500 mt-0.5">Try searching with a different name or clear filters</p>
            </div>
          )}
        </div>

        {/* Official Police Khoya Paya Booths Section */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-1">
              <Radio className="h-3.5 w-3.5 text-blue-600" />
              <span>Loudspeaker Network</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('policeBoothsTitle')}
            </h2>
            <p className="text-xs text-slate-600">
              {t('policeBoothsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICE_KHOYA_PAYA_BOOTHS.map((b, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-black text-xs sm:text-sm text-navy-900 leading-tight">{b.name}</h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{b.location}</span>
                </p>
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg font-medium border border-amber-200/70">
                  📢 {b.frequency}
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Control Room: {b.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Report Missing / Found Person */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
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
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-base text-slate-900">Report Registered!</h4>
                  <p className="text-xs text-slate-600">Saved to bulletin and cached for offline access.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateReport} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('nameLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Radhabai Kulkarni"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t('ageLabel')} *
                      </label>
                      <input
                        type="number"
                        required
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value)}
                        placeholder="65"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t('genderLabel')}
                      </label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
                      >
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                        <option value="child">{t('child')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('lastSeenLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Ramkund Laxman Kund Ghat Steps"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('clothesLabel')}
                    </label>
                    <textarea
                      rows={2}
                      value={formClothes}
                      onChange={(e) => setFormClothes(e.target.value)}
                      placeholder="e.g. Wearing Pink Saree, black spectacles, carrying red cloth bag"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1 text-red-600">
                      {t('contactLabel')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl border border-red-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600 bg-red-50/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
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
