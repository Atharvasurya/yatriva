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
      <div className="inline-flex items-center gap-2 text-sky-700 font-bold text-xs" role="status">
        <svg className="animate-spin h-4 w-4 text-sky-600" viewBox="0 0 24 24" fill="none">
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
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full overflow-hidden p-1 bg-gradient-to-b from-sky-200 via-sky-400 to-blue-600 shadow-md">
          {/* Circular Water Flow */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-sky-100 to-blue-300 flex items-center justify-center">
            {/* Water Wave */}
            <div className="absolute inset-x-0 bottom-0 h-14 w-[200%] animate-wave-flow opacity-80">
              <svg viewBox="0 0 400 60" className="w-full h-full text-blue-600 fill-current" preserveAspectRatio="none">
                <path d="M0,20 C100,45 100,5 200,20 C300,45 300,5 400,20 L400,60 L0,60 Z" />
              </svg>
            </div>
            <div className="relative z-10 w-14 h-14 rounded-full p-1 bg-white/95 shadow-sm animate-water-bob">
              <Image
                src="/newlogo.png"
                alt="Yatriva logo"
                fill
                className="object-contain"
                sizes="56px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 tracking-tight">{text}</h3>
          {subtext && <p className="text-[10px] text-sky-800 font-medium">{subtext}</p>}
        </div>
      </div>
    );
  }

  // Fullscreen / Page loader with Rich Fluid Godavari Sacred Water Waves & Ripples
  return (
    <div
      className="flex flex-col items-center justify-center text-center select-none animate-fade-up"
      role="status"
      aria-label="Loading Yatriva"
    >
      {/* ── Main Circular Water Tank (Sacred Kund) Container ───────── */}
      <div className="relative mb-6 flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
        
        {/* Layer 1: Outward Expanding Water Splash Ripple 1 */}
        <div
          className="absolute inset-0 rounded-full border-2 border-sky-400/40 bg-sky-400/5 animate-water-ripple-1"
        />

        {/* Layer 2: Outward Expanding Water Splash Ripple 2 */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/35 bg-cyan-400/5 animate-water-ripple-2"
        />

        {/* Layer 3: Circular Water Pool (Ghat Kund) Frame with Gold & Azure Rim */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-sky-400 to-blue-500 shadow-xl shadow-sky-500/20">
          
          {/* Inner Water Reservoir */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-sky-100 via-sky-200 to-blue-400 border border-white/60 flex items-center justify-center">
            
            {/* Deep Water Layer 1 (Deep Blue Flow) */}
            <div className="absolute inset-x-0 bottom-0 h-22 sm:h-28 w-[300%] opacity-65 animate-wave-deep">
              <svg viewBox="0 0 600 80" className="w-full h-full text-blue-600 fill-current" preserveAspectRatio="none">
                <path d="M0,35 C150,60 150,15 300,35 C450,60 450,15 600,35 L600,80 L0,80 Z" />
              </svg>
            </div>

            {/* Mid Water Layer 2 (Azure Godavari Wave) */}
            <div className="absolute inset-x-0 bottom-0 h-18 sm:h-22 w-[300%] opacity-80 animate-wave-mid">
              <svg viewBox="0 0 600 80" className="w-full h-full text-sky-500 fill-current" preserveAspectRatio="none">
                <path d="M0,25 C100,5 200,45 300,25 C400,5 500,45 600,25 L600,80 L0,80 Z" />
              </svg>
            </div>

            {/* Surface Water Layer 3 (Turquoise & Foam Crest) */}
            <div className="absolute inset-x-0 bottom-0 h-14 sm:h-16 w-[300%] opacity-90 animate-wave-foam">
              <svg viewBox="0 0 600 80" className="w-full h-full text-cyan-300 fill-current" preserveAspectRatio="none">
                <path d="M0,20 C120,40 180,5 300,20 C420,40 480,5 600,20 L600,80 L0,80 Z" />
              </svg>
            </div>

            {/* Sunlight Amrit Shimmer Reflection on Water Surface */}
            <div className="absolute top-2.5 left-4 right-4 h-4 rounded-full bg-white/45 blur-xs transform -rotate-12 pointer-events-none" />

            {/* Yatriva Central Logo floating peacefully on top of sacred water */}
            <div className="relative z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full p-2 bg-white/95 border-2 border-white shadow-lg shadow-blue-900/20 flex items-center justify-center animate-water-float">
              <div className="relative w-full h-full">
                <Image
                  src="/newlogo.png"
                  alt="Yatriva logo"
                  fill
                  className="object-contain"
                  sizes="104px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amrit Droplet Sparkle on the Rim */}
        <div className="absolute top-3.5 right-7 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-400 border border-white shadow-md animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      </div>

      {/* ── Brand Typography ───────────────────────────────────────── */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
          {text}
        </h2>

        {subtext && (
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            {subtext}
          </p>
        )}
      </div>

      {/* ── Pure Fluid Water Wave Keyframe Animations ───────────────── */}
      <style jsx>{`
        @keyframes waterRipple1 {
          0% {
            transform: scale(0.7);
            opacity: 0.9;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
        @keyframes waterRipple2 {
          0% {
            transform: scale(0.7);
            opacity: 0.9;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
        @keyframes waveDeep {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes waveMid {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes waveFoam {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes waterFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-4px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(2px) rotate(0deg);
          }
          75% {
            transform: translateY(-3px) rotate(1.5deg);
          }
        }
        .animate-water-ripple-1 {
          animation: waterRipple1 2.8s cubic-bezier(0.1, 0.45, 0.45, 0.95) infinite;
        }
        .animate-water-ripple-2 {
          animation: waterRipple2 2.8s cubic-bezier(0.1, 0.45, 0.45, 0.95) infinite;
          animation-delay: 1.4s;
        }
        .animate-wave-deep {
          animation: waveDeep 4.5s linear infinite;
        }
        .animate-wave-mid {
          animation: waveMid 3s linear infinite;
        }
        .animate-wave-foam {
          animation: waveFoam 2.2s linear infinite;
        }
        .animate-water-float {
          animation: waterFloat 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
