'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Globe, Sparkles, Sliders } from 'lucide-react';

interface AiAudioReaderProps {
  textToRead: {
    en: string;
    hi?: string;
    mr?: string;
  };
  templeName: string;
}

export default function AiAudioReader({ textToRead, templeName }: AiAudioReaderProps) {
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [supported, setSupported] = useState<boolean>(true);
  const [currentVoice, setCurrentVoice] = useState<string>('');

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Stop speaking if language changes
  useEffect(() => {
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [selectedLang]);

  const getBestVoice = (lang: 'en' | 'hi' | 'mr') => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();

    const targetLangCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    
    // First try exact match
    let voice = voices.find((v) => v.lang.toLowerCase().includes(targetLangCode.toLowerCase()));

    // Fallback for Marathi if mr-IN is missing in some browsers (fallback to Hindi or English)
    if (!voice && lang === 'mr') {
      voice = voices.find((v) => v.lang.toLowerCase().includes('hi-in'));
    }
    if (!voice) {
      voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
    }
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }
    return voice;
  };

  const handlePlay = () => {
    if (!synthRef.current || !supported) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel(); // Clear queued utterances

    const text = textToRead[selectedLang] || textToRead.en;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice(selectedLang);

    if (voice) {
      utterance.voice = voice;
      setCurrentVoice(voice.name);
    }

    utterance.rate = rate;
    utterance.lang = selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'mr' ? 'mr-IN' : 'en-IN';

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && synthRef.current) {
      handleStop();
      // Re-trigger play with new rate
      setTimeout(() => handlePlay(), 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-indigo-700/50 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 backdrop-blur-md border border-amber-300/30">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg tracking-tight">AI Heritage Audio Reader</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Multi-Lingual TTS
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Listen to the sacred history & significance of {templeName}
            </p>
          </div>
        </div>

        {/* Audio Visualizer Waves when Playing */}
        {isPlaying && (
          <div className="flex items-center gap-1 h-6 px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-400/30">
            <span className="w-1 bg-amber-400 h-3 animate-bounce rounded-full" />
            <span className="w-1 bg-amber-300 h-5 animate-bounce delay-100 rounded-full" />
            <span className="w-1 bg-amber-400 h-2 animate-bounce delay-200 rounded-full" />
            <span className="w-1 bg-amber-300 h-4 animate-bounce delay-300 rounded-full" />
            <span className="text-[10px] font-bold text-amber-200 ml-1.5 uppercase tracking-wider">Reading Aloud</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="pt-2 border-t border-indigo-700/50 flex flex-wrap items-center justify-between gap-4">
        {/* Language Tabs */}
        <div className="flex items-center bg-indigo-950/60 p-1 rounded-xl border border-indigo-700/50">
          <div className="px-2 text-indigo-300 text-xs font-semibold flex items-center gap-1 shrink-0">
            <Globe className="h-3.5 w-3.5" />
            <span>Lang:</span>
          </div>
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'en'
                ? 'bg-amber-500 text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang('hi')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'hi'
                ? 'bg-amber-500 text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setSelectedLang('mr')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'mr'
                ? 'bg-amber-500 text-indigo-950 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            मराठी
          </button>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center gap-1.5 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-700/50">
          <Sliders className="h-3.5 w-3.5 text-indigo-300" />
          <span className="text-xs text-indigo-300 font-semibold mr-1">Speed:</span>
          {[1.0, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => handleRateChange(speed)}
              className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${
                rate === speed
                  ? 'bg-indigo-700 text-white border border-indigo-400'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Play / Pause / Stop Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-indigo-950" />
              <span>{isPaused ? 'Resume Audio' : 'Listen Now'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs shadow-lg transition-all cursor-pointer"
            >
              <Pause className="h-4 w-4 fill-indigo-950" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-rose-300 border border-indigo-700 transition-colors cursor-pointer"
              title="Stop Audio"
            >
              <Square className="h-4 w-4 fill-rose-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
