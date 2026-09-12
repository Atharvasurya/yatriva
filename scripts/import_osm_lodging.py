#!/usr/bin/env python3
"""
scripts/import_osm_lodging.py
─────────────────────────────────────────────────────────────────────────────
Queries the Overpass API (free, no API key, ODbL-licensed data) for lodging
and dining establishments in Nashik city and Trimbakeshwar town, and writes
the results to the Yatriva frontend data directory as a "pending verification"
snapshot.

Data License: OpenStreetMap contributors (ODbL 1.0)
Attribution required:  "Accommodation and dining location data ©
                         OpenStreetMap contributors (ODbL)"

Overpass API endpoint: https://overpass-api.de/api/interpreter
  - No API key required
  - Rate-limit: 1 heavy query per ~60 seconds is polite; we use 2 queries.
  - Caching policy: ODbL has NO restrictive caching prohibition —
    unlike Google Maps API Terms, OSM data can be legally stored locally.

Output files
  frontend/data/osmLodgingPending.json  — raw records, indent=2
  frontend/data/osmLodgingPending.ts    — typed TS wrapper (import in TS code)

Usage
  python scripts/import_osm_lodging.py [--dry-run]

  --dry-run   Print the Overpass queries but do not make HTTP requests.
              Use this to inspect the queries before running live.
"""

import argparse
import json
import os
import sys
import time
from typing import Any, Dict, List, Optional, Tuple

# ─── Try to import requests; guide the user if missing ──────────────────────
try:
    import requests
except ImportError:
    print("ERROR: 'requests' is not installed.")
    print("  Run:  pip install requests")
    sys.exit(1)


# ─── Configuration ───────────────────────────────────────────────────────────

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
TIMEOUT_S = 90          # seconds — Overpass can be slow for large areas

# Nashik urban area bounding box  (south, west, north, east)
NASHIK_BBOX = (19.92, 73.70, 20.10, 73.90)

# Trimbakeshwar town bounding box
TRIMBAK_BBOX = (19.91, 73.49, 19.95, 73.54)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.join(SCRIPT_DIR, "..")
OUTPUT_JSON = os.path.join(REPO_ROOT, "frontend", "data", "osmLodgingPending.json")
OUTPUT_TS   = os.path.join(REPO_ROOT, "frontend", "data", "osmLodgingPending.ts")

# OSM tags we want for lodging
LODGING_TAGS = [
    ("tourism", "hotel"),
    ("tourism", "guest_house"),
    ("tourism", "hostel"),
    ("tourism", "motel"),
    ("tourism", "apartment"),
]

# OSM tags we want for dining
DINING_TAGS = [
    ("amenity", "restaurant"),
    ("amenity", "cafe"),
    ("amenity", "fast_food"),
    ("amenity", "dhaba"),          # common Indian tag
    ("amenity", "food_court"),
]

# Map OSM tags → our schema accommodationType / cuisineType
LODGING_ACCOM_MAP = {
    "hotel":     "hotel",
    "guest_house": "guesthouse",
    "hostel":    "guesthouse",
    "motel":     "hotel",
    "apartment": "guesthouse",
}


# ─── Overpass query builder ───────────────────────────────────────────────────

def build_overpass_query(bbox: Tuple[float, float, float, float], tags: List[Tuple[str, str]]) -> str:
    """Build an Overpass QL query for nodes and ways with given tags in bbox."""
    s, w, n, e = bbox
    bbox_str = f"{s},{w},{n},{e}"
    lines = ["[out:json][timeout:60];", "("]
    for key, val in tags:
        lines.append(f'  node["{key}"="{val}"]({bbox_str});')
        lines.append(f'  way["{key}"="{val}"]({bbox_str});')
    lines.append(");")
    lines.append("out center tags;")
    return "\n".join(lines)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def get_coord(element: Dict[str, Any]) -> Optional[Tuple[float, float]]:
    """Return (lat, lng) for a node or way-with-center."""
    if element["type"] == "node":
        return round(element["lat"], 6), round(element["lon"], 6)
    center = element.get("center")
    if center:
        return round(center["lat"], 6), round(center["lon"], 6)
    return None


