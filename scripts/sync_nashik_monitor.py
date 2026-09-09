#!/usr/bin/env python3
"""
scripts/sync_nashik_monitor.py
Converts verified and confidence-graded civic infrastructure data from
Nashik Monitor (Kumbhathon Innovation Foundation) into Yatriva typed Place entries.

In-scope layers:
- Ghats (markers only, NTKMA surveyed plan)
- Parking zones (centroids from NTKMA plan polygons)
- Hospitals (medical facilities with HIGH/MEDIUM/LOW geocodeConfidence)
- Police stations (police chowkies & stations)
- Public toilets (sanitation points)
- Mandirs (temples)

Explicitly excluded:
- CCTV cameras (2,200+ randomly generated indicative points)
- Routes, ring road, waste collection operational logs (flagged as out-of-scope)
"""

import csv
import json
import os
import re
from typing import Dict, List, Optional, Tuple

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "nashik-all.csv")
OUTPUT_TS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "frontend", "data", "nashikMonitorPlaces.ts"
)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:60]


def get_polygon_centroid(wkt: str) -> Tuple[Optional[float], Optional[float]]:
    """Extract coordinates from WKT POLYGON and compute centroid."""
    matches = re.findall(r"([0-9\.]+)\s+([0-9\.]+)", wkt)
    if not matches:
        return None, None
    pts = [(float(lng), float(lat)) for lng, lat in matches]
    lng = sum(p[0] for p in pts) / len(pts)
    lat = sum(p[1] for p in pts) / len(pts)
    return round(lat, 6), round(lng, 6)


