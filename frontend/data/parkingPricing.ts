/**
 * parkingPricing.ts
 *
 * Real parking tariffs and pricing structure for Nashik & Trimbakeshwar:
 * 1. Official Free Outer Satellite Buffers (NTKMA / NMC Kumbh Mela Free Transit Buffer)
 * 2. Official NMC Pay-and-Park Scheme (Approved rates: ₹10/2h 2W, ₹20/2h Car)
 * 3. Trimbakeshwar Nagar Parishad & Temple Trust Pay Parking (₹20 2W, ₹50 Car)
 * 4. Private / Commercial authorized lots (₹40-₹50/day Car, ₹20/day 2W)
 */

export interface ParkingPricingInfo {
  isPaid: boolean;
  badgeEn: string;
  badgeHi: string;
  badgeMr: string;
  rateEn: string;
  rateHi: string;
  rateMr: string;
  carRate?: string;
  twoWheelerRate?: string;
  busRate?: string;
  operatorTypeEn: string;
  operatorTypeHi: string;
  operatorTypeMr: string;
}

export const PAID_PARKING_CONFIG: Record<string, ParkingPricingInfo> = {
  // ── Trimbakeshwar Temple & Town Pay Parking ──
  'nm-temple-5174': {
    isPaid: true,
    badgeEn: 'Paid • ₹50/day',
    badgeHi: 'सशुल्क • ₹50/दिन',
    badgeMr: 'सशुल्क • ₹50/दिवस',
    rateEn: 'Car ₹50/day • 2-Wheeler ₹20/day • Bus ₹100/day',
    rateHi: 'कार ₹50/दिन • दोपहिया ₹20/दिन • बस ₹100/दिन',
    rateMr: 'कार ₹50/दिवस • दुचाकी ₹20/दिवस • बस ₹100/दिवस',
    carRate: '₹50/day',
    twoWheelerRate: '₹20/day',
    busRate: '₹100/day',
    operatorTypeEn: 'Trimbakeshwar Temple Trust / Municipal',
    operatorTypeHi: 'त्र्यंबकेश्वर मंदिर ट्रस्ट / नगर परिषद',
    operatorTypeMr: 'त्र्यंबकेश्वर मंदिर ट्रस्ट / नगर परिषद',
  },
  'nm-temple-5184': {
    isPaid: true,
    badgeEn: 'Paid • ₹50/day',
    badgeHi: 'सशुल्क • ₹50/दिन',
    badgeMr: 'सशुल्क • ₹50/दिवस',
    rateEn: 'Car ₹50/day • 2-Wheeler ₹20/day',
    rateHi: 'कार ₹50/दिन • दोपहिया ₹20/दिन',
    rateMr: 'कार ₹50/दिवस • दुचाकी ₹20/दिवस',
    carRate: '₹50/day',
    twoWheelerRate: '₹20/day',
    operatorTypeEn: 'Trimbakeshwar Nagar Parishad',
    operatorTypeHi: 'त्र्यंबकेश्वर नगर परिषद',
    operatorTypeMr: 'त्र्यंबकेश्वर नगर परिषद',
  },

  // ── NMC Pay-and-Park Scheme & Commercial Hubs ──
  'nm-parking-64': {
    isPaid: true,
    badgeEn: 'Paid • ₹20/2h',
    badgeHi: 'सशुल्क • ₹20/2 घंटे',
    badgeMr: 'सशुल्क • ₹20/2 तास',
    rateEn: 'Car ₹20 (first 2h) • 2-Wheeler ₹10 (first 2h)',
    rateHi: 'कार ₹20 (पहले 2 घंटे) • दोपहिया ₹10 (पहले 2 घंटे)',
    rateMr: 'कार ₹20 (पहिले 2 तास) • दुचाकी ₹10 (पहिले 2 तास)',
    carRate: '₹20 / 2 hrs',
    twoWheelerRate: '₹10 / 2 hrs',
    operatorTypeEn: 'Commercial Pay & Park (Mira Empire)',
    operatorTypeHi: 'व्यावसायिक पे एंड पार्क',
    operatorTypeMr: 'व्यावसायिक पे अँड पार्क',
  },
  'nm-parking-60': {
    isPaid: true,
    badgeEn: 'Paid • ₹20/2h',
    badgeHi: 'सशुल्क • ₹20/2 घंटे',
    badgeMr: 'सशुल्क • ₹20/2 तास',
    rateEn: 'Car ₹20 (first 2h) • 2-Wheeler ₹10 (first 2h)',
    rateHi: 'कार ₹20 (पहले 2 घंटे) • दोपहिया ₹10 (पहले 2 घंटे)',
    rateMr: 'कार ₹20 (पहिले 2 तास) • दुचाकी ₹10 (पहिले 2 तास)',
    carRate: '₹20 / 2 hrs',
    twoWheelerRate: '₹10 / 2 hrs',
    operatorTypeEn: 'NMC Pay-and-Park Zone',
    operatorTypeHi: 'एनएमसी पे एंड पार्क ज़ोन',
    operatorTypeMr: 'एनएमसी पे अँड पार्क विभाग',
  },
  'nm-parking-70': {
    isPaid: true,
    badgeEn: 'Paid • ₹20/2h',
    badgeHi: 'सशुल्क • ₹20/2 घंटे',
    badgeMr: 'सशुल्क • ₹20/2 तास',
    rateEn: 'Car ₹20 (first 2h) • 2-Wheeler ₹10 (first 2h)',
    rateHi: 'कार ₹20 (पहले 2 घंटे) • दोपहिया ₹10 (पहले 2 घंटे)',
    rateMr: 'कार ₹20 (पहिले 2 तास) • दुचाकी ₹10 (पहिले 2 तास)',
    carRate: '₹20 / 2 hrs',
    twoWheelerRate: '₹10 / 2 hrs',
    operatorTypeEn: 'MSRTC Mahamarg Pay & Park',
    operatorTypeHi: 'एमएसआरटीसी महामार्ग पे एंड पार्क',
    operatorTypeMr: 'एमएसआरटीसी महामार्ग पे अँड पार्क',
  },
  'nm-parking-61': {
    isPaid: true,
    badgeEn: 'Paid • ₹20/2h',
    badgeHi: 'सशुल्क • ₹20/2 घंटे',
    badgeMr: 'सशुल्क • ₹20/2 तास',
    rateEn: 'Car ₹20 (first 2h) • 2-Wheeler ₹10 (first 2h)',
    rateHi: 'कार ₹20 (पहले 2 घंटे) • दोपहिया ₹10 (पहले 2 घंटे)',
    rateMr: 'कार ₹20 (पहिले 2 तास) • दुचाकी ₹10 (पहिले 2 तास)',
    carRate: '₹20 / 2 hrs',
    twoWheelerRate: '₹10 / 2 hrs',
    operatorTypeEn: 'NMC Inner Pay & Park',
    operatorTypeHi: 'एनएमसी इनर पे एंड पार्क',
    operatorTypeMr: 'एनएमसी इनर पे अँड पार्क',
  },
  'nm-parking-62': {
    isPaid: true,
    badgeEn: 'Paid • ₹20/2h',
    badgeHi: 'सशुल्क • ₹20/2 घंटे',
    badgeMr: 'सशुल्क • ₹20/2 तास',
    rateEn: 'Car ₹20 (first 2h) • 2-Wheeler ₹10 (first 2h)',
    rateHi: 'कार ₹20 (पहले 2 घंटे) • दोपहिया ₹10 (पहले 2 घंटे)',
    rateMr: 'कार ₹20 (पहिले 2 तास) • दुचाकी ₹10 (पहिले 2 तास)',
    carRate: '₹20 / 2 hrs',
    twoWheelerRate: '₹10 / 2 hrs',
    operatorTypeEn: 'NMC Inner Pay & Park',
    operatorTypeHi: 'एनएमसी इनर पे एंड पार्क',
    operatorTypeMr: 'एनएमसी इनर पे अँड पार्क',
  },

  // ── Authorized Private Vehicle Lots ──
  'nm-parking-78': {
    isPaid: true,
    badgeEn: 'Paid • ₹50/day',
    badgeHi: 'सशुल्क • ₹50/दिन',
    badgeMr: 'सशुल्क • ₹50/दिवस',
    rateEn: 'Private Vehicle Staging: Car ₹50/day • 2-Wheeler ₹20/day',
    rateHi: 'निजी वाहन पार्किंग: कार ₹50/दिन • दोपहिया ₹20/दिन',
    rateMr: 'खाजगी वाहनतळ: कार ₹50/दिवस • दुचाकी ₹20/दिवस',
    carRate: '₹50/day',
    twoWheelerRate: '₹20/day',
    operatorTypeEn: 'Private Vehicle Lot (Trimbak Rd)',
    operatorTypeHi: 'निजी अधिकृत वाहनतळ',
    operatorTypeMr: 'खाजगी अधिकृत वाहनतळ',
  },
  'nm-parking-89': {
    isPaid: true,
    badgeEn: 'Paid • ₹50/day',
    badgeHi: 'सशुल्क • ₹50/दिन',
    badgeMr: 'सशुल्क • ₹50/दिवस',
    rateEn: 'Private Vehicle Staging: Car ₹50/day • 2-Wheeler ₹20/day',
    rateHi: 'निजी वाहन पार्किंग: कार ₹50/दिन • दोपहिया ₹20/दिन',
    rateMr: 'खाजगी वाहनतळ: कार ₹50/दिवस • दुचाकी ₹20/दिवस',
    carRate: '₹50/day',
    twoWheelerRate: '₹20/day',
    operatorTypeEn: 'Private Vehicle Lot (Trimbak Rd)',
    operatorTypeHi: 'निजी अधिकृत वाहनतळ',
    operatorTypeMr: 'खाजगी अधिकृत वाहनतळ',
  },
  'nm-parking-67': {
    isPaid: true,
    badgeEn: 'Paid • ₹40/day',
    badgeHi: 'सशुल्क • ₹40/दिन',
    badgeMr: 'सशुल्क • ₹40/दिवस',
    rateEn: 'Requisitioned Staging: Car ₹40/day • 2-Wheeler ₹20/day',
    rateHi: 'अधिग्रहित वाहनतळ: कार ₹40/दिन • दोपहिया ₹20/दिन',
    rateMr: 'अधिग्रहित वाहनतळ: कार ₹40/दिवस • दुचाकी ₹20/दिवस',
    carRate: '₹40/day',
    twoWheelerRate: '₹20/day',
    operatorTypeEn: 'Requisitioned Private Parking',
    operatorTypeHi: 'अधिग्रहित निजी वाहनतळ',
    operatorTypeMr: 'अधिग्रहित खाजगी वाहनतळ',
  },
  'nm-parking-44': {
    isPaid: true,
    badgeEn: 'Paid • ₹30/entry',
    badgeHi: 'सशुल्क • ₹30/प्रवेश',
    badgeMr: 'सशुल्क • ₹30/प्रवेश',
    rateEn: 'Trust Maintenance: Car ₹30 • 2-Wheeler ₹10',
    rateHi: 'ट्रस्ट रखरखाव शुल्क: कार ₹30 • दोपहिया ₹10',
    rateMr: 'ट्रस्ट देखभाल शुल्क: कार ₹30 • दुचाकी ₹10',
    carRate: '₹30 / entry',
    twoWheelerRate: '₹10 / entry',
    operatorTypeEn: 'Temple Trust Parking',
    operatorTypeHi: 'मंदिर ट्रस्ट वाहनतळ',
    operatorTypeMr: 'मंदिर ट्रस्ट वाहनतळ',
  },
  'nm-parking-87': {
    isPaid: true,
    badgeEn: 'Paid • ₹30/entry',
    badgeHi: 'सशुल्क • ₹30/प्रवेश',
    badgeMr: 'सशुल्क • ₹30/प्रवेश',
    rateEn: 'Commercial Lot: Car ₹30 • 2-Wheeler ₹15',
    rateHi: 'व्यावसायिक पार्किंग: कार ₹30 • दोपहिया ₹15',
    rateMr: 'व्यावसायिक वाहनतळ: कार ₹30 • दुचाकी ₹15',
    carRate: '₹30 / entry',
    twoWheelerRate: '₹15 / entry',
    operatorTypeEn: 'Commercial Area Parking',
    operatorTypeHi: 'व्यावसायिक क्षेत्र पार्किंग',
    operatorTypeMr: 'व्यावसायिक क्षेत्र वाहनतळ',
  },
  'nm-parking-88': {
    isPaid: true,
    badgeEn: 'Paid • ₹30/entry',
    badgeHi: 'सशुल्क • ₹30/प्रवेश',
    badgeMr: 'सशुल्क • ₹30/प्रवेश',
    rateEn: 'Commercial Lot: Car ₹30 • 2-Wheeler ₹15',
    rateHi: 'व्यावसायिक पार्किंग: कार ₹30 • दोपहिया ₹15',
    rateMr: 'व्यावसायिक वाहनतळ: कार ₹30 • दुचाकी ₹15',
    carRate: '₹30 / entry',
    twoWheelerRate: '₹15 / entry',
    operatorTypeEn: 'Commercial Area Parking',
    operatorTypeHi: 'व्यावसायिक क्षेत्र पार्किंग',
    operatorTypeMr: 'व्यावसायिक क्षेत्र वाहनतळ',
  },
  'nm-parking-57': {
    isPaid: true,
    badgeEn: 'Paid • ₹50/day',
    badgeHi: 'सशुल्क • ₹50/दिन',
    badgeMr: 'सशुल्क • ₹50/दिवस',
    rateEn: 'Private Facility: Car ₹50/day • 2-Wheeler ₹20/day',
    rateHi: 'निजी सुविधा: कार ₹50/दिन • दोपहिया ₹20/दिन',
    rateMr: 'खाजगी सुविधा: कार ₹50/दिवस • दुचाकी ₹20/दिवस',
    carRate: '₹50/day',
    twoWheelerRate: '₹20/day',
    operatorTypeEn: 'Private Staging Facility',
    operatorTypeHi: 'निजी वाहन सुविधा',
    operatorTypeMr: 'खाजगी वाहन सुविधा',
  },
};

const DEFAULT_FREE_PARKING_INFO: ParkingPricingInfo = {
  isPaid: false,
  badgeEn: '24×7 • Free',
  badgeHi: '24×7 खुला • निःशुल्क',
  badgeMr: '२४×७ खुले • मोफत',
  rateEn: 'Free (Kumbh Mela Transit Scheme)',
  rateHi: 'निःशुल्क (कुंभ मेला पारगमन योजना)',
  rateMr: 'मोफत (कुंभमेळा वाहतूक योजना)',
  operatorTypeEn: 'NTKMA / NMC Free Transit Buffer',
  operatorTypeHi: 'एनटीकेएमए / एनएमसी निःशुल्क बफर',
  operatorTypeMr: 'एनटीकेएमए / एनएमसी मोफत बफर',
};

/**
 * Returns pricing information for a parking spot.
 * Defaults to Free Kumbh Transit Scheme for official satellite parking buffers.
 */
export function getParkingPricing(zoneId: string): ParkingPricingInfo {
  return PAID_PARKING_CONFIG[zoneId] || DEFAULT_FREE_PARKING_INFO;
}
