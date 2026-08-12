'use client';

import { useLocale } from 'next-intl';
import { MapPin, Navigation, X, Check, ShieldAlert } from 'lucide-react';
import { PRESET_PILGRIM_LOCATIONS, PilgrimPresetLocation } from '@/hooks/useUserLocation';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PilgrimPresetLocation) => void;
  onRequestGps: () => void;
  currentSource: 'gps' | 'manual';
  activePresetId?: string;
  gpsError?: string | null;
  isLocating?: boolean;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectPreset,
  onRequestGps,
  currentSource,
  activePresetId,
  gpsError,
  isLocating,
}: LocationPickerModalProps) {
  const locale = useLocale() as 'en' | 'hi' | 'mr';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="picker-title"
      >
        {/* Handle pill for mobile dragging UI */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-saffron-500" style={{ color: '#E87722' }} />
            <h2 id="picker-title" className="font-black text-lg text-navy-800" style={{ color: '#1B2B4B' }}>
              Set Your Location / आपका स्थान
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          GPS signals can be unreliable in crowded pilgrimage zones. Use GPS or pick your current landmark manually.
        </p>

        {/* GPS Button */}
        <button
          onClick={() => {
            onRequestGps();
            onClose();
          }}
          disabled={isLocating}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border font-bold text-sm transition-all min-h-[48px] ${
            currentSource === 'gps'
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <Navigation className={`h-5 w-5 ${isLocating ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
            <span>{isLocating ? 'Detecting GPS Location...' : 'Use My Live GPS Location'}</span>
          </div>
          {currentSource === 'gps' && <Check className="h-5 w-5 text-blue-600" />}
        </button>

        {gpsError && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Preset Landmarks Header */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Or Select Nearby Pilgrim Landmark (Dense Crowd Fallback)
          </span>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {PRESET_PILGRIM_LOCATIONS.map((preset) => {
              const isSelected = currentSource === 'manual' && activePresetId === preset.id;
              const name = locale === 'hi'
                ? preset.nameHi
                : locale === 'mr'
                ? preset.nameMr
                : preset.nameEn;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-navy-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                  style={isSelected ? { background: '#1B2B4B' } : {}}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`h-4 w-4 ${isSelected ? 'text-saffron-400' : 'text-slate-400'}`} />
                    <span>{name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-saffron-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