def safe_tag(tags: Dict[str, str], *keys: str, default: str = "") -> str:
    for k in keys:
        v = tags.get(k, "").strip()
        if v:
            return v
    return default


def build_distance_string(lat: float, lng: float, area: str) -> str:
    """Generate a human-readable distance placeholder (no live calculation)."""
    if area == "trimbak":
        return "Near Trimbakeshwar town centre"
    return "Nashik city (exact distance TBC)"


def osm_element_to_listing(
    element: Dict[str, Any],
    listing_type: str,          # 'lodging' | 'restaurant'
    area: str,                  # 'nashik' | 'trimbak'
    idx: int,
) -> Optional[Dict[str, Any]]:
    """Convert a single OSM element to our Listing schema (pending)."""
    tags = element.get("tags", {})
    coord = get_coord(element)
    if not coord:
        return None

    lat, lng = coord
    osm_id = f"{element['type']}/{element['id']}"

    # Name — OSM often has name:hi / name:mr too
    name_en = safe_tag(tags, "name:en", "name", default="").strip()
    name_hi = safe_tag(tags, "name:hi", "name:en", "name", default=name_en).strip()
    name_mr = safe_tag(tags, "name:mr", "name:en", "name", default=name_en).strip()

    if not name_en:
        return None     # skip unnamed entries

    description_raw = safe_tag(tags, "description")

    phone    = safe_tag(tags, "phone", "contact:phone")
    website  = safe_tag(tags, "website", "contact:website")
    addr     = " ".join(filter(None, [
        safe_tag(tags, "addr:housenumber"),
        safe_tag(tags, "addr:street"),
        safe_tag(tags, "addr:city"),
    ])).strip()
    hours    = safe_tag(tags, "opening_hours")
    cuisine  = safe_tag(tags, "cuisine")
    stars    = safe_tag(tags, "stars")           # hotel star rating in OSM — NOT used for display

    # Listing-type-specific fields
    if listing_type == "lodging":
        osm_tourism = safe_tag(tags, "tourism")
        accom_type  = LODGING_ACCOM_MAP.get(osm_tourism, "hotel")
        record: Dict[str, Any] = {
            "id":               f"osm-lodging-{area}-{idx}",
            "osmId":            osm_id,
            "listingType":      "lodging",
            "verificationStatus": "pending",
            "dataSource":       "osm",
            "name":             {"en": name_en, "hi": name_hi, "mr": name_mr},
            "description":      {
                "en": description_raw or "OSM-imported lodging — details pending manual verification.",
                "hi": description_raw or "OSM से आयातित — मैन्युअल सत्यापन लंबित।",
                "mr": description_raw or "OSM मधून आयात केले — मॅन्युअल सत्यापन प्रलंबित.",
            },
            "coordinates":      {"lat": lat, "lng": lng},
            "priceRange":       "mid",          # unknown — needs manual fill
            "accommodationType": accom_type,
            "distance":         {
                "en": build_distance_string(lat, lng, area),
                "hi": build_distance_string(lat, lng, area),
                "mr": build_distance_string(lat, lng, area),
            },
            "timing":           {
                "en": hours or "Check directly — hours not in OSM",
                "hi": hours or "सीधे जाँचें — OSM में समय नहीं",
                "mr": hours or "थेट तपासा — OSM मध्ये वेळ नाही",
            },
            # Legacy fields — kept for schema compatibility; NOT displayed post-Phase 7.1
            "rating":           0,
            "reviewsCount":     0,
            "priceDisplay":     {"en": "₹TBC", "hi": "₹अज्ञात", "mr": "₹अज्ञात"},
            "priceAmount":      "₹TBC",
            "priceSubtext":     {
                "en": "Price not in OSM — verify manually",
                "hi": "मूल्य OSM में नहीं — मैन्युअल सत्यापन करें",
                "mr": "OSM मध्ये किंमत नाही — मॅन्युअल सत्यापन करा",
            },
            "tags":             [],
            "imageUrl":         "/images/placeholder_hotel.jpg",
            "thumbnails":       [],
            "ratingScore":      0,
            "ratingLabel":      {"en": "", "hi": "", "mr": ""},
            "starCount":        0,
            "checklist":        [],
            # Enrichment fields for Sheet / manual fill
            "phone":            phone or None,
            "website":          website or None,
            "address":          addr or None,
            "osmStars":         stars or None,   # stored for reference only
        }
    else:  # restaurant
        record = {
            "id":               f"osm-restaurant-{area}-{idx}",
            "osmId":            osm_id,
            "listingType":      "restaurant",
            "verificationStatus": "pending",
            "dataSource":       "osm",
            "name":             {"en": name_en, "hi": name_hi, "mr": name_mr},
            "description":      {
                "en": description_raw or "OSM-imported dining venue — details pending manual verification.",
                "hi": description_raw or "OSM से आयातित — मैन्युअल सत्यापन लंबित।",
                "mr": description_raw or "OSM मधून आयात केले — मॅन्युअल सत्यापन प्रलंबित.",
            },
            "coordinates":      {"lat": lat, "lng": lng},
            "priceRange":       "budget",        # unknown — needs manual fill
            "vegOnly":          "vegetarian" in cuisine.lower() if cuisine else False,
            "cuisineType":      cuisine.replace(";", ", ") if cuisine else "Indian",
            "distance":         {
                "en": build_distance_string(lat, lng, area),
                "hi": build_distance_string(lat, lng, area),
                "mr": build_distance_string(lat, lng, area),
            },
            "timing":           {
                "en": hours or "Check directly — hours not in OSM",
                "hi": hours or "सीधे जाँचें — OSM में समय नहीं",
                "mr": hours or "थेट तपासा — OSM मध्ये वेळ नाही",
            },
            # Legacy fields
            "rating":           0,
            "reviewsCount":     0,
            "priceDisplay":     {"en": "₹TBC", "hi": "₹अज्ञात", "mr": "₹अज्ञात"},
            "priceAmount":      "₹TBC",
            "priceSubtext":     {
                "en": "Price not in OSM — verify manually",
                "hi": "मूल्य OSM में नहीं — मैन्युअल सत्यापन करें",
                "mr": "OSM मध्ये किंमत नाही — मॅन्युअल सत्यापन करा",
            },
            "tags":             [],
            "imageUrl":         "/images/placeholder_restaurant.jpg",
            "thumbnails":       [],
            "ratingScore":      0,
            "ratingLabel":      {"en": "", "hi": "", "mr": ""},
            "starCount":        0,
            "checklist":        [],
            # Enrichment
            "phone":            phone or None,
            "website":          website or None,
            "address":          addr or None,
        }

    return record


