# Lodging & Dining — Google Sheet Schema

## Purpose

This document defines the column layout for the **"Lodging & Dining"** tab in the
Kumbh Places Master Google Sheet. It exists so that listings imported from OpenStreetMap
(or found manually) can be enriched with real details — prices, timings, contact info —
without code changes, following the same workflow used for the existing `places` data.

---

## Tab Name

> **`Lodging & Dining`**
> (add as a new tab to the existing Kumbh Places Master sheet)

---

## Column Schema

| Column | Field | Type | Required | Notes |
|--------|-------|------|----------|-------|
| A | `id` | Text | ✅ | Matches the `id` in `lodgingDining.ts` (e.g. `osm-lodging-nashik-0`) |
| B | `osm_id` | Text | — | OSM node/way ID (e.g. `node/123456789`). Leave blank for non-OSM entries. |
| C | `listing_type` | Enum | ✅ | `lodging` or `restaurant` |
| D | `name_en` | Text | ✅ | Name in English |
| E | `name_hi` | Text | — | Name in Hindi. Leave blank if unknown — app falls back to English. |
| F | `name_mr` | Text | — | Name in Marathi. Leave blank if unknown. |
| G | `accommodation_type` | Enum | ✅ (lodging only) | `hotel`, `guesthouse`, or `tent_resort` |
| H | `cuisine_type` | Text | ✅ (restaurant only) | e.g. `Maharashtrian`, `South Indian`, `Fast Food`, `Dhaba` |
| I | `veg_only` | Boolean | ✅ (restaurant only) | `TRUE` or `FALSE` |
| J | `price_range` | Enum | ✅ | `budget` (< ₹500/head), `mid`, or `premium` |
| K | `price_amount` | Text | — | e.g. `₹800` (per night / per person). Leave blank if unknown. |
| L | `price_subtext_en` | Text | — | e.g. `per night, includes taxes`. Leave blank if unknown. |
| M | `address` | Text | — | Street address in English |
| N | `phone` | Text | — | Phone number. **Never invent.** Leave blank if not publicly available. |
| O | `website` | URL | — | Official website URL. Leave blank if none. |
| P | `timing_en` | Text | — | Opening hours in English, e.g. `6:00 AM – 11:00 PM`. Leave blank if unknown. |
| Q | `distance_en` | Text | — | e.g. `1.2 km from Ramkund Ghat`. Leave blank if unknown. |
| R | `lat` | Number | ✅ | Latitude (from OSM or manual survey). 6 decimal places. |
| S | `lng` | Number | ✅ | Longitude. 6 decimal places. |
| T | `tags_en` | Text | — | Comma-separated tags, e.g. `Air Conditioned, Parking, Lift`. |
| U | `checklist_en` | Text | — | Pipe-separated amenities for the card checklist, e.g. `Breakfast Included\|Parking Available\|24h Front Desk` |
| V | `data_source` | Enum | ✅ | `osm` (auto-filled by import script) or `manual` |
| W | `verification_status` | Enum | ✅ | `pending`, `verified`, or `rejected` |
| X | `verified_by` | Text | — | Name/initials of the person who verified this entry |
| Y | `verified_date` | Date | — | Date of verification (YYYY-MM-DD) |
| Z | `notes` | Text | — | Any notes for the volunteer/reviewer |

---

## Workflow

### Step 1: Auto-fill from OSM import

After running `python scripts/import_osm_lodging.py`, copy the generated
`frontend/data/osmLodgingPending.json` records into the Sheet using the
import script's output. Columns A, B, C, D, R, S, V, W will be pre-filled.

### Step 2: Manual enrichment

For each row where `verification_status = pending`:
1. Open the OSM link (`https://osm.org/<osm_id>`) to verify the place exists.
2. Search for the hotel/restaurant on Google Maps / JustDial / Tripadvisor.
3. Fill in columns K–T with publicly available information.
4. Set column W (`verification_status`) to `verified` once done.
5. Sign column X with your initials and date in column Y.

### Step 3: Sync back to code

Once a row is marked `verified` in the Sheet:
1. Open `frontend/data/lodgingDining.ts`.
2. Find the entry by its `id` (column A).
3. Update the entry with the enriched values from the Sheet.
4. Change `verificationStatus: 'pending'` → `verificationStatus: 'verified'`.
5. Run `npm run build` locally to confirm no TypeScript errors.
6. Commit and push — the listing will appear on the public `/stay-and-eat` page.

---

## Hard Rules

- **Never invent phone numbers, prices, or ratings.** If a field is unknown, leave it blank.
- **Never use Google Places API data** — see Phase 7.2 context for why.
- **Do not copy-paste ratings or reviews** from other platforms into the Sheet.
  Ratings fields (`rating`, `reviewsCount`, `ratingScore`) in the TypeScript code
  are legacy fields kept for schema compatibility — they are not displayed.
- **ODbL Attribution**: Any OSM-sourced data displayed publicly must include
  `© OpenStreetMap contributors (ODbL)`. This attribution is already present
  in the stay-and-eat page footer.

---

## n8n Sync (Future)

When wiring this Sheet to the existing n8n workflow:
- Trigger: Google Sheets "Row Updated" node
- Filter: `verification_status = verified`
- Action: Update `osmLodgingPending.json` or directly write to `lodgingDining.ts`
  via GitHub API commit
- Same pattern as the existing Kumbh Places n8n sync

---

*Schema version: Phase 7.2 — last updated 2026-09-12*
