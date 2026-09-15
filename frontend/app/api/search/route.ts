import { NextResponse } from 'next/server';
import { ALL_MAP_PLACES, TRANSPORT_ROUTES } from '@/data/seed';
import { LODGING_DINING_LISTINGS } from '@/data/lodgingDining';
import { CULTURE_TOPICS } from '@/data/cultureData';

export interface SearchResultItem {
  id: string;
  category: 'places' | 'stayAndEat' | 'culture' | 'transport';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  url: string;
  score: number;
}

export interface CategoryGroup {
  id: 'places' | 'stayAndEat' | 'culture' | 'transport';
  label: string;
  iconName: string;
  total: number;
  items: SearchResultItem[];
  viewAllUrl: string;
}

export interface SearchApiResponse {
  query: string;
  totalMatches: number;
  categories: CategoryGroup[];
}

// Category badge color utilities
function getPlaceBadge(cat: string): { label: string; color: string } {
  switch (cat) {
    case 'ghat':
      return { label: 'Ghat', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'temple':
      return { label: 'Temple', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'parking':
      return { label: 'Parking', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'transport_hub':
      return { label: 'Transport Hub', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'emergency':
      return { label: 'Emergency / Medical', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'info_centre':
      return { label: 'Help Desk', color: 'bg-teal-100 text-teal-800 border-teal-200' };
    case 'akhada':
      return { label: 'Akhada Camp', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    default:
      return { label: 'Place', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  }
}

// Fast string normalizer
function norm(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// ─── Pre-indexed In-Memory Records (Computed once at startup) ───────────────

interface IndexedItem {
  id: string;
  category: 'places' | 'stayAndEat' | 'culture' | 'transport';
  nEn: string;
  nHi: string;
  nMr: string;
  nExtra: string;
  wordsEn: string[];
  titles: Record<'en' | 'hi' | 'mr', string>;
  subtitles: Record<'en' | 'hi' | 'mr', string>;
  urls: Record<'en' | 'hi' | 'mr', string>;
  badge: string;
  badgeColor: string;
  bonus: number;
}

// Build pre-indexed places
const INDEXED_PLACES: IndexedItem[] = ALL_MAP_PLACES.map((place) => {
  const tEn = place.name.en || '';
  const tHi = place.name.hi || '';
  const tMr = place.name.mr || '';
  const nEn = norm(tEn);
  const nHi = norm(tHi);
  const nMr = norm(tMr);

  const descEn = place.description?.en || '';
  const descHi = place.description?.hi || descEn;
  const descMr = place.description?.mr || descEn;
  const addressStr = place.address || (place as { zone?: string }).zone || '';
  const tagsStr = (place.tags || []).join(' ');
  const nExtra = norm(`${descEn} ${descHi} ${descMr} ${addressStr} ${tagsStr} ${place.slug || ''} ${place.category}`);

  const badgeInfo = getPlaceBadge(place.category);
  const lat = place.coordinates?.lat || 19.9975;
  const lng = place.coordinates?.lng || 73.7898;
  const placeSlugOrId = place.slug || place.id;

  const truncate = (s: string) => (s.length > 70 ? s.slice(0, 70) + '...' : s);

  return {
    id: `place-${place.id}`,
    category: 'places',
    nEn,
    nHi,
    nMr,
    nExtra,
    wordsEn: nEn.split(/\s+/),
    titles: {
      en: tEn,
      hi: tHi || tEn,
      mr: tMr || tEn,
    },
    subtitles: {
      en: descEn ? truncate(descEn) : `${addressStr ? addressStr + ' • ' : ''}${badgeInfo.label}`,
      hi: descHi ? truncate(descHi) : `${addressStr ? addressStr + ' • ' : ''}${badgeInfo.label}`,
      mr: descMr ? truncate(descMr) : `${addressStr ? addressStr + ' • ' : ''}${badgeInfo.label}`,
    },
    urls: {
      en: `/en/map?place=${encodeURIComponent(placeSlugOrId)}&lat=${lat}&lng=${lng}&category=${place.category}`,
      hi: `/hi/map?place=${encodeURIComponent(placeSlugOrId)}&lat=${lat}&lng=${lng}&category=${place.category}`,
      mr: `/mr/map?place=${encodeURIComponent(placeSlugOrId)}&lat=${lat}&lng=${lng}&category=${place.category}`,
    },
    badge: badgeInfo.label,
    badgeColor: badgeInfo.color,
    bonus: place.verified ? 6 : 0,
  };
});

// Build pre-indexed stay & dining
const INDEXED_STAY_EAT: IndexedItem[] = LODGING_DINING_LISTINGS.map((item) => {
  const tEn = item.name.en || '';
  const tHi = item.name.hi || '';
  const tMr = item.name.mr || '';
  const nEn = norm(tEn);
  const nHi = norm(tHi);
  const nMr = norm(tMr);

  const descEn = item.description.en || '';
  const tags = item.tags.map((t) => t.en).join(' ');
  const nExtra = norm(`${descEn} ${tags} ${item.distance.en} ${item.listingType} ${item.listingType === 'restaurant' ? item.cuisineType : item.accommodationType}`);

  const isLodging = item.listingType === 'lodging';
  const badgeLabel = isLodging
    ? item.accommodationType === 'tent_resort'
      ? 'Tent Resort'
      : item.accommodationType === 'guesthouse'
      ? 'Guesthouse'
      : 'Hotel'
    : item.vegOnly
    ? 'Pure Veg'
    : 'Restaurant';

  const badgeColor = isLodging
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  const makeSubtitle = (lang: 'en' | 'hi' | 'mr') => {
    const d = item.distance[lang] || item.distance.en;
    const p = item.priceDisplay[lang] || item.priceDisplay.en;
    return `${d ? d + ' • ' : ''}${p}`;
  };

  return {
    id: `stay-${item.id}`,
    category: 'stayAndEat',
    nEn,
    nHi,
    nMr,
    nExtra,
    wordsEn: nEn.split(/\s+/),
    titles: {
      en: tEn,
      hi: tHi || tEn,
      mr: tMr || tEn,
    },
    subtitles: {
      en: makeSubtitle('en'),
      hi: makeSubtitle('hi'),
      mr: makeSubtitle('mr'),
    },
    urls: {
      en: `/en/stay-and-eat?search=${encodeURIComponent(tEn)}&type=${item.listingType}`,
      hi: `/hi/stay-and-eat?search=${encodeURIComponent(tEn)}&type=${item.listingType}`,
      mr: `/mr/stay-and-eat?search=${encodeURIComponent(tEn)}&type=${item.listingType}`,
    },
    badge: badgeLabel,
    badgeColor,
    bonus: 2,
  };
});

// Build pre-indexed culture
const INDEXED_CULTURE: IndexedItem[] = CULTURE_TOPICS.map((topic) => {
  const tEn = topic.title.en || '';
  const tHi = topic.title.hi || '';
  const tMr = topic.title.mr || '';
  const nEn = norm(tEn);
  const nHi = norm(tHi);
  const nMr = norm(tMr);

  const nExtra = norm(`${topic.subtitle.en} ${topic.content.en} ${topic.slug} ${topic.category}`);

  return {
    id: `culture-${topic.slug}`,
    category: 'culture',
    nEn,
    nHi,
    nMr,
    nExtra,
    wordsEn: nEn.split(/\s+/),
    titles: {
      en: tEn,
      hi: tHi || tEn,
      mr: tMr || tEn,
    },
    subtitles: {
      en: topic.subtitle.en || `${topic.readTimeMinutes} min read`,
      hi: topic.subtitle.hi || `${topic.readTimeMinutes} मिनट पठन`,
      mr: topic.subtitle.mr || `${topic.readTimeMinutes} मिनिट वाचन`,
    },
    urls: {
      en: `/en/culture/${topic.slug}`,
      hi: `/hi/culture/${topic.slug}`,
      mr: `/mr/culture/${topic.slug}`,
    },
    badge: 'Heritage',
    badgeColor: 'bg-saffron-100 text-saffron-800 border-saffron-200',
    bonus: 0,
  };
});

// Build pre-indexed transport
const INDEXED_TRANSPORT: IndexedItem[] = TRANSPORT_ROUTES.map((route) => {
  const routeNum = route.routeNumber || '';
  const tEn = routeNum ? `${routeNum} — ${route.routeNameEn}` : route.routeNameEn;
  const tHi = routeNum ? `${routeNum} — ${route.routeNameHi}` : route.routeNameHi;
  const tMr = routeNum ? `${routeNum} — ${route.routeNameMr}` : route.routeNameMr;
  const nEn = norm(tEn);
  const nHi = norm(tHi);
  const nMr = norm(tMr);

  const nExtra = norm(`${route.origin} ${route.destination} ${route.operatorEn} ${route.notes || ''}`);
  const freqText = route.frequencyMinutes ? ` • ${route.frequencyMinutes}m` : '';

  return {
    id: `route-${route.id}`,
    category: 'transport',
    nEn,
    nHi,
    nMr,
    nExtra,
    wordsEn: nEn.split(/\s+/),
    titles: {
      en: tEn,
      hi: tHi || tEn,
      mr: tMr || tEn,
    },
    subtitles: {
      en: `${route.origin} ⇄ ${route.destination}${freqText}`,
      hi: `${route.origin} ⇄ ${route.destination}${freqText}`,
      mr: `${route.origin} ⇄ ${route.destination}${freqText}`,
    },
    urls: {
      en: `/en/transport?route=${encodeURIComponent(routeNum || route.id)}`,
      hi: `/hi/transport?route=${encodeURIComponent(routeNum || route.id)}`,
      mr: `/mr/transport?route=${encodeURIComponent(routeNum || route.id)}`,
    },
    badge: route.operatorEn || 'Shuttle',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    bonus: 0,
  };
});

// Fast scoring against pre-indexed item (< 0.001ms per item)
function matchScore(item: IndexedItem, q: string): number {
  if (item.nEn === q || item.nHi === q || item.nMr === q) return 100 + item.bonus;
  if (item.nEn.startsWith(q) || item.nHi.startsWith(q) || item.nMr.startsWith(q)) return 85 + item.bonus;
  for (let i = 0; i < item.wordsEn.length; i++) {
    if (item.wordsEn[i].startsWith(q)) return 70 + item.bonus;
  }
  if (item.nEn.includes(q) || item.nHi.includes(q) || item.nMr.includes(q)) return 50 + item.bonus;
  if (item.nExtra.includes(q)) return 25 + item.bonus;
  return 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qRaw = searchParams.get('q') || '';
  const locale = (searchParams.get('locale') || 'en') as 'en' | 'hi' | 'mr';
  const q = norm(qRaw);

  if (!q || q.length < 2) {
    return NextResponse.json({
      query: qRaw,
      totalMatches: 0,
      categories: [],
    } satisfies SearchApiResponse);
  }

  const collectMatches = (items: IndexedItem[]): SearchResultItem[] => {
    const list: SearchResultItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const score = matchScore(item, q);
      if (score > 0) {
        list.push({
          id: item.id,
          category: item.category,
          title: item.titles[locale] || item.titles.en,
          subtitle: item.subtitles[locale] || item.subtitles.en,
          badge: item.badge,
          badgeColor: item.badgeColor,
          url: item.urls[locale] || item.urls.en,
          score,
        });
      }
    }
    return list.sort((a, b) => b.score - a.score);
  };

  const placeMatches = collectMatches(INDEXED_PLACES);
  const stayAndEatMatches = collectMatches(INDEXED_STAY_EAT);
  const cultureMatches = collectMatches(INDEXED_CULTURE);
  const transportMatches = collectMatches(INDEXED_TRANSPORT);

  const totalMatches =
    placeMatches.length +
    stayAndEatMatches.length +
    cultureMatches.length +
    transportMatches.length;

  const labels = {
    places: { en: 'Places & Sacred Sites', hi: 'पवित्र स्थल और घाट', mr: 'पवित्र ठिकाणे आणि घाट' },
    stayAndEat: { en: 'Stay & Dining', hi: 'आवास एवं भोजन', mr: 'निवास व खानपान' },
    culture: { en: 'Culture & Heritage', hi: 'संस्कृति एवं इतिहास', mr: 'संस्कृती व इतिहास' },
    transport: { en: 'Transport & Shuttles', hi: 'परिवहन एवं बसें', mr: 'वाहतूक व बसेस' },
  };

  const categories: CategoryGroup[] = [];

  if (placeMatches.length > 0) {
    categories.push({
      id: 'places',
      label: labels.places[locale] || labels.places.en,
      iconName: 'MapPin',
      total: placeMatches.length,
      items: placeMatches.slice(0, 4),
      viewAllUrl: `/${locale}/map?q=${encodeURIComponent(qRaw)}`,
    });
  }

  if (stayAndEatMatches.length > 0) {
    categories.push({
      id: 'stayAndEat',
      label: labels.stayAndEat[locale] || labels.stayAndEat.en,
      iconName: 'Utensils',
      total: stayAndEatMatches.length,
      items: stayAndEatMatches.slice(0, 4),
      viewAllUrl: `/${locale}/stay-and-eat?search=${encodeURIComponent(qRaw)}`,
    });
  }

  if (cultureMatches.length > 0) {
    categories.push({
      id: 'culture',
      label: labels.culture[locale] || labels.culture.en,
      iconName: 'BookOpen',
      total: cultureMatches.length,
      items: cultureMatches.slice(0, 4),
      viewAllUrl: `/${locale}/culture`,
    });
  }

  if (transportMatches.length > 0) {
    categories.push({
      id: 'transport',
      label: labels.transport[locale] || labels.transport.en,
      iconName: 'Bus',
      total: transportMatches.length,
      items: transportMatches.slice(0, 4),
      viewAllUrl: `/${locale}/transport`,
    });
  }

  return NextResponse.json(
    {
      query: qRaw,
      totalMatches,
      categories,
    } satisfies SearchApiResponse,
    {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    }
  );
}