# ─── Overpass fetch ───────────────────────────────────────────────────────────

def fetch_overpass(query: str, label: str, dry_run: bool) -> List[Dict[str, Any]]:
    if dry_run:
        print(f"\n[DRY RUN] Would POST query for: {label}")
        print(query)
        return []

    print(f"  -> Querying Overpass for: {label} ...", end="", flush=True)
    try:
        resp = requests.post(
            OVERPASS_URL,
            data={"data": query},
            timeout=TIMEOUT_S,
            headers={"User-Agent": "Yatriva/1.0 (yatriva.vercel.app; Nashik Kumbh Mela pilgrim guide; contact: github.com/Atharvasurya/yatriva)"},
        )
        resp.raise_for_status()
        data = resp.json()
        elements = data.get("elements", [])
        print(f" {len(elements)} elements")
        return elements
    except requests.exceptions.Timeout:
        print(f" TIMEOUT after {TIMEOUT_S}s — Overpass is busy; try again in a few minutes")
        return []
    except requests.exceptions.RequestException as e:
        print(f" ERROR: {e}")
        return []


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Import OSM lodging/dining data for Yatriva")
    parser.add_argument("--dry-run", action="store_true", help="Print queries only, no HTTP requests")
    args = parser.parse_args()

    print("=" * 65)
    print("  Yatriva — OSM Lodging & Dining Import (Overpass API)")
    print("  License: OpenStreetMap contributors (ODbL 1.0)")
    print("=" * 65)

    if args.dry_run:
        print("\n⚠  DRY RUN mode — no HTTP requests will be made\n")

    all_records: List[Dict[str, Any]] = []
    stats: Dict[str, int] = {}

    queries = [
        ("Nashik lodging",      NASHIK_BBOX,  LODGING_TAGS,  "lodging",    "nashik"),
        ("Nashik dining",       NASHIK_BBOX,  DINING_TAGS,   "restaurant", "nashik"),
        ("Trimbakeshwar lodging", TRIMBAK_BBOX, LODGING_TAGS, "lodging",   "trimbak"),
        ("Trimbakeshwar dining",  TRIMBAK_BBOX, DINING_TAGS,  "restaurant","trimbak"),
    ]

    for label, bbox, tags, ltype, area in queries:
        query = build_overpass_query(bbox, tags)
        elements = fetch_overpass(query, label, args.dry_run)

        # De-duplicate: OSM sometimes returns the same named place as node+way
        seen_names: set = set()
        local_idx = 0
        for el in elements:
            record = osm_element_to_listing(el, ltype, area, local_idx)
            if record is None:
                continue
            name_key = record["name"]["en"].lower().strip()
            if name_key in seen_names:
                continue
            seen_names.add(name_key)
            all_records.append(record)
            local_idx += 1

        key = f"{area}-{ltype}"
        stats[key] = local_idx

        if not args.dry_run and len(queries) > 1:
            time.sleep(3)  # polite rate-limit between queries

    # ── Summary ──────────────────────────────────────────────────────────────
    print()
    print("─" * 65)
    print("  IMPORT SUMMARY")
    print("─" * 65)
    print(f"  {'Area + Type':<30} {'Count':>6}")
    print(f"  {'─'*30} {'─'*6}")
    total = 0
    for key, count in sorted(stats.items()):
        area, ltype = key.split("-", 1)
        label = f"{area.capitalize()} {ltype}"
        print(f"  {label:<30} {count:>6}")
        total += count
    print(f"  {'─'*30} {'─'*6}")
    print(f"  {'TOTAL':<30} {total:>6}")
    print(f"\n  All records set to verificationStatus: 'pending'")
    print(f"  None will appear on the public /stay-and-eat page.")
    print("─" * 65)

    if args.dry_run:
        print("\n[DRY RUN] No files written.")
        return

    if not all_records:
        print("\n⚠  No records imported (possibly Overpass timeout or empty result).")
        print("  Try running again in a few minutes, or check https://overpass-api.de/api/status")
        return

    # ── Write JSON ────────────────────────────────────────────────────────────
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_records, f, indent=2, ensure_ascii=False)
    size_kb = os.path.getsize(OUTPUT_JSON) / 1024
    print(f"\n[OK] Wrote {OUTPUT_JSON} ({size_kb:.1f} KB, {len(all_records)} records)")

    # ── Write typed TS wrapper ────────────────────────────────────────────────
    ts_content = """/**
 * osmLodgingPending.ts — AUTO-GENERATED by scripts/import_osm_lodging.py
 *
 * DO NOT EDIT THIS FILE MANUALLY.
 * Re-generate with:  python scripts/import_osm_lodging.py
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Data License: OpenStreetMap contributors (ODbL 1.0)
 * Attribution:  "Accommodation and dining location data ©
 *                OpenStreetMap contributors (ODbL)"
 * Source:       https://www.openstreetmap.org
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ALL records in this file have verificationStatus === 'pending'.
 * They are NOT shown on the public /stay-and-eat page.
 * Review them at /admin/lodging-review and manually promote to 'verified'
 * in lodgingDining.ts after ground-truthing each entry.
 */

import type { Listing } from './lodgingDining';
import rawOsmData from './osmLodgingPending.json';

/**
 * OSM_LODGING_PENDING — all imported OSM records awaiting manual verification.
 * Safe to import in admin/review contexts only.
 */
export const OSM_LODGING_PENDING: Listing[] = rawOsmData as unknown as Listing[];
"""
    with open(OUTPUT_TS, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"[OK] Wrote {OUTPUT_TS}")

    # ── Remind user of next steps ─────────────────────────────────────────────
    print()
    print("Next steps:")
    print("  1. Check the admin review queue: /en/admin/lodging-review")
    print("  2. For each record, open the OSM link to verify it's a real place")
    print("  3. If valid, copy the entry to lodgingDining.ts and set")
    print('     verificationStatus: "verified" — it will then appear publicly.')
    print()


if __name__ == "__main__":
    main()
