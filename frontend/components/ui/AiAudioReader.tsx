'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Globe, Sparkles, Sliders, Mic, ChevronDown } from 'lucide-react';

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
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  
  // Sentence chunking & progress state
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const sentenceIndexRef = useRef<number>(0);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (!synthRef.current) return;
        const voices = synthRef.current.getVoices();
        setAvailableVoices(voices);
      };

      updateVoices();

      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    } else {
      setSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update sentence list whenever text or selected language changes
  useEffect(() => {
    const rawText = textToRead[selectedLang] || textToRead.en || '';
    // Split text into natural sentences by punctuation (. ! ? । or newlines)
    const splitSentences = rawText
      .split(/(?<=[.!?।\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setSentences(splitSentences.length > 0 ? splitSentences : [rawText]);
    setCurrentSentenceIdx(0);
    sentenceIndexRef.current = 0;

    if (isPlayingRef.current && synthRef.current) {
      synthRef.current.cancel();
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [selectedLang, textToRead]);

  // Find best matching voices for selected language
  const getVoicesForLang = (lang: 'en' | 'hi' | 'mr') => {
    const targetCode = lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en';
    const filtered = availableVoices.filter((v) =>
      v.lang.toLowerCase().startsWith(targetCode) || v.lang.toLowerCase().includes(targetCode)
    );
    if (filtered.length > 0) return filtered;
    // Fallback for Marathi to Hindi voices if Marathi is unavailable in OS
    if (lang === 'mr') {
      return availableVoices.filter((v) => v.lang.toLowerCase().startsWith('hi'));
    }
    return availableVoices;
  };

  const currentLangVoices = getVoicesForLang(selectedLang);

  // Auto-select best voice if not explicitly chosen
  useEffect(() => {
    if (currentLangVoices.length > 0) {
      const alreadySelected = currentLangVoices.find((v) => v.name === selectedVoiceName);
      if (!alreadySelected) {
        setSelectedVoiceName(currentLangVoices[0].name);
      }
    }
  }, [selectedLang, availableVoices]);

  // Speak a single sentence chunk
  const speakSentence = (index: number) => {
    if (!synthRef.current || index >= sentences.length || !isPlayingRef.current) {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      return;
    }

    synthRef.current.cancel(); // Clear pending queue

    const sentenceText = sentences[index];
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.rate = rate;

    // Assign chosen voice
    const activeVoice = availableVoices.find((v) => v.name === selectedVoiceName);
    if (activeVoice) {
      utterance.voice = activeVoice;
      utterance.lang = activeVoice.lang;
    } else {
      utterance.lang = selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'mr' ? 'mr-IN' : 'en-IN';
    }

    setCurrentSentenceIdx(index);
    sentenceIndexRef.current = index;

    utterance.onend = () => {
      if (isPlayingRef.current) {
        const nextIdx = index + 1;
        if (nextIdx < sentences.length) {
          speakSentence(nextIdx);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          isPlayingRef.current = false;
          setCurrentSentenceIdx(0);
          sentenceIndexRef.current = 0;
        }
      }
    };

    utterance.onerror = (e) => {
      console.warn('Utterance speech error:', e);
      const nextIdx = index + 1;
      if (nextIdx < sentences.length && isPlayingRef.current) {
        speakSentence(nextIdx);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        isPlayingRef.current = false;
      }
    };

    synthRef.current.speak(utterance);
  };

  const handlePlay = () => {
    if (!synthRef.current || !supported) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(sentenceIndexRef.current);
  };

  const handlePause = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
    isPlayingRef.current = false;
  };

  const handleStop = () => {
    if (!synthRef.current) return;
    isPlayingRef.current = false;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIdx(0);
    sentenceIndexRef.current = 0;
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlayingRef.current && synthRef.current) {
      synthRef.current.cancel();
      setTimeout(() => speakSentence(sentenceIndexRef.current), 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 rounded-2xl p-5 sm:p-6 text-white shadow-2xl border border-indigo-700/60 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 backdrop-blur-md border border-amber-300/30 shadow-inner">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg tracking-tight">AI Heritage Audio Reader</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Live Speech Engine
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Listen to the history & spiritual significance of {templeName}
            </p>
          </div>
        </div>

        {/* Audio Wave Visualizer when Playing */}
        {isPlaying && (
          <div className="flex items-center gap-1.5 h-7 px-3.5 py-1 bg-indigo-900/80 rounded-full border border-indigo-400/40 shadow-inner">
            <span className="w-1 bg-amber-400 h-3 animate-bounce rounded-full" />
            <span className="w-1 bg-amber-300 h-5 animate-bounce delay-75 rounded-full" />
            <span className="w-1 bg-amber-400 h-2 animate-bounce delay-150 rounded-full" />
            <span className="w-1 bg-amber-300 h-4 animate-bounce delay-200 rounded-full" />
            <span className="text-[10px] font-extrabold text-amber-200 ml-1 uppercase tracking-wider">Reading Aloud</span>
          </div>
        )}
      </div>

      {/* Active Sentence Highlight Box */}
      {sentences.length > 0 && (
        <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-700/50 text-xs sm:text-sm leading-relaxed text-indigo-100 font-medium">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 mb-1">
            <span>Current Sentence ({currentSentenceIdx + 1} of {sentences.length}):</span>
            {isPlaying && <span className="animate-pulse text-emerald-400">● Active</span>}
          </div>
          <p className="text-white font-semibold">
            "{sentences[currentSentenceIdx]}"
          </p>
        </div>
      )}

      {/* Controls Bar */}
      <div className="pt-2 border-t border-indigo-700/50 flex flex-wrap items-center justify-between gap-3">
        {/* Language Selector */}
        <div className="flex items-center bg-indigo-950/80 p-1 rounded-xl border border-indigo-700/60 shadow-inner">
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

        {/* Voice Selector Dropdown if multiple voices exist */}
        {currentLangVoices.length > 1 && (
          <div className="flex items-center gap-1.5 bg-indigo-950/80 px-2.5 py-1 rounded-xl border border-indigo-700/60 shadow-inner">
            <Mic className="h-3.5 w-3.5 text-indigo-300 shrink-0" />
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="bg-transparent text-xs text-indigo-100 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {currentLangVoices.map((v) => (
                <option key={v.name} value={v.name} className="bg-indigo-900 text-white">
                  {v.name.replace(/(Microsoft|Google|Apple)/g, '').trim()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Playback Speed */}
        <div className="flex items-center gap-1.5 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-700/60 shadow-inner">
          <Sliders className="h-3.5 w-3.5 text-indigo-300" />
          <span className="text-xs text-indigo-300 font-semibold mr-1">Speed:</span>
          {[1.0, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => handleRateChange(s)}
              className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${
                rate === s
                  ? 'bg-indigo-600 text-white border border-indigo-400'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Main Action Buttons */}
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
              className="p-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-rose-300 border border-indigo-700 transition-colors cursor-pointer"
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
