/**
 * parkingImages.ts
 *
 * Real authentic photographic images sourced for major parking spots,
 * transport terminals, and staging grounds across Nashik & Trimbakeshwar.
 * If a spot does not have an authentic photograph available, returns null
 * to fallback to the dynamic vector clipart.
 */

export const PARKING_REAL_IMAGES: Record<string, string> = {
  // ── 1. Major Hand-Curated Kumbh Highway Terminals ──
  'parking-vilholi': '/images/parking/vilholi.jpg',
  'parking-adgaon': '/images/parking/adgaon.jpg',
  'parking-nilgiri': '/images/parking/nilgiri.jpg',
  'parking-dugaon': '/images/parking/dugaon.jpg',

  // ── 2. Real Identified Civic & Transport Landmarks ──
  'nm-parking-70': '/images/parking/mahamarg.jpg',            // Mahamarg Bus Stand (MSRTC)
  'nm-parking-49': '/images/parking/sambhaji_stadium.jpg',   // Sambhaji Stadium Ground
  'nm-parking-50': '/images/parking/apmc_market.jpg',        // APMC Market Yard, Panchavati
  'nm-parking-91': '/images/parking/apmc_market.jpg',        // Tomato Market Yard parking
  'nm-parking-41': '/images/parking/msrtc_kumbh_fleet.jpg',  // Panjarpol Outer Parking (MSRTC fleet)
  'nm-parking-42': '/images/parking/msrtc_kumbh_fleet.jpg',  // Panjarpol Outer Parking 2
  'nm-parking-43': '/images/parking/msrtc_kumbh_fleet.jpg',  // Thakkar Ground outer parking
  'nm-parking-46': '/images/parking/adgaon.jpg',             // Identified Adgaon Parking
  'nm-parking-87': '/images/parking/adgaon.jpg',             // Parking opposite Tata showroom (Adgaon)
  'nm-parking-88': '/images/parking/adgaon.jpg',             // Parking behind Tata showroom (Adgaon)
  'nm-parking-75': '/images/parking/vilholi.jpg',            // Rajur Bahula (Mumbai Highway)
  'nm-parking-76': '/images/parking/vilholi.jpg',            // Parking opposite Rajur Bahula
  'nm-parking-80': '/images/parking/trimbak_msrtc_bus.jpg',  // Khambale Trimbak bus staging 1
  'nm-parking-81': '/images/parking/trimbak_msrtc_bus.jpg',  // Khambale Trimbak bus staging 1
  'nm-parking-82': '/images/parking/trimbak_msrtc_bus.jpg',  // Khambale Trimbak bus staging 1
  'nm-parking-83': '/images/parking/trimbak_msrtc_bus.jpg',  // Khambale Trimbak bus staging 2
  'nm-parking-77': '/images/parking/trimbak_private.jpg',    // Moh Chincholi additional (Trimbak Rd)
  'nm-parking-78': '/images/parking/trimbak_private.jpg',    // Moh Chincholi private vehicles
  'nm-parking-89': '/images/parking/trimbak_private.jpg',    // Moh Chincholi parking revised
  'nm-parking-61': '/images/parking/panchavati_private.jpg', // Press Quarters, Nehru Nagar
  'nm-parking-62': '/images/parking/panchavati_private.jpg', // Press Quarters, Nehru Nagar Part 2
  'nm-parking-64': '/images/parking/dwarka_mall.jpg',        // Mira Empire / Dwarka Circle
  'nm-parking-60': '/images/parking/dwarka_mall.jpg',        // NMC Inner Parking - Near Dive Bungalow
  'nm-parking-68': '/images/parking/kumbh_arrangement.jpg',  // Gandhinagar Press Land
  'nm-parking-69': '/images/parking/kumbh_arrangement.jpg',  // Idgah Maidan Ground
};

/**
 * Returns the real photo URL for a parking zone if available, otherwise null.
 */
export function getParkingRealImageUrl(zoneId: string, customImage?: string): string | null {
  if (customImage) return customImage;
  return PARKING_REAL_IMAGES[zoneId] || null;
}
