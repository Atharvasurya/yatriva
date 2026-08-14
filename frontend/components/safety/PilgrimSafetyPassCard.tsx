'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Download, Shield, Phone, Heart, User, MapPin, AlertCircle, CheckCircle2, QrCode, Sparkles, Smartphone
} from 'lucide-react';

interface SafetyPassData {
  fullName: string;
  age: string;
  bloodGroup: string;
  homeCity: string;
  emergencyPhone1: string;
  emergencyPhone2: string;
  groupLeaderName: string;
}

const DEFAULT_DATA: SafetyPassData = {
  fullName: 'Ramesh Sharma',
  age: '62',
  bloodGroup: 'B+',
  homeCity: 'Indore, Madhya Pradesh',
  emergencyPhone1: '+91 98765 43210',
  emergencyPhone2: '+91 91234 56789',
  groupLeaderName: 'Pandit Shastri Group (Bus #14)',
};

export default function PilgrimSafetyPassCard() {
  const t = useTranslations('safetyPass');
  const locale = useLocale();

  const [formData, setFormData] = useState<SafetyPassData>(DEFAULT_DATA);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const passCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load saved pass from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yatriva_pilgrim_safety_pass');
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (field: keyof SafetyPassData, val: string) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    try {
      localStorage.setItem('yatriva_pilgrim_safety_pass', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Generate high-resolution lockscreen image (1080x1920 phone aspect ratio)
  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setDownloading(false);
      return;
    }

    // 1. Deep Navy background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0A1424');
    bgGrad.addColorStop(0.5, '#0F1E35');
    bgGrad.addColorStop(1, '#050B14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Top Header Saffron Accent Banner
    const bannerGrad = ctx.createLinearGradient(0, 0, 1080, 0);
    bannerGrad.addColorStop(0, '#E87722');
    bannerGrad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(0, 0, 1080, 160);

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SIMHASTHA KUMBH MELA 2027 • NASHIK', 540, 100);

    // Card Title Container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(232, 119, 34, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(70, 220, 940, 260, 32);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('EMERGENCY PILGRIM IDENTIFICATION', 540, 300);
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('आपातकालीन तीर्थयात्री सुरक्षा पत्र / भाविक सुरक्षा ओळख', 540, 360);
    ctx.font = 'normal 26px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('If found lost or unconscious, please call emergency contacts below', 540, 420);

    // 3. Pilgrim Core Information Box
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(70, 520, 940, 840, 32);
    ctx.fill();

    // Pilgrim Name
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('PILGRIM FULL NAME / तीर्थयात्री का नाम', 120, 590);
    ctx.fillStyle = '#0F1E35';
    ctx.font = '900 52px sans-serif';
    ctx.fillText(formData.fullName || 'Pilgrim Name', 120, 650);

    // Age & Blood Group
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('AGE / आयु', 120, 740);
    ctx.fillStyle = '#0F1E35';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`${formData.age || '—'} Years`, 120, 795);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('BLOOD GROUP / रक्तगट', 540, 740);
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 52px sans-serif';
    ctx.fillText(formData.bloodGroup || '—', 540, 800);

    // Divider Line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 845);
    ctx.lineTo(960, 845);
    ctx.stroke();

    // Home City
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('HOME CITY & STATE / गृह नगर', 120, 905);
    ctx.fillStyle = '#0F1E35';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(formData.homeCity || '—', 120, 955);

    // Emergency Contact 1
    ctx.fillStyle = '#E87722';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('PRIMARY EMERGENCY CONTACT 1 (FAMILY)', 120, 1045);
    ctx.fillStyle = '#0F1E35';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(`📞 ${formData.emergencyPhone1 || '—'}`, 120, 1105);

    // Emergency Contact 2 / Group
    ctx.fillStyle = '#0284C7';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('GROUP LEADER / SECONDARY CONTACT 2', 120, 1195);
    ctx.fillStyle = '#0F1E35';
    ctx.font = '900 44px sans-serif';
    ctx.fillText(`📞 ${formData.emergencyPhone2 || '—'}`, 120, 1255);
    if (formData.groupLeaderName) {
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 28px sans-serif';
      ctx.fillText(`Group: ${formData.groupLeaderName}`, 120, 1310);
    }

    // 4. Official Kumbh 24x7 Helplines Box (Bottom)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(70, 1400, 940, 360, 32);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 34px sans-serif';
    ctx.fillText('OFFICIAL 24x7 EMERGENCY HELPLINES', 540, 1465);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('POLICE: 112   •   AMBULANCE: 108', 540, 1540);
    ctx.fillText('KUMBH CONTROL: 1924   •   WOMEN: 1090', 540, 1610);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 24px sans-serif';
    ctx.fillText('NDRF Disaster Control: 1078  |  Railway Helpline: 139', 540, 1680);

    // Footer Watermark
    ctx.fillStyle = '#E87722';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('Generated with Yatriva • Simhastha Kumbh 2027 Guide', 540, 1850);

    // Trigger image download
    const link = document.createElement('a');
    link.download = `Yatriva_Safety_Pass_${(formData.fullName || 'Pilgrim').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Editor Column */}
      <div className="lg:col-span-6 space-y-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="h-5 w-5 text-saffron-600" style={{ color: '#E87722' }} />
            <span>Enter Pilgrim Details</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t('instruction')}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('fullName')} *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('age')} *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="62"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('bloodGroup')}
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Unknown">Not Known</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('homeCity')}
            </label>
            <input
              type="text"
              value={formData.homeCity}
              onChange={(e) => handleChange('homeCity', e.target.value)}
              placeholder="e.g. Indore, Madhya Pradesh"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-saffron-700">
              {t('emergencyPhone1')} *
            </label>
            <input
              type="tel"
              value={formData.emergencyPhone1}
              onChange={(e) => handleChange('emergencyPhone1', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-saffron-300 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-saffron-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('emergencyPhone2')}
            </label>
            <input
              type="tel"
              value={formData.emergencyPhone2}
              onChange={(e) => handleChange('emergencyPhone2', e.target.value)}
              placeholder="+91 91234 56789"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Group Name / Tour Bus Details (Optional)
            </label>
            <input
              type="text"
              value={formData.groupLeaderName}
              onChange={(e) => handleChange('groupLeaderName', e.target.value)}
              placeholder="e.g. Pandit Shastri Group (Bus #14)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer mt-4"
          style={{ background: '#0F1E35', border: '1.5px solid #E87722' }}
        >
          <Download className="h-5 w-5 text-saffron-400" style={{ color: '#E87722' }} />
          <span>{downloading ? 'Generating HD Pass...' : t('downloadBtn')}</span>
        </button>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Pass downloaded successfully! Set it as your phone lockscreen wallpaper.</span>
          </div>
        )}
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 text-slate-700" />
            <span>{t('previewTitle')}</span>
          </h3>
          <span className="text-[11px] font-bold text-saffron-700 bg-saffron-50 border border-saffron-200 px-2.5 py-0.5 rounded-full">
            Offline 100% Guaranteed
          </span>
        </div>

        {/* Mock Smartphone Frame Preview */}
        <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto overflow-hidden">
          <div className="rounded-3xl overflow-hidden bg-navy-950 text-white flex flex-col justify-between p-5 space-y-4 border border-white/10 relative" style={{ background: '#0B1728' }}>
            {/* Top Bar */}
            <div className="text-center pb-3 border-b border-white/10">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-saffron-500 text-white">
                Simhastha Kumbh 2027
              </span>
              <h4 className="text-xs font-black text-amber-300 mt-1.5 tracking-tight uppercase">
                Pilgrim Emergency Pass
              </h4>
              <p className="text-[10px] text-slate-400">आपातकालीन तीर्थयात्री पहचान</p>
            </div>

            {/* Core Card */}
            <div className="bg-white rounded-2xl p-4 text-slate-900 space-y-2.5 shadow-md">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Pilgrim Full Name</span>
                <p className="font-black text-base leading-tight text-slate-900">{formData.fullName || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Age</span>
                  <p className="font-extrabold text-xs text-slate-800">{formData.age ? `${formData.age} Yrs` : '—'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-red-600 uppercase">Blood Group</span>
                  <p className="font-black text-sm text-red-600">{formData.bloodGroup || '—'}</p>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Home City</span>
                <p className="font-bold text-xs text-slate-800 truncate">{formData.homeCity || '—'}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 bg-saffron-50/60 p-2 rounded-xl border border-saffron-200">
                <span className="text-[9px] font-extrabold text-saffron-800 uppercase block">Family Contact 1</span>
                <p className="font-black text-xs text-navy-950">📞 {formData.emergencyPhone1 || '—'}</p>
              </div>

              {formData.emergencyPhone2 && (
                <div className="bg-sky-50/60 p-2 rounded-xl border border-sky-200">
                  <span className="text-[9px] font-extrabold text-sky-800 uppercase block">Group / Contact 2</span>
                  <p className="font-bold text-xs text-slate-900">📞 {formData.emergencyPhone2}</p>
                </div>
              )}
            </div>

            {/* Official Numbers Box */}
            <div className="bg-slate-800/90 rounded-xl p-3 border border-white/10 text-center space-y-1">
              <p className="text-[10px] font-black text-amber-300 uppercase">24x7 Emergency Helplines</p>
              <p className="text-xs font-bold text-white tracking-wide">Police: 112 • Ambulance: 108</p>
              <p className="text-[10px] text-slate-300">Kumbh Control: 1924 • Women: 1090</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
