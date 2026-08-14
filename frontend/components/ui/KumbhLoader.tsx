'use client';

import Image from 'next/image';

interface KumbhLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  text?: string;
  subtext?: string;
}

export default function KumbhLoader({
  size = 'fullscreen',
  text = 'YATRIVA',
  subtext = 'Nashik Kumbh Mela 2027',
}: KumbhLoaderProps) {
  // Small inline spinner
  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2 text-slate-700 font-bold text-xs" role="status">
        <svg className="animate-spin h-4 w-4 text-saffron-600" viewBox="0 0 24 24" fill="none" style={{ color: '#E87722' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>{text}</span>
      </div>
    );
  }

  // Medium section loader
  if (size === 'md') {
    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3" role="status">
        {/* Simple Circle Logo */}
        <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2 relative">
          <Image
            src="/newlogo.png"
            alt="Yatriva logo"
            fill
            className="object-contain p-1.5"
            sizes="64px"
            priority
          />
        </div>

        {/* Text */}
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 tracking-tight">{text}</h3>
          {subtext && <p className="text-[10px] text-slate-500 font-medium">{subtext}</p>}
        </div>

        {/* Horizontal Loading Progress */}
        <div className="w-28 h-1 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60">
          <div
            className="absolute inset-y-0 rounded-full animate-loader-progress"
            style={{
              background: 'linear-gradient(90deg, #E87722 0%, #F59E0B 100%)',
            }}
          />
        </div>

        <style jsx>{`
          @keyframes loaderProgress {
            0% {
              left: -50%;
              width: 30%;
            }
            50% {
              left: 25%;
              width: 55%;
            }
            100% {
              left: 100%;
              width: 30%;
            }
          }
          .animate-loader-progress {
            animation: loaderProgress 1.4s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Fullscreen / Page loader: Simple Logo in Circle + Text + Horizontal Progress
  return (
    <div
      className="flex flex-col items-center justify-center text-center select-none animate-fade-up"
      role="status"
      aria-label="Loading Yatriva"
    >
      {/* ── 1. Simple Logo in Circle ─────────────────────────────────── */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center p-3 relative">
          <div className="relative w-full h-full">
            <Image
              src="/newlogo.png"
              alt="Yatriva logo"
              fill
              className="object-contain"
              sizes="112px"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── 2. Text (As it is) ───────────────────────────────────────── */}
      <div className="space-y-1 mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
          {text}
        </h2>

        {subtext && (
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            {subtext}
          </p>
        )}
      </div>

      {/* ── 3. Horizontal Loading Progress ───────────────────────────── */}
      <div className="w-44 sm:w-52 h-1.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60 shadow-2xs">
        <div
          className="absolute inset-y-0 rounded-full animate-loader-progress"
          style={{
            background: 'linear-gradient(90deg, #E87722 0%, #F59E0B 100%)',
          }}
        />
      </div>

      {/* ── Keyframe Animations ──────────────────────────────────────── */}
      <style jsx>{`
        @keyframes loaderProgress {
          0% {
            left: -50%;
            width: 30%;
          }
          50% {
            left: 25%;
            width: 55%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
        .animate-loader-progress {
          animation: loaderProgress 0.85s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
