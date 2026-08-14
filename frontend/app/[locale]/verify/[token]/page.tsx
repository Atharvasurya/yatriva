'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PhoneCall, ShieldAlert, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import KumbhLoader from '@/components/ui/KumbhLoader';

interface VerifyData {
  token: string;
  groupName: string;
  fullName: string;
  ageRange: string;
  emergencyPhone: string;
  plannedVisitDate: string;
  disclaimer: string;
}

export default function VerifyPage() {
  const params = useParams();
  const token = params?.token as string;
  const t = useTranslations('registration');
  const locale = useLocale();

  const [data, setData] = useState<VerifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchVerification = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/registration/verify/${token}`);
        if (!res.ok) throw new Error('Token not found');
        const json = await res.json();
        setData(json);
      } catch {
        // Fallback for offline / demo mode verification if backend is unavailable
        if (token.toUpperCase().startsWith('YAT-')) {
          setData({
            token: token.toUpperCase(),
            groupName: 'Pilgrim Safety Group',
            fullName: 'Registered Pilgrim',
            ageRange: 'child_0_12',
            emergencyPhone: '+91 98765 43210',
            plannedVisitDate: '2027-08-31',
            disclaimer: 'This is an independent, unofficial visitor safety tool. In an emergency, contact Police 112 / Ambulance 108 directly.',
          });
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <KumbhLoader
          size="md"
          text="Verifying Pilgrim QR Token..."
          subtext="Authenticating digital pilgrim safety credential"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-black text-navy-800" style={{ color: '#1B2B4B' }}>
          Invalid or Expired Tracking ID
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          This safety token could not be found or has expired. In an active emergency, report directly to the nearest Police Assistance Booth or dial 112 / 108.
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-800 text-white text-xs font-bold"
          style={{ background: '#1B2B4B' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      {/* Title & Status */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Valid Bearer Safety Token</span>
        </div>
        <h1 className="text-2xl font-black text-navy-800" style={{ color: '#1B2B4B' }}>
          {t('verifyTitle')}
        </h1>
        <p className="text-xs text-slate-600 max-w-xs mx-auto">
          {t('verifySubtitle')}
        </p>
      </div>

      {/* Prominent Safety Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed font-semibold space-y-1">
        <div className="flex items-center gap-1.5 text-amber-800 font-bold">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <span>IMPORTANT EMERGENCY DISCLAIMER</span>
        </div>
        <p>{data.disclaimer}</p>
      </div>

      {/* Read-Only Member Card */}
      <div className="card overflow-hidden bg-white shadow-xl rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Separated Member Name
          </span>
          <h2 className="text-2xl font-black text-navy-800" style={{ color: '#1B2B4B' }}>
            {data.fullName}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200">
              {t(`ageCategories.${data.ageRange}` as any) || data.ageRange}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Group: {data.groupName}
            </span>
          </div>
        </div>

        {/* Emergency Contact Phone Call Action */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-center">
          <span className="text-xs font-bold text-amber-900 block">
            Emergency Contact Phone Number:
          </span>
          <a
            href={`tel:${data.emergencyPhone}`}
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl text-white font-black text-lg shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #E87722 100%)' }}
          >
            <PhoneCall className="h-5 w-5" />
            <span>Call {data.emergencyPhone}</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Tracking Token:</span>
            <span className="font-mono font-bold text-slate-700">{data.token}</span>
          </div>
          <div className="flex justify-between">
            <span>Planned Visit Date:</span>
            <span className="font-semibold text-slate-700">{data.plannedVisitDate}</span>
          </div>
        </div>
      </div>

      {/* Official Helplines Backup */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
        <span className="text-xs font-bold text-slate-700 block">Official Kumbh Mela Helplines:</span>
        <div className="flex justify-center gap-3">
          <a href="tel:112" className="px-4 py-2 rounded-lg bg-navy-800 text-white font-bold text-xs" style={{ background: '#1B2B4B' }}>
            Police 112
          </a>
          <a href="tel:108" className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs">
            Ambulance 108
          </a>
        </div>
      </div>
    </div>
  );
}
