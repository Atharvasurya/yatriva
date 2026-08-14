import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Shield, Smartphone, QrCode, Download, HeartHandshake } from 'lucide-react';
import PilgrimSafetyPassCard from '@/components/safety/PilgrimSafetyPassCard';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SafetyPassPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen text-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation & Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all inline-flex items-center justify-center min-h-[40px] min-w-[40px] shadow-2xs group shrink-0"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <Shield className="h-3.5 w-3.5 text-amber-600" />
              <span>Offline Life-Saving Tool</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Offline Pilgrim Safety Pass
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Save an emergency contact pass directly to your phone gallery & lockscreen. Works 100% without cellular internet or mobile signal.
            </p>
          </div>
        </div>

        {/* Why this is essential alert banner */}
        <div
          className="p-5 rounded-2xl border text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: '#0F1E35', borderColor: '#E87722' }}
        >
          <div className="space-y-1">
            <h3 className="font-black text-base text-amber-300 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-saffron-400" />
              <span>Why Set this as your Lockscreen?</span>
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
              During peak Snan days, cell phone networks face severe congestion. If elderly relatives or children get separated, any police officer or volunteer can glance at this phone lockscreen wallpaper and call your family immediately.
            </p>
          </div>
        </div>

        {/* Interactive Pass Generator */}
        <PilgrimSafetyPassCard />
      </div>
    </div>
  );
}
