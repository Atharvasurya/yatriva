'use client';

import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Search,
  X,
  MapPin,
  Utensils,
  BookOpen,
  Bus,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowRight,
  BedDouble,
  Compass,
} from 'lucide-react';
import type { SearchApiResponse, CategoryGroup, SearchResultItem } from '@/app/api/search/route';

interface QuickPill {
  label: string;
  icon: typeof MapPin;
  query: string;
}

const QUICK_SEARCH_PILLS: QuickPill[] = [
  { label: 'Ramkund Ghat', icon: MapPin, query: 'Ramkund' },
  { label: 'Trimbakeshwar', icon: Sparkles, query: 'Trimbakeshwar' },
  { label: 'Panchavati', icon: Compass, query: 'Panchavati' },
  { label: 'Kalaram Temple', icon: Sparkles, query: 'Kalaram' },
  { label: 'Hotels & Stays', icon: BedDouble, query: 'Hotel' },
  { label: 'Pure Veg Food', icon: Utensils, query: 'Pure Veg' },
  { label: 'MSRTC Shuttles', icon: Bus, query: 'MSRTC' },
];

export default function GlobalNavbarSearch() {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CategoryGroup[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, SearchApiResponse>>(new Map());

  // Flattened items list for keyboard navigation
  const flatItems: { item: SearchResultItem; groupIndex: number; itemIndex: number }[] = [];
  results.forEach((group, gIdx) => {
    group.items.forEach((item, iIdx) => {
      flatItems.push({ item, groupIndex: gIdx, itemIndex: iIdx });
    });
  });

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open, reset on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setFocusedIndex(-1);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setFocusedIndex(-1);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen]);

  // Close when route/pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // High-speed API search with instant client caching & abort controller
  const performSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || trimmed.length < 2) {
        setResults([]);
        setTotalMatches(0);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      const cacheKey = `${locale}:${trimmed.toLowerCase()}`;

      // Instant cache hit (0ms)
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setResults(cached.categories || []);
        setTotalMatches(cached.totalMatches || 0);
        setHasSearched(true);
        setLoading(false);
        setFocusedIndex(-1);
        return;
      }

      // Abort any prior in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          { signal: abortControllerRef.current.signal }
        );
        if (res.ok) {
          const data: SearchApiResponse = await res.json();
          cacheRef.current.set(cacheKey, data);
          setResults(data.categories || []);
          setTotalMatches(data.totalMatches || 0);
          setHasSearched(true);
          setFocusedIndex(-1);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setLoading(false);
      }
    },
    [locale]
  );

  // Fast 120ms debounce
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = val.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setTotalMatches(0);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    // Check cache immediately for instant UI update
    const cacheKey = `${locale}:${trimmed.toLowerCase()}`;
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey)!;
      setResults(cached.categories || []);
      setTotalMatches(cached.totalMatches || 0);
      setHasSearched(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(val);
    }, 120);
  };

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.push(url);
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
        handleSelectResult(flatItems[focusedIndex].item.url);
      }
    }
  };

  // Helper category icon renderer
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="h-4 w-4 text-amber-600" />;
      case 'Utensils':
        return <Utensils className="h-4 w-4 text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="h-4 w-4 text-orange-600" />;
      case 'Bus':
        return <Bus className="h-4 w-4 text-purple-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Trigger Button in Navbar (Bold White Search Icon) ──────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full text-white hover:bg-white/15 transition-all active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 shrink-0"
        aria-label={
          locale === 'hi'
            ? 'कुंभ मेला खोजें (Ctrl+K)'
            : locale === 'mr'
            ? 'कुंभमेळा शोधा (Ctrl+K)'
            : 'Search Yatriva (Press Ctrl+K)'
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Search className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-white shrink-0 stroke-[2.75]" strokeWidth={2.75} />
      </button>

      {/* ── Modal Backdrop Overlay ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Command Palette Modal Dialog ──────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site Search"
          className="fixed inset-x-3 top-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-[10%] sm:w-[580px] md:w-[620px] max-h-[85vh] sm:max-h-[540px] bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 z-[61] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Top Search Input Bar (Zero orange rings / Zero browser outlines) */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white">
            <Search className="h-5 w-5 text-slate-400 shrink-0 stroke-[2.2]" />
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                locale === 'hi'
                  ? 'मंदिर, घाट, होटल, बस या इतिहास खोजें...'
                  : locale === 'mr'
                  ? 'मंदिर, घाट, निवास, बस किंवा संस्कृती शोधा...'
                  : 'Search temples, ghats, hotels, buses, culture...'
              }
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              className="w-full bg-transparent text-slate-900 text-sm sm:text-base placeholder:text-slate-400 font-medium tracking-tight outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ring-0 border-none p-0 focus:border-transparent focus:shadow-none shadow-none"
            />
            {loading && <Loader2 className="h-4 w-4 text-amber-600 animate-spin shrink-0" />}
            {query.length > 0 && !loading && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center pl-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200/90 rounded shadow-2xs">
                ESC
              </kbd>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-xs font-bold text-slate-500 hover:text-slate-800 px-1 py-1"
            >
              Cancel
            </button>
          </div>

          {/* Results / Suggestions Scrollable Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 overscroll-contain p-2">
            {/* 1. Clean Popular Suggestions (Shown when query is empty) */}
            {query.trim().length < 2 && (
              <div className="p-3 sm:p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>
                      {locale === 'hi'
                        ? 'लोकप्रिय खोज सुझाव'
                        : locale === 'mr'
                        ? 'लोकप्रिय शोध पर्याय'
                        : 'Suggested Searches'}
                    </span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {locale === 'hi' ? 'त्वरित चयन' : locale === 'mr' ? 'झटपट निवडा' : 'Quick select'}
                  </span>
                </div>

                {/* Refined clean pills */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCH_PILLS.map((pill) => {
                    const Icon = pill.icon;
                    return (
                      <button
                        key={pill.label}
                        type="button"
                        onClick={() => handleQueryChange(pill.query)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 text-xs font-semibold text-slate-700 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                      >
                        <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-600" />
                        <span>{pill.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {locale === 'hi'
                      ? 'नासिक व त्र्यंबकेश्वर के 1,990+ पवित्र स्थल'
                      : locale === 'mr'
                      ? 'नाशिक व त्र्यंबकेश्वरची 1,990+ पवित्र ठिकाणे'
                      : 'Covering 1,990+ places, hotels, dining & MSRTC routes'}
                  </span>
                </div>
              </div>
            )}

            {/* 2. Zero Results Empty State */}
            {hasSearched && totalMatches === 0 && !loading && (
              <div className="py-10 px-4 text-center space-y-2.5">
                <div className="inline-flex p-3 rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {locale === 'hi'
                    ? `"${query}" के लिए कोई परिणाम नहीं मिला`
                    : locale === 'mr'
                    ? `"${query}" साठी कोणतेही निकाल आढळले नाहीत`
                    : `No results found for "${query}"`}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {locale === 'hi'
                    ? 'कृपया अन्य कीवर्ड या नीचे दिए गए किसी त्वरित विषय को आजमाएं।'
                    : locale === 'mr'
                    ? 'कृपया दुसरा शब्द किंवा खालीलपैकी लोकप्रिय पर्याय निवडा.'
                    : 'Try checking your spelling or selecting a major landmark below.'}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {QUICK_SEARCH_PILLS.slice(0, 4).map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleQueryChange(p.query)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-xs font-semibold text-slate-700 hover:text-amber-900 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Categorized Search Results */}
            {results.map((group, gIdx) => {
              const prevItemsCount = results
                .slice(0, gIdx)
                .reduce((acc, curr) => acc + curr.items.length, 0);

              return (
                <div key={group.id} className="py-2 first:pt-1 last:pb-1">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      {renderCategoryIcon(group.iconName)}
                      <span>{group.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {group.total}
                    </span>
                  </div>

                  {/* Items list */}
                  <ul className="mt-1 space-y-1">
                    {group.items.map((item, iIdx) => {
                      const overallIndex = prevItemsCount + iIdx;
                      const isFocused = focusedIndex === overallIndex;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectResult(item.url)}
                            onMouseEnter={() => setFocusedIndex(overallIndex)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                              isFocused
                                ? 'bg-amber-50/90 text-slate-900 ring-1 ring-amber-300'
                                : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold truncate leading-snug">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0 ${
                                      item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* See all button if more than 4 items */}
                  {group.total > group.items.length && (
                    <div className="px-3 pt-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectResult(group.viewAllUrl)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors py-1 cursor-pointer"
                      >
                        <span>
                          {locale === 'hi'
                            ? `${group.label} में सभी ${group.total} परिणाम देखें`
                            : locale === 'mr'
                            ? `${group.label} मधील सर्व ${group.total} निकाल पहा`
                            : `View all ${group.total} in ${group.label}`}
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clean Professional Footer Bar */}
          <div className="hidden sm:flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/90 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/90 rounded text-[10px] font-mono font-bold text-slate-600 shadow-2xs">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/90 rounded text-[10px] font-mono font-bold text-slate-600 shadow-2xs">
                  ↓
                </kbd>
                <span className="text-slate-500 font-medium">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/90 rounded text-[10px] font-mono font-bold text-slate-600 shadow-2xs">
                  ↵
                </kbd>
                <span className="text-slate-500 font-medium">select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/90 rounded text-[10px] font-mono font-bold text-slate-600 shadow-2xs">
                esc
              </kbd>
              <span className="text-slate-500 font-medium">close</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
