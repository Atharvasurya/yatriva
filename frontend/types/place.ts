// Yatriva — Core TypeScript data interfaces
// All fields that require external verification are nullable and paired
// with a `verified` boolean. When verified === false, the UI must show
// a PLACEHOLDER badge next to any user-facing display of that field.

export interface Coordinates {
  lat: number;
  lng: number;
}

/** All displayable names must be provided in all 3 locales */
export interface LocalisedName {
  en: string;
  hi: string;
  mr: string;
}

/** All displayable descriptions are optional but must be localised if present */
export interface LocalisedDescription {
  en?: string;
  hi?: string;
  mr?: string;
}

/**
 * Base place type — every Point of Interest inherits from this.
 * `verified` tracks whether the data has been cross-checked against
 * an authoritative source (official Kumbh docs, OSM survey, etc.).
 */
export interface Place {
  id: string;
  slug: string;
  category: PlaceCategory;
  name: LocalisedName;
  coordinates: Coordinates; // null only if genuinely unknown
  description?: LocalisedDescription;
  address?: string; // free-form address in the local language
  verified: boolean;        // false → UI must show PLACEHOLDER badge
  lastVerified?: string;    // ISO 8601 date string, e.g. "2027-01-15"
  tags?: string[];          // e.g. ["accessible", "covered", "24h"]
  cultureSlug?: string;     // Link to heritage explainer page e.g. "ramkund"
}

export type PlaceCategory =
  | 'ghat'
  | 'temple'
  | 'parking'
  | 'transport_hub'
  | 'medical'
  | 'police'
  | 'information_centre'
  | 'food'
  | 'toilet';

/**
 * Ghat — sacred river-bathing site on the Godavari
 * snanPriority: 1 = Amrit Snan ghat (most auspicious), 2 = major, 3 = secondary
 */
export interface Ghat extends Place {
  category: 'ghat';
  snanPriority: 1 | 2 | 3;
  riverName: string; // "Godavari" for most Nashik ghats
}

/**
 * Temple — Hindu shrine or mandir
 */
export interface Temple extends Place {
  category: 'temple';
  deity: string; // primary deity, in English
  timingsEn?: string | null; // e.g. "5:30 AM – 9:00 PM" — null if unverified
}

/**
 * ParkingZone — designated vehicle parking area
 */
export interface ParkingZone extends Place {
  category: 'parking';
  capacityVehicles: number | null; // null = PLACEHOLDER
  vehicleTypes: Array<'car' | 'bus' | 'two_wheeler' | 'heavy_vehicle'>;
  distanceToMainGhatKm: number | null; // null = PLACEHOLDER
  shuttleAvailable: boolean | null;    // null = unknown
}

/**
 * TransportHub — bus stand, railway station, or major junction
 */
export interface TransportHub extends Place {
  category: 'transport_hub';
  hubType: 'railway_station' | 'bus_stand' | 'auto_stand' | 'ferry_ghat';
}

/**
 * TransportRoute — a specific bus/train route
 */
export interface TransportRoute {
  id: string;
  routeNumber: string | null;  // null if unnumbered
  routeNameEn: string;
  routeNameHi: string;
  routeNameMr: string;
  origin: string;
  destination: string;
  frequencyMinutes: number | null; // null = PLACEHOLDER
  operatorEn: string;              // e.g. "MSRTC", "Indian Railways"
  verified: boolean;
  notes?: string;
}

/**
 * Emergency contact record
 */
export interface EmergencyContact {
  id: string;
  labelEn: string;
  labelHi: string;
  labelMr: string;
  phone: string | null;  // null = PLACEHOLDER — do NOT invent
  category: 'police' | 'medical' | 'fire' | 'kumbh_helpline' | 'women_helpline' | 'tourist_helpline';
  verified: boolean;
}

/**
 * AmritSnanDate — a sacred bathing date during the Kumbh Mela
 */
export interface AmritSnanDate {
  id: string;
  labelKey: string; // key into translation messages (e.g. "snan1")
  date: string;
  endDate: string | null;
  verified: boolean;
  verificationNote: string;
}
