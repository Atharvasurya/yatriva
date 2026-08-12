-- =============================================================================
-- Yatriva — Nashik Kumbh Mela 2027
-- PostgreSQL schema (Phase 1)
-- Requires: PostgreSQL 14+ with PostGIS extension
-- =============================================================================

-- Enable PostGIS for spatial queries (Phase 2+)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM types
-- =============================================================================

CREATE TYPE place_category AS ENUM (
    'ghat',
    'temple',
    'parking',
    'transport_hub',
    'medical',
    'police',
    'information_centre',
    'food',
    'toilet'
);

CREATE TYPE vehicle_type AS ENUM ('car', 'bus', 'two_wheeler', 'heavy_vehicle');

-- =============================================================================
-- places — all Points of Interest
-- =============================================================================

CREATE TABLE places (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            TEXT NOT NULL UNIQUE,
    category        place_category NOT NULL,

    -- Localised names (required in all 3 locales)
    name_en         TEXT NOT NULL,
    name_hi         TEXT NOT NULL,
    name_mr         TEXT NOT NULL,

    -- Localised descriptions (optional)
    description_en  TEXT,
    description_hi  TEXT,
    description_mr  TEXT,

    -- Spatial: stored as PostGIS point (SRID 4326 = WGS84)
    -- Use ST_MakePoint(lng, lat) to insert
    location        GEOGRAPHY(POINT, 4326),

    -- Fallback for simple lat/lng access without PostGIS
    lat             NUMERIC(9, 6),
    lng             NUMERIC(9, 6),

    -- Free-form address in local language
    address         TEXT,

    -- Data quality tracking
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    last_verified   DATE,

    -- JSON array of tag strings e.g. ["accessible", "24h"]
    tags            JSONB DEFAULT '[]'::JSONB,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for proximity queries (Phase 2)
CREATE INDEX places_location_idx ON places USING GIST (location);
CREATE INDEX places_category_idx ON places (category);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- ghat_details — extends places for ghats
-- =============================================================================

CREATE TABLE ghat_details (
    place_id        UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    snan_priority   SMALLINT CHECK (snan_priority IN (1, 2, 3)),
    river_name      TEXT NOT NULL DEFAULT 'Godavari'
);

-- =============================================================================
-- temple_details — extends places for temples
-- =============================================================================

CREATE TABLE temple_details (
    place_id        UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    deity           TEXT NOT NULL,
    timings_en      TEXT           -- e.g. "5:30 AM – 9:00 PM"; NULL = unverified
);

-- =============================================================================
-- parking_details — extends places for parking zones
-- =============================================================================

CREATE TABLE parking_details (
    place_id                UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    capacity_vehicles       INTEGER,               -- NULL = PLACEHOLDER
    vehicle_types           vehicle_type[] NOT NULL DEFAULT '{}',
    distance_to_main_ghat_km NUMERIC(5, 2),        -- NULL = PLACEHOLDER
    shuttle_available       BOOLEAN                -- NULL = unknown
);

-- =============================================================================
-- transport_routes
-- =============================================================================

CREATE TABLE transport_routes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number    TEXT,                     -- NULL if unnumbered
    route_name_en   TEXT NOT NULL,
    route_name_hi   TEXT NOT NULL,
    route_name_mr   TEXT NOT NULL,
    origin          TEXT NOT NULL,
    destination     TEXT NOT NULL,
    frequency_minutes INTEGER,               -- NULL = PLACEHOLDER
    operator_en     TEXT NOT NULL,           -- e.g. "MSRTC"
    origin_hub_id   UUID REFERENCES places(id) ON DELETE SET NULL,
    destination_hub_id UUID REFERENCES places(id) ON DELETE SET NULL,
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER transport_routes_updated_at
    BEFORE UPDATE ON transport_routes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- content_pages — CMS-style pages (About, Culture, FAQs, etc.)
-- =============================================================================

CREATE TABLE content_pages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            TEXT NOT NULL UNIQUE,

    -- Localised title + body (Markdown)
    title_en        TEXT NOT NULL,
    title_hi        TEXT NOT NULL,
    title_mr        TEXT NOT NULL,
    body_en         TEXT,
    body_hi         TEXT,
    body_mr         TEXT,

    published       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER content_pages_updated_at
    BEFORE UPDATE ON content_pages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- emergency_contacts
-- =============================================================================

CREATE TABLE emergency_contacts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_en    TEXT NOT NULL,
    label_hi    TEXT NOT NULL,
    label_mr    TEXT NOT NULL,
    phone       TEXT,            -- NULL = PLACEHOLDER — never invent phone numbers
    category    TEXT NOT NULL,   -- 'police' | 'medical' | 'fire' | 'kumbh_helpline' | etc.
    verified    BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order  SMALLINT NOT NULL DEFAULT 0
);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Convenience view: places with all detail tables joined
CREATE OR REPLACE VIEW places_with_details AS
SELECT
    p.*,
    g.snan_priority,
    g.river_name,
    t.deity,
    t.timings_en,
    pk.capacity_vehicles,
    pk.vehicle_types,
    pk.distance_to_main_ghat_km,
    pk.shuttle_available
FROM places p
LEFT JOIN ghat_details    g  ON g.place_id  = p.id
LEFT JOIN temple_details  t  ON t.place_id  = p.id
LEFT JOIN parking_details pk ON pk.place_id = p.id;
