'use client';

import { getParkingRealImageUrl } from '@/data/parkingImages';

interface ParkingClipartProps {
  zoneId: string;
  zoneName: string;
  corridorTag?: string;
  coordinates?: { lat: number; lng: number };
  isOuter?: boolean;
  imageUrl?: string;
}

export default function ParkingClipart({
  zoneId,
  zoneName,
  corridorTag,
  coordinates,
  isOuter = true,
  imageUrl,
}: ParkingClipartProps) {
  // ── 0. Check for Authentic Original Photograph ─────────────────────────────
  const realImageUrl = getParkingRealImageUrl(zoneId, imageUrl);

  // Compute corridor tag for display
  const lat = coordinates?.lat ?? 20.0;
  const lng = coordinates?.lng ?? 73.8;
  const lowerName = zoneName.toLowerCase();

  let detectedTag = 'Outer Satellite Parking Buffer';
  if (lng < 73.68 || lowerName.includes('trimbak') || lowerName.includes('khambale') || lowerName.includes('belgaon')) {
    detectedTag = 'Trimbakeshwar Link Corridor';
  } else if ((lat < 19.95 && lng < 73.78) || lowerName.includes('vilholi') || lowerName.includes('rajur') || lowerName.includes('mumbai')) {
    detectedTag = 'NH-3 Mumbai Corridor';
  } else if ((lat > 20.03 && lng > 73.84) || lowerName.includes('adgaon') || lowerName.includes('agra') || lowerName.includes('truck')) {
    detectedTag = 'North Inflow / Truck Terminus';
  } else if ((lat > 20.05 && lng < 73.82) || lowerName.includes('dindori') || lowerName.includes('peth') || lowerName.includes('dhakambe') || lowerName.includes('ramshej')) {
    detectedTag = 'Dindori / Gujarat Link Road';
  } else if (lng > 73.85 || lowerName.includes('aurangabad') || lowerName.includes('lakhalgaon') || lowerName.includes('madsangavi') || lowerName.includes('chincholi')) {
    detectedTag = 'Aurangabad Road Corridor';
  } else if (!isOuter || lowerName.includes('inner') || lowerName.includes('station') || lowerName.includes('cbs') || lowerName.includes('nehru')) {
    detectedTag = 'Central Nashik Inner Zone';
  }
  const photoTag = corridorTag || detectedTag;

  // If real image exists, render high-res photograph with overlay
  if (realImageUrl) {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden group">
        <img
          src={realImageUrl}
          alt={zoneName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle dark gradient overlay for crystal clear typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20" />

        {/* Bottom details: corridor badge + name */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10 space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
            {photoTag}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>
      </div>
    );
  }

  // ── 1. Hand-curated specific zones (fallback to vector clipart) ─────────────
  if (zoneId === 'parking-vilholi') {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-between px-6">
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <line x1="0" y1="140" x2="400" y2="140" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 8" />
          <line x1="0" y1="180" x2="400" y2="180" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="40" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="120" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="200" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="280" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
        </svg>

        <div className="relative z-10 space-y-1 max-w-[60%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
            NH-3 Mumbai Corridor
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <svg width="110" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="28" r="22" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="3" />
            <text x="95" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif">P</text>
            <rect x="15" y="52" width="70" height="24" rx="8" fill="#60A5FA" />
            <path d="M28 52 L36 34 L62 34 L72 52 Z" fill="#93C5FD" />
            <rect x="38" y="38" width="22" height="12" rx="2" fill="#1E3A8A" opacity="0.6" />
            <circle cx="32" cy="76" r="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="68" cy="76" r="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  if (zoneId === 'parking-adgaon') {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-amber-950 flex items-center justify-between px-6">
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <line x1="0" y1="150" x2="400" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="16 10" />
          <rect x="50" y="20" width="70" height="100" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" />
          <rect x="140" y="20" width="70" height="100" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" />
          <rect x="230" y="20" width="70" height="100" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" />
        </svg>

        <div className="relative z-10 space-y-1 max-w-[60%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[10px] font-bold uppercase tracking-wider">
            North Inflow / Truck Terminus
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <svg width="115" height="90" viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="105" cy="25" r="20" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
            <text x="105" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
            <rect x="10" y="38" width="82" height="42" rx="6" fill="#FBBF24" />
            <rect x="16" y="44" width="16" height="14" rx="2" fill="#451A03" />
            <rect x="36" y="44" width="16" height="14" rx="2" fill="#451A03" />
            <rect x="56" y="44" width="16" height="14" rx="2" fill="#451A03" />
            <circle cx="28" cy="80" r="9" fill="#18181B" stroke="#D4D4D8" strokeWidth="2" />
            <circle cx="72" cy="80" r="9" fill="#18181B" stroke="#D4D4D8" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  if (zoneId === 'parking-nilgiri') {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-900 flex items-center justify-between px-6">
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <circle cx="40" cy="160" r="30" fill="#10B981" />
          <circle cx="120" cy="170" r="25" fill="#10B981" />
          <circle cx="340" cy="160" r="35" fill="#10B981" />
          <line x1="0" y1="130" x2="400" y2="130" stroke="#34D399" strokeWidth="3" strokeDasharray="10 8" />
        </svg>

        <div className="relative z-10 space-y-1 max-w-[60%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
            Tapovan Shuttle Base • 2.5 km to Ghat
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="25" r="20" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
            <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
            <rect x="15" y="44" width="68" height="34" rx="7" fill="#34D399" />
            <rect x="22" y="50" width="14" height="11" rx="2" fill="#064E3B" />
            <rect x="40" y="50" width="14" height="11" rx="2" fill="#064E3B" />
            <circle cx="30" cy="78" r="8" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
            <circle cx="64" cy="78" r="8" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  if (zoneId === 'parking-dugaon') {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 flex items-center justify-between px-6">
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <polygon points="0,150 90,80 180,150 270,90 380,160 400,160 400,200 0,200" fill="#A855F7" />
        </svg>

        <div className="relative z-10 space-y-1 max-w-[60%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-bold uppercase tracking-wider">
            Trimbakeshwar Link Corridor
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="25" r="20" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="3" />
            <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
            <rect x="12" y="42" width="70" height="36" rx="6" fill="#C084FC" />
            <rect x="18" y="48" width="16" height="12" rx="2" fill="#3B0764" />
            <rect x="38" y="48" width="16" height="12" rx="2" fill="#3B0764" />
            <circle cx="28" cy="78" r="8" fill="#18181B" stroke="#E9D5FF" strokeWidth="2" />
            <circle cx="62" cy="78" r="8" fill="#18181B" stroke="#E9D5FF" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  if (zoneId === 'parking-dindori') {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-orange-900 flex items-center justify-between px-6">
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <line x1="0" y1="140" x2="400" y2="140" stroke="#F97316" strokeWidth="3" strokeDasharray="14 8" />
          <rect x="40" y="30" width="60" height="85" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="120" y="30" width="60" height="85" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="200" y="30" width="60" height="85" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
        </svg>

        <div className="relative z-10 space-y-1 max-w-[60%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/30 border border-orange-400/40 text-orange-200 text-[10px] font-bold uppercase tracking-wider">
            North Bypass / MUHS Ground Hub
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
            {zoneName}
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="95" cy="25" r="20" fill="#EA580C" stroke="#FFFFFF" strokeWidth="3" />
            <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
            <rect x="15" y="50" width="66" height="24" rx="6" fill="#FB923C" />
            <path d="M26 50 L34 36 L58 36 L66 50 Z" fill="#FDBA74" />
            <circle cx="30" cy="74" r="7.5" fill="#18181B" stroke="#FED7AA" strokeWidth="2" />
            <circle cx="62" cy="74" r="7.5" fill="#18181B" stroke="#FED7AA" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  // ── 2. Dynamic Thematic Classification for All Other Parking Zones ──────────
  // Determine geographic corridor theme
  let theme: 'mumbai' | 'agra' | 'trimbak' | 'aurangabad' | 'dindori' | 'inner';
  let defaultTag: string;

  if (lng < 73.68 || lowerName.includes('trimbak') || lowerName.includes('khambale') || lowerName.includes('belgaon')) {
    theme = 'trimbak';
    defaultTag = 'Trimbakeshwar Link Corridor';
  } else if ((lat < 19.95 && lng < 73.78) || lowerName.includes('vilholi') || lowerName.includes('rajur') || lowerName.includes('mumbai')) {
    theme = 'mumbai';
    defaultTag = 'NH-3 Mumbai Corridor';
  } else if ((lat > 20.03 && lng > 73.84) || lowerName.includes('adgaon') || lowerName.includes('agra') || lowerName.includes('truck')) {
    theme = 'agra';
    defaultTag = 'North Inflow / Truck Terminus';
  } else if ((lat > 20.05 && lng < 73.82) || lowerName.includes('dindori') || lowerName.includes('peth') || lowerName.includes('dhakambe') || lowerName.includes('ramshej')) {
    theme = 'dindori';
    defaultTag = 'Dindori / Gujarat Link Road';
  } else if (lng > 73.85 || lowerName.includes('aurangabad') || lowerName.includes('lakhalgaon') || lowerName.includes('madsangavi') || lowerName.includes('chincholi')) {
    theme = 'aurangabad';
    defaultTag = 'Aurangabad Road Corridor';
  } else if (!isOuter || lowerName.includes('inner') || lowerName.includes('station') || lowerName.includes('cbs') || lowerName.includes('nehru')) {
    theme = 'inner';
    defaultTag = 'Central Nashik Inner Zone';
  } else {
    // Deterministic fallback based on zoneId string hash
    const hash = zoneId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themes: Array<'mumbai' | 'agra' | 'trimbak' | 'aurangabad' | 'dindori' | 'inner'> = [
      'mumbai', 'agra', 'trimbak', 'aurangabad', 'dindori', 'inner'
    ];
    theme = themes[hash % themes.length];
    defaultTag = isOuter ? 'Outer Satellite Parking Buffer' : 'Inner City Feeder Terminal';
  }

  const activeTag = corridorTag || defaultTag;

  switch (theme) {
    case 'mumbai':
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <line x1="0" y1="140" x2="400" y2="140" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 8" />
            <line x1="0" y1="180" x2="400" y2="180" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="40" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="120" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="200" y="30" width="60" height="90" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="110" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95" cy="28" r="22" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="3" />
              <text x="95" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="15" y="52" width="70" height="24" rx="8" fill="#60A5FA" />
              <path d="M28 52 L36 34 L62 34 L72 52 Z" fill="#93C5FD" />
              <rect x="38" y="38" width="22" height="12" rx="2" fill="#1E3A8A" opacity="0.6" />
              <circle cx="32" cy="76" r="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="68" cy="76" r="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );

    case 'agra':
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-amber-950 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <line x1="0" y1="150" x2="400" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="16 10" />
            <rect x="50" y="20" width="70" height="100" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" />
            <rect x="140" y="20" width="70" height="100" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="115" height="90" viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="105" cy="25" r="20" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
              <text x="105" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="10" y="38" width="82" height="42" rx="6" fill="#FBBF24" />
              <rect x="16" y="44" width="16" height="14" rx="2" fill="#451A03" />
              <rect x="36" y="44" width="16" height="14" rx="2" fill="#451A03" />
              <rect x="56" y="44" width="16" height="14" rx="2" fill="#451A03" />
              <circle cx="28" cy="80" r="9" fill="#18181B" stroke="#D4D4D8" strokeWidth="2" />
              <circle cx="72" cy="80" r="9" fill="#18181B" stroke="#D4D4D8" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );

    case 'aurangabad':
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-900 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <circle cx="40" cy="160" r="30" fill="#10B981" />
            <circle cx="120" cy="170" r="25" fill="#10B981" />
            <circle cx="340" cy="160" r="35" fill="#10B981" />
            <line x1="0" y1="130" x2="400" y2="130" stroke="#34D399" strokeWidth="3" strokeDasharray="10 8" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95" cy="25" r="20" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
              <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="15" y="44" width="68" height="34" rx="7" fill="#34D399" />
              <rect x="22" y="50" width="14" height="11" rx="2" fill="#064E3B" />
              <rect x="40" y="50" width="14" height="11" rx="2" fill="#064E3B" />
              <circle cx="30" cy="78" r="8" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
              <circle cx="64" cy="78" r="8" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );

    case 'trimbak':
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <polygon points="0,150 90,80 180,150 270,90 380,160 400,160 400,200 0,200" fill="#A855F7" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95" cy="25" r="20" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="3" />
              <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="12" y="42" width="70" height="36" rx="6" fill="#C084FC" />
              <rect x="18" y="48" width="16" height="12" rx="2" fill="#3B0764" />
              <rect x="38" y="48" width="16" height="12" rx="2" fill="#3B0764" />
              <circle cx="28" cy="78" r="8" fill="#18181B" stroke="#E9D5FF" strokeWidth="2" />
              <circle cx="62" cy="78" r="8" fill="#18181B" stroke="#E9D5FF" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );

    case 'dindori':
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-orange-900 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <line x1="0" y1="140" x2="400" y2="140" stroke="#F97316" strokeWidth="3" strokeDasharray="14 8" />
            <rect x="40" y="30" width="60" height="85" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="120" y="30" width="60" height="85" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/30 border border-orange-400/40 text-orange-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95" cy="25" r="20" fill="#EA580C" stroke="#FFFFFF" strokeWidth="3" />
              <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="15" y="50" width="66" height="24" rx="6" fill="#FB923C" />
              <path d="M26 50 L34 36 L58 36 L66 50 Z" fill="#FDBA74" />
              <circle cx="30" cy="74" r="7.5" fill="#18181B" stroke="#FED7AA" strokeWidth="2" />
              <circle cx="62" cy="74" r="7.5" fill="#18181B" stroke="#FED7AA" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );

    case 'inner':
    default:
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <line x1="0" y1="140" x2="400" y2="140" stroke="#38BDF8" strokeWidth="3" strokeDasharray="10 6" />
            <rect x="30" y="35" width="50" height="75" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="95" y="35" width="50" height="75" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="160" y="35" width="50" height="75" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          </svg>
          <div className="relative z-10 space-y-1 max-w-[60%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
              {activeTag}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
              {zoneName}
            </h2>
          </div>
          <div className="relative z-10 shrink-0">
            <svg width="115" height="90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95" cy="25" r="20" fill="#0284C7" stroke="#FFFFFF" strokeWidth="3" />
              <text x="95" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="sans-serif">P</text>
              <rect x="14" y="46" width="68" height="32" rx="6" fill="#38BDF8" />
              <rect x="20" y="52" width="14" height="10" rx="2" fill="#0C4A6E" />
              <rect x="38" y="52" width="14" height="10" rx="2" fill="#0C4A6E" />
              <circle cx="28" cy="78" r="8" fill="#0F172A" stroke="#E0F2FE" strokeWidth="2" />
              <circle cx="64" cy="78" r="8" fill="#0F172A" stroke="#E0F2FE" strokeWidth="2" />
            </svg>
          </div>
        </div>
      );
  }
}

