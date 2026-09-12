'use client';

/**
 * /admin/lodging-review — Pending Lodging & Dining Verification Queue
 *
 * NOT linked from the main nav. Access by URL only.
 * Shows all lodging/dining entries where verificationStatus === 'pending',
 * including both in-file placeholder records and OSM-imported records.
 *
 * HOW TO APPROVE A RECORD:
 *   1. Click "View on OSM" to open the OSM entity and verify it is a real place.
 *   2. If real, open frontend/data/lodgingDining.ts, find the entry by its id,
 *      and change  verificationStatus: 'pending'  to  verificationStatus: 'verified'.
 *      Also fill in any missing fields (priceRange, address, timing, etc.).
 *   3. The entry will now appear on the public /stay-and-eat page.
 *
 * Data License (OSM records):
 *   Accommodation and dining location data © OpenStreetMap contributors (ODbL)
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  MapPin,
  ExternalLink,
  BedDouble,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Database,
  RefreshCw,
} from 'lucide-react';
import {
  PENDING_LISTINGS,
  type Listing,
  type LodgingListing,
  type RestaurantListing,
} from '@/data/lodgingDining';
import { OSM_LODGING_PENDING } from '@/data/osmLodgingPending';

// Merge in-file pending + OSM-imported pending records
const ALL_PENDING: Listing[] = [
  ...PENDING_LISTINGS,
  ...OSM_LODGING_PENDING,
];

// De-duplicate by id (in case the same OSM id somehow appears in both)
const DEDUPED_PENDING: Listing[] = Array.from(
  new Map(ALL_PENDING.map((l) => [l.id, l])).values(),
);

export default function LodgingReviewPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lodging' | 'restaurant'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'osm' | 'manual'>('all');

  const filtered = useMemo(() => {
    return DEDUPED_PENDING.filter((item) => {
      if (typeFilter !== 'all' && item.listingType !== typeFilter) return false;
      if (sourceFilter !== 'all' && item.dataSource !== sourceFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const name = item.name.en.toLowerCase();
        const id = item.id.toLowerCase();
        const osmId = (item.osmId || '').toLowerCase();
        if (!name.includes(q) && !id.includes(q) && !osmId.includes(q)) return false;
      }
      return true;
    });
  }, [search, typeFilter, sourceFilter]);

  const osmCount = DEDUPED_PENDING.filter((l) => l.dataSource === 'osm').length;
  const manualCount = DEDUPED_PENDING.filter((l) => l.dataSource === 'manual').length;
  const lodgingCount = DEDUPED_PENDING.filter((l) => l.listingType === 'lodging').length;
  const diningCount = DEDUPED_PENDING.filter((l) => l.listingType === 'restaurant').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="px-4 sm:px-6 py-5 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2D4A7A 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <Link
            href="/en"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-5 w-5 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Admin — Internal Review Queue
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                Lodging & Dining — Pending Verification
              </h1>
              <p className="text-white/75 text-xs mt-1 max-w-2xl">
                Records here are <strong>not visible</strong> on the public /stay-and-eat page.
                Verify each entry against its OSM source, then promote it to{' '}
                <code className="bg-white/15 px-1 rounded">verificationStatus: &quot;verified&quot;</code>{' '}
                in <code className="bg-white/15 px-1 rounded">lodgingDining.ts</code>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-bold">
              {[
                { label: 'Total Pending', value: DEDUPED_PENDING.length, color: 'bg-amber-400/20 text-amber-200' },
                { label: 'From OSM', value: osmCount, color: 'bg-blue-400/20 text-blue-200' },
                { label: 'Manual', value: manualCount, color: 'bg-slate-400/20 text-slate-200' },
                { label: 'Lodging', value: lodgingCount, color: 'bg-emerald-400/20 text-emerald-200' },
                { label: 'Dining', value: diningCount, color: 'bg-orange-400/20 text-orange-200' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-xl px-3 py-2 text-center`}>
                  <div className="text-2xl font-black leading-none">{value}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── How to Use ─────────────────────────────────────────────────────── */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 space-y-1">
            <p className="font-bold">How to verify a record:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
              <li>Click <strong>View on OSM</strong> to open the entity on openstreetmap.org.</li>
              <li>Confirm it is a real, operating hotel/restaurant (not demolished or renamed).</li>
              <li>In <code className="bg-blue-100 px-1 rounded">frontend/data/lodgingDining.ts</code>, find the entry by id and change <code className="bg-blue-100 px-1 rounded">verificationStatus: &apos;pending&apos;</code> → <code className="bg-blue-100 px-1 rounded">&apos;verified&apos;</code>.</li>
              <li>Fill in any missing fields (address, phone, priceRange, timing) using the Google Sheet schema.</li>
              <li>Run <code className="bg-blue-100 px-1 rounded">npm run build</code> and push — the listing will appear publicly.</li>
            </ol>
          </div>
        </div>

        {/* ── OSM Attribution ────────────────────────────────────────────────── */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-[11px] text-slate-600 flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>
            OSM-imported records: Accommodation and dining location data{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              © OpenStreetMap contributors
            </a>{' '}
            (ODbL 1.0).{' '}
            Re-run <code className="bg-slate-200 px-1 rounded">python scripts/import_osm_lodging.py</code> to refresh.
          </span>
        </div>

        {/* ── Filters ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or OSM ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {(['all', 'lodging', 'restaurant'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-slate-800 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t === 'all' ? 'All Types' : t === 'lodging' ? 'Lodging' : 'Dining'}
              </button>
            ))}
            <div className="w-px bg-slate-200 mx-1" />
            {(['all', 'osm', 'manual'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSourceFilter(s)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  sourceFilter === s
                    ? 'bg-blue-700 text-white border-blue-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? 'All Sources' : s === 'osm' ? 'OSM Import' : 'Manual'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ──────────────────────────────────────────────────── */}
        <p className="text-xs text-slate-500 px-1 font-semibold">
          Showing {filtered.length} of {DEDUPED_PENDING.length} pending records
        </p>

        {/* ── Records Table ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
            <Search className="h-8 w-8 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No records match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const name = item.name.en;
              const isLodging = item.listingType === 'lodging';
              const osmUrl = item.osmId
                ? `https://www.openstreetmap.org/${item.osmId}`
                : null;
              const mapsUrl = `https://maps.google.com/?q=${item.coordinates.lat},${item.coordinates.lng}`;
              const phone = (item as LodgingListing).phone;
              const website = (item as LodgingListing).website;
              const address = (item as LodgingListing).address;
              const cuisineType = isLodging ? null : (item as RestaurantListing).cuisineType;
              const accomType = isLodging ? (item as LodgingListing).accommodationType : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            isLodging
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {isLodging ? (
                            <BedDouble className="h-2.5 w-2.5" />
                          ) : (
                            <Utensils className="h-2.5 w-2.5" />
                          )}
                          {isLodging ? accomType?.replace('_', ' ') : 'Restaurant'}
                        </span>
                        {/* Source badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            item.dataSource === 'osm'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.dataSource === 'osm' ? 'OSM' : 'Manual'}
                        </span>
                        {/* Cuisine */}
                        {cuisineType && (
                          <span className="text-[10px] text-slate-500">
                            {cuisineType}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h2 className="text-base font-bold text-slate-900 leading-snug">{name}</h2>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          <span className="font-semibold text-slate-700">ID:</span>{' '}
                          <code className="bg-slate-100 px-1 rounded text-[11px]">{item.id}</code>
                        </span>
                        {item.osmId && (
                          <span>
                            <span className="font-semibold text-slate-700">OSM:</span>{' '}
                            <code className="bg-slate-100 px-1 rounded text-[11px]">{item.osmId}</code>
                          </span>
                        )}
                        <span>
                          <span className="font-semibold text-slate-700">Coords:</span>{' '}
                          {item.coordinates.lat.toFixed(5)}, {item.coordinates.lng.toFixed(5)}
                        </span>
                        {address && (
                          <span>
                            <span className="font-semibold text-slate-700">Address:</span> {address}
                          </span>
                        )}
                        {phone && (
                          <span>
                            <span className="font-semibold text-slate-700">Phone:</span> {phone}
                          </span>
                        )}
                        {website && (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            Website <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Description preview */}
                      <p className="text-xs text-slate-500 italic line-clamp-1">
                        {item.description.en}
                      </p>
                    </div>

                    {/* Right: action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {osmUrl && (
                        <a
                          href={osmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 transition-all"
                          title="Verify on OpenStreetMap"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View on OSM
                        </a>
                      )}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-800 transition-all"
                        title="Verify location on Google Maps"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Maps
                      </a>
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 cursor-default"
                        title="To approve: edit verificationStatus in lodgingDining.ts"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve in .ts
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Re-import hint ─────────────────────────────────────────────────── */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex items-start gap-3">
          <RefreshCw className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold">Dining records not showing?</p>
            <p>
              The Overpass API timed out for the dining queries during the first import.
              Re-run the script to fetch restaurant data:
            </p>
            <code className="block bg-slate-200 rounded px-3 py-2 font-mono text-[11px] mt-1">
              python scripts/import_osm_lodging.py
            </code>
            <p className="text-slate-500">
              Wait a few minutes between runs to respect the Overpass rate limit.
            </p>
          </div>
        </div>

        {/* ── Footer attribution ─────────────────────────────────────────────── */}
        <div className="text-center text-[11px] text-slate-400 py-4 border-t border-slate-200">
          <p>
            OSM data: Accommodation and dining location data ©{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenStreetMap contributors
            </a>{' '}
            (ODbL 1.0) &nbsp;•&nbsp; This page is not publicly linked.
          </p>
        </div>
      </div>
    </div>
  );
}