def run_sync():
    print(f"Reading {CSV_PATH}...")
    with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Total CSV rows: {len(rows)}")

    places: List[dict] = []
    slug_counts: Dict[str, int] = {}
    stats: Dict[str, int] = {}

    for idx, r in enumerate(rows):
        layer = r.get("layer", "").strip()
        raw_name = (r.get("name") or r.get("Name") or "").strip()
        if not raw_name:
            continue

        category: Optional[str] = None
        lat: Optional[float] = None
        lng: Optional[float] = None
        location_conf: Optional[str] = None
        is_verified: bool = False
        tags: List[str] = []
        desc: Optional[str] = None
        address: Optional[str] = (r.get("address") or r.get("Address") or "").strip() or None

        if layer == "Ghats" and r.get("role") == "marker":
            category = "ghat"
            try:
                lat = round(float(r["latitude"]), 6)
                lng = round(float(r["longitude"]), 6)
            except (ValueError, KeyError):
                continue
            location_conf = "verified"
            is_verified = True
            tags = ["ghat", "riverfront", "godavari", "snan"]
            desc = "Surveyed Godavari riverfront ghat from NTKMA Kumbh Mela Mobility Plan."

        elif layer == "Parking zones" and r.get("wkt"):
            category = "parking"
            lat, lng = get_polygon_centroid(r["wkt"])
            if not lat or not lng:
                continue
            location_conf = "verified"
            is_verified = True
            zone = r.get("zone", "outer").strip() or "outer"
            tags = ["parking", f"{zone}-parking"]
            mv_cap = r.get("Motor_Vehicle", "").strip()
            tw_cap = r.get("Two_Wheeler", "").strip()
            bus_cap = r.get("Bus_Parking", "").strip()
            details = []
            if mv_cap and mv_cap != "0":
                details.append(f"Cars: {mv_cap}")
            if tw_cap and tw_cap != "0":
                details.append(f"Two-Wheelers: {tw_cap}")
            if bus_cap and bus_cap != "0":
                details.append(f"Buses: {bus_cap}")
            desc = (
                f"{zone.capitalize()} parking zone (NTKMA Plan)"
                + (f" — Capacity: {', '.join(details)}" if details else "")
            )

        elif layer == "Hospitals" and r.get("latitude"):
            category = "medical"
            try:
                lat = round(float(r["latitude"]), 6)
                lng = round(float(r["longitude"]), 6)
            except (ValueError, KeyError):
                continue
            # Carry over upstream geocode confidence: HIGH, MEDIUM, LOW
            geocode_conf = r.get("geocodeConfidence", "").strip()
            location_conf = geocode_conf if geocode_conf in ["HIGH", "MEDIUM", "LOW"] else "MEDIUM"
            is_verified = location_conf == "HIGH"
            ftype = (r.get("facilityType") or "Hospital").strip()
            beds = r.get("registeredBeds", "").strip()
            phone = (r.get("phone") or "").strip()
            tags = ["medical", "hospital"]
            if ftype:
                tags.append(ftype.lower())
            desc_parts = [ftype]
            if beds:
                desc_parts.append(f"Registered Beds: {beds}")
            if phone:
                desc_parts.append(f"Phone: {phone}")
            desc = " | ".join(desc_parts)

        elif layer == "Police stations" and r.get("latitude"):
            category = "police"
            try:
                lat = round(float(r["latitude"]), 6)
                lng = round(float(r["longitude"]), 6)
            except (ValueError, KeyError):
                continue
            location_conf = "verified"
            is_verified = True
            pcat = (r.get("Category") or "Police Station").strip()
            phone = (r.get("Phone") or "").strip()
            tags = ["police", "security", "emergency"]
            desc = f"{pcat}" + (f" | Contact: {phone}" if phone else " | Contact: 112")

        elif layer == "Public toilets" and r.get("latitude"):
            category = "toilet"
            try:
                lat = round(float(r["latitude"]), 6)
                lng = round(float(r["longitude"]), 6)
            except (ValueError, KeyError):
                continue
            location_conf = "verified"
            is_verified = True
            ftype = (r.get("facilityType") or "Public Toilet").strip()
            tags = ["toilet", "sanitation"]
            desc = f"NMC Civic Sanitation Facility — {ftype}"

        elif layer == "Mandirs" and r.get("latitude"):
            category = "temple"
            try:
                lat = round(float(r["latitude"]), 6)
                lng = round(float(r["longitude"]), 6)
            except (ValueError, KeyError):
                continue
            # Google listing POI, unverified against physical Kumbh survey
            location_conf = None
            is_verified = False
            tags = ["temple", "mandir", "heritage"]
            rating = r.get("Rating", "").strip()
            reviews = r.get("Review Count", "").strip()
            desc = f"Rating: {rating} ★ ({reviews} reviews)" if rating else "Sacred shrine listing"

        if category and lat and lng:
            base_slug = f"nm-{category}-{slugify(raw_name)}"
            slug_counts[base_slug] = slug_counts.get(base_slug, 0) + 1
            slug = base_slug if slug_counts[base_slug] == 1 else f"{base_slug}-{slug_counts[base_slug]}"
            
            place_id = f"nm-{category}-{idx}"

            places.append({
                "id": place_id,
                "slug": slug,
                "category": category,
                "name": {
                    "en": raw_name,
                    "hi": raw_name,
                    "mr": raw_name,
                },
                "coordinates": {
                    "lat": lat,
                    "lng": lng,
                },
                "description": {
                    "en": desc,
                    "hi": desc,
                    "mr": desc,
                } if desc else None,
                "address": address,
                "verified": is_verified,
                "locationConfidence": location_conf,
                "dataSource": "nashik-monitor",
                "tags": tags,
            })
            stats[category] = stats.get(category, 0) + 1

    print(f"\nGenerated {len(places)} in-scope places:")
    for cat, count in sorted(stats.items()):
        print(f"  - {cat}: {count}")

    # Write frontend/data/nashikMonitorPlaces.json
    json_path = os.path.join(
        os.path.dirname(__file__), "..", "frontend", "data", "nashikMonitorPlaces.json"
    )
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(places, f, indent=2, ensure_ascii=False)
    print(f"\nSuccessfully wrote {json_path} ({os.path.getsize(json_path) / 1024:.1f} KB)")

    # Write lightweight typed wrapper in frontend/data/nashikMonitorPlaces.ts
    ts_wrapper = """/**
 * nashikMonitorPlaces.ts
 *
 * Civic infrastructure dataset imported from Nashik Monitor (Kumbhathon Innovation Foundation).
 * Source: github.com/tanmayk1234/nashik-monitor-v2
 * License note: Raw factual geographic data from NTKMA, NMC RTI, and Google Places.
 * Attribution: Civic infrastructure data via Nashik Monitor, an initiative by Kumbhathon Innovation Foundation.
 */

import type { Place } from '@/types/place';
import rawPlaces from './nashikMonitorPlaces.json';

export const NASHIK_MONITOR_PLACES: Place[] = rawPlaces as unknown as Place[];
"""
    with open(OUTPUT_TS_PATH, "w", encoding="utf-8") as f:
        f.write(ts_wrapper)
    print(f"Successfully wrote {OUTPUT_TS_PATH}")


if __name__ == "__main__":
    run_sync()
