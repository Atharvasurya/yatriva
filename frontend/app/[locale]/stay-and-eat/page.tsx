'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  BedDouble,
  Utensils,
  LayoutGrid,
  Tent,
  Building2,
  Hotel,
  AlertTriangle,
  Search,
  Star,
  Check,
  Heart,
  Navigation,
  Sparkles,
  Compass,
  Leaf,
} from 'lucide-react';
import {
  LODGING_DINING_LISTINGS,
  type Listing,
  type LodgingListing,
  type RestaurantListing,
  type PriceRange,
  type AccommodationType,
} from '@/data/lodgingDining';

const ACCOM_LABELS: Record<AccommodationType, { en: string; hi: string; mr: string }> = {
  hotel:        { en: 'Hotel', hi: 'होटल', mr: 'हॉटेल' },
  guesthouse:   { en: 'Guesthouse', hi: 'गेस्टहाउस', mr: 'गेस्टहाऊस' },
  tent_resort:  { en: 'Tent Resort', hi: 'टेंट रिसॉर्ट', mr: 'टेंट रिसॉर्ट' },
};

export default function StayAndEatPage() {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const t = useTranslations('stayAndEat');

  // ── States ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'all' | 'lodging' | 'restaurant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceRange | 'all'>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedAccomType, setSelectedAccomType] = useState<AccommodationType | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Filtered Listings ─────────────────────────────────────────────────────
  const filtered = useMemo<Listing[]>(() => {
    return LODGING_DINING_LISTINGS.filter((item) => {
      // Tab filter
      if (activeTab !== 'all' && item.listingType !== activeTab) return false;

      // Accommodation subtype filter
      if (
        selectedAccomType !== 'all' &&
        item.listingType === 'lodging' &&
        item.accommodationType !== selectedAccomType
      ) {
        return false;
      }

      // Price range
      if (priceFilter !== 'all' && item.priceRange !== priceFilter) return false;

      // Veg only
      if (vegOnly && item.listingType === 'restaurant' && !item.vegOnly) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const name = (item.name[locale] || item.name.en).toLowerCase();
        const desc = (item.description[locale] || item.description.en).toLowerCase();
        const tags = item.tags.map((tg) => (tg[locale] || tg.en).toLowerCase()).join(' ');
        const distance = (item.distance[locale] || item.distance.en).toLowerCase();
        const cuisine = item.listingType === 'restaurant' ? item.cuisineType.toLowerCase() : '';

        if (
          !name.includes(query) &&
          !desc.includes(query) &&
          !tags.includes(query) &&
          !distance.includes(query) &&
          !cuisine.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, selectedAccomType, priceFilter, vegOnly, searchQuery, locale]);

  const lodgingCount = LODGING_DINING_LISTINGS.filter((l) => l.listingType === 'lodging').length;
  const diningCount = LODGING_DINING_LISTINGS.filter((l) => l.listingType === 'restaurant').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* ── Back Navigation ─────────────────────────────────────────────────── */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 border border-slate-200/90 hover:border-amber-300 text-xs font-bold shadow-2xs transition-all duration-200 hover:-translate-x-0.5 active:scale-95 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 text-amber-700 transition-transform group-hover:-translate-x-0.5" />
        <span>
          {locale === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : locale === 'mr' ? 'मुख्य पृष्ठावर परत जा' : 'Back to Home'}
        </span>
      </Link>

      {/* ── Signature Yatriva Header Banner ─────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 50%, #C2581A 100%)' }}
      >
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Utensils className="w-56 h-56 text-white" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
            <BedDouble className="h-8 w-8 sm:h-9 sm:w-9 text-amber-300" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'होटल, आवास एवं रेस्तरां • सिंहस्थ २०२७' : locale === 'mr' ? 'हॉटेल्स, निवास व भोजनालये • सिंहस्थ २०२७' : 'Hotels, Stays & Dining • Simhastha 2027'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('title')}</h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {locale === 'hi'
                ? 'कुंभ मेला 2027 के लिए सत्यापित होटल, गेस्टहाउस, टेंट रिसॉर्ट और भोजनालय।'
                : locale === 'mr'
                ? 'कुंभमेळा 2027 साठी सत्यापित हॉटेल्स, गेस्टहाऊस, टेंट रिसॉर्ट आणि भोजनालये.'
                : 'Verified hotels, guesthouses, tent resorts, and restaurants for your Kumbh pilgrimage.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Notice Banner ───────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-amber-50/95 border border-amber-200/90 flex items-center gap-3 shadow-2xs">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
        <p className="text-xs font-medium text-amber-900 leading-snug">
          {t('testDataNotice')}
        </p>
      </div>

      {/* ── Filter & Search Section ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setSelectedAccomType('all');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'all'
                ? 'text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
            style={activeTab === 'all' ? { background: '#1B2B4B' } : {}}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{locale === 'hi' ? 'सभी विकल्प' : locale === 'mr' ? 'सर्व पर्याय' : 'All Listings'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {LODGING_DINING_LISTINGS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lodging')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'lodging'
                ? 'text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
            style={activeTab === 'lodging' ? { background: '#1B2B4B' } : {}}
          >
            <BedDouble className="h-3.5 w-3.5" />
            <span>{locale === 'hi' ? 'होटल एवं आवास' : locale === 'mr' ? 'हॉटेल्स व निवास' : 'Hotels & Stays'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                activeTab === 'lodging' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {lodgingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('restaurant');
              setSelectedAccomType('all');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'restaurant'
                ? 'text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
            style={activeTab === 'restaurant' ? { background: '#E87722' } : {}}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>{locale === 'hi' ? 'भोजन एवं रेस्तरां' : locale === 'mr' ? 'भोजन व उपहारगृहे' : 'Dining & Restaurants'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                activeTab === 'restaurant' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {diningCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'restaurant'
                ? (locale === 'hi' ? 'रेस्तरां, थाली, ढाबा, मिसल खोजें...' : locale === 'mr' ? 'रेस्टॉरंट, थाळी, ढाबा, मिसळ शोधा...' : 'Search restaurants, thali, dhaba, misal...')
                : activeTab === 'lodging'
                ? (locale === 'hi' ? 'होटल, गेस्टहाउस, रिसॉर्ट खोजें...' : locale === 'mr' ? 'हॉटेल, गेस्टहाऊस, रिसॉर्ट शोधा...' : 'Search hotels, guesthouses, tent resorts...')
                : (locale === 'hi' ? 'होटल, आवास, रेस्तरां या स्थान खोजें...' : locale === 'mr' ? 'हॉटेल, निवास किंवा भोजनालय शोधा...' : 'Search hotels, accommodations, dining, or location...')
            }
            className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-navy-700 focus:ring-1 focus:ring-navy-700/20 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs font-semibold">
          {/* Pure Veg Toggle */}
          <button
            type="button"
            onClick={() => setVegOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              vegOnly
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            <Leaf className={`h-3.5 w-3.5 ${vegOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>{locale === 'hi' ? 'शुद्ध शाकाहारी' : locale === 'mr' ? 'शुद्ध शाकाहारी' : 'Pure Veg'}</span>
          </button>

          {/* Lodging Subtypes */}
          {activeTab !== 'restaurant' && (
            <>
              {(['hotel', 'guesthouse', 'tent_resort'] as const).map((type) => {
                const IconComp =
                  type === 'hotel'
                    ? Hotel
                    : type === 'guesthouse'
                    ? Building2
                    : Tent;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setSelectedAccomType((curr) => (curr === type ? 'all' : type))
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                      selectedAccomType === type
                        ? 'text-white border-navy-800 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    style={selectedAccomType === type ? { background: '#1B2B4B' } : {}}
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    <span>{ACCOM_LABELS[type][locale]}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* Price Range */}
          {(['all', 'budget', 'mid'] as const).map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => setPriceFilter(pr)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                priceFilter === pr
                  ? 'bg-slate-800 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>
                {pr === 'all'
                  ? (locale === 'hi' ? 'सभी दर' : locale === 'mr' ? 'सर्व दर' : 'All Prices')
                  : pr === 'budget'
                  ? (locale === 'hi' ? 'बजट (< ₹500)' : locale === 'mr' ? 'बजेट (< ₹500)' : 'Budget Friendly')
                  : (locale === 'hi' ? 'प्रीमियम / मध्यम' : locale === 'mr' ? 'प्रीमियम / मध्यम' : 'Mid / Premium')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Filters Summary ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
        <div>
          <span>
            {locale === 'hi'
              ? `${filtered.length} सूचियां उपलब्ध`
              : locale === 'mr'
              ? `${filtered.length} उपलब्ध नोंदी`
              : `Showing ${filtered.length} listing${filtered.length !== 1 ? 's' : ''}`}
          </span>
          {searchQuery && (
            <span className="text-slate-500 ml-1">
              for &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        {(vegOnly || priceFilter !== 'all' || selectedAccomType !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setVegOnly(false);
              setPriceFilter('all');
              setSelectedAccomType('all');
              setSearchQuery('');
            }}
            className="text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
          >
            {locale === 'hi' ? 'फ़िल्टर हटाएं' : locale === 'mr' ? 'फिल्टर हटवा' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* ── Wego-Style Horizontal Cards Stack ───────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-14 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            {locale === 'hi' ? 'कोई परिणाम नहीं मिला' : locale === 'mr' ? 'कोणतेही निकाल आढळले नाहीत' : 'No listings found'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {locale === 'hi'
              ? 'कृपया अपने फ़िल्टर बदलें या दूसरा खोज शब्द चुनें।'
              : locale === 'mr'
              ? 'कृपया आपले फिल्टर बदला किंवा दुसरा शब्द निवडा.'
              : 'Try selecting a different filter combination or clearing your search term.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const name = item.name[locale] || item.name.en;
            const desc = item.description[locale] || item.description.en;
            const distance = item.distance[locale] || item.distance.en;
            const priceAmount = item.priceAmount || item.priceDisplay[locale];
            const priceSubtext = item.priceSubtext?.[locale] || item.priceSubtext?.en || 'includes taxes and fees';
            const ratingScore = item.ratingScore || (item.rating * 2).toFixed(1);
            const ratingLabel = item.ratingLabel?.[locale] || item.ratingLabel?.en || 'Very Good';
            const starCount = item.starCount || 4;
            const isFav = favorites.has(item.id);

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/95 hover:border-emerald-600/70 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row group"
              >
                {/* ── Left Column: Photography & Thumbnails ────────────────────── */}
                <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200/80">
                  {/* Main Image with Floating Favorite Heart */}
                  <div className="relative h-44 sm:h-48 md:h-44 w-full overflow-hidden bg-slate-200">
                    <Image
                      src={item.imageUrl}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />

                    {/* Category Label Overlay */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {item.listingType === 'lodging'
                        ? ACCOM_LABELS[(item as LodgingListing).accommodationType][locale]
                        : (item as RestaurantListing).cuisineType}
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      aria-label="Save to favorites"
                      className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom 3-Thumbnails Strip (Wego exact design) */}
                  <div className="grid grid-cols-3 gap-0.5 h-14 w-full bg-white border-t border-white">
                    {item.thumbnails && item.thumbnails.length >= 3 ? (
                      <>
                        <div className="relative h-full w-full overflow-hidden bg-slate-200">
                          <Image
                            src={item.thumbnails[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden bg-slate-200">
                          <Image
                            src={item.thumbnails[1]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                        <div className="relative h-full w-full overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer group/thumb">
                          <Image
                            src={item.thumbnails[2]}
                            alt=""
                            fill
                            className="object-cover opacity-50 group-hover/thumb:opacity-40 transition-opacity"
                            sizes="100px"
                          />
                          <span className="relative z-10 text-[11px] font-bold text-white tracking-wide">
                            See all
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-3 h-full bg-slate-100" />
                    )}
                  </div>
                </div>

                {/* ── Middle Column: Title, Map Link & Checklist ───────────────── */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Title + Star Rating (Wego style) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-navy-700 transition-colors leading-snug">
                        {name}
                      </h2>
                      {/* Golden Stars */}
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: starCount }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* View on Map Link (Wego compass target icon) */}
                    <a
                      href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-1"
                    >
                      <Compass className="h-3.5 w-3.5 text-blue-600" />
                      <span>{locale === 'hi' ? 'मानचित्र पर देखें' : locale === 'mr' ? 'नकाशावर पहा' : 'View on map'}</span>
                      <span className="text-slate-400 font-normal ml-1">({distance})</span>
                    </a>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  {/* Amenities Checklist (2 Columns with Green Checkmarks) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {item.checklist && item.checklist.length > 0 ? (
                      item.checklist.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                          <span className="truncate">{c[locale] || c.en}</span>
                        </div>
                      ))
                    ) : (
                      item.tags.map((tItem, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                          <span className="truncate">{tItem[locale] || tItem.en}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* ── Dashed Vertical Divider ─────────────────────────────────── */}
                <div className="border-r border-dashed border-slate-200 my-4 hidden md:block" />

                {/* ── Right Column: Review Score & Price ───────────────────────── */}
                <div className="w-full md:w-56 lg:w-60 p-4 sm:p-5 flex flex-col justify-between items-start md:items-end md:text-right border-t md:border-t-0 border-slate-100 bg-slate-50/50 md:bg-transparent">
                  {/* Top Score Badge Row */}
                  <div className="flex items-center justify-between md:justify-end w-full gap-2.5">
                    <div className="leading-tight">
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {ratingLabel}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.reviewsCount} {locale === 'hi' ? 'समीक्षाएं' : locale === 'mr' ? 'अभिप्राय' : 'Reviews'}
                      </div>
                    </div>

                    {/* Wego Green Score Pill */}
                    <div className="bg-emerald-700 text-white font-black text-sm px-2.5 py-1 rounded-lg shadow-2xs">
                      {ratingScore}
                    </div>
                  </div>

                  {/* Bottom Price & Action CTA */}
                  <div className="w-full pt-4 md:pt-0 mt-3 md:mt-auto">
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none tracking-tight">
                        {priceAmount}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {priceSubtext}
                      </div>
                    </div>

                    {/* Directions Action Button */}
                    <a
                      href={`https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 mt-3 w-full rounded-xl text-xs font-bold text-white shadow-xs active:scale-95 transition-all hover:brightness-110"
                      style={{ background: '#1B2B4B' }}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{locale === 'hi' ? 'दिशा-निर्देश' : locale === 'mr' ? 'दिशा-निर्देश' : 'Directions'}</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
