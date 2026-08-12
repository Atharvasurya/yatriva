/**
 * seed.ts — Static seed data for Yatriva Phase 1 & 2
 *
 * This file is the single source of truth until the database is wired.
 * Rules:
 *  - verified: false  →  data has NOT been checked against an official/primary source
 *  - null values      →  data is unknown; the UI MUST show a PLACEHOLDER badge
 *  - Coordinates marked verified:false are approximate public knowledge (OSM)
 *    and must be re-surveyed before going live.
 */

import type {
  Place,
  Ghat,
  Temple,
  ParkingZone,
  TransportHub,
  TransportRoute,
  EmergencyContact,
  AmritSnanDate,
} from '@/types/place';

// ─── Amrit Snan Dates ────────────────────────────────────────────────────────

export const SNAN_DATES: AmritSnanDate[] = [
  {
    id: 'snan-1',
    labelKey: 'snan1',
    date: '2027-08-02',
    endDate: null,
    verified: false,
    verificationNote: 'PLACEHOLDER — verify with official Nashik Kumbh Mela 2027 calendar',
  },
  {
    id: 'snan-2',
    labelKey: 'snan2',
    date: '2027-08-31',
    endDate: null,
    verified: false,
    verificationNote: 'PLACEHOLDER — verify with official Nashik Kumbh Mela 2027 calendar',
  },
  {
    id: 'snan-3',
    labelKey: 'snan3',
    date: '2027-09-11',
    endDate: '2027-09-12',
    verified: false,
    verificationNote: 'PLACEHOLDER — verify with official Nashik Kumbh Mela 2027 calendar',
  },
];

// ─── Ghats ───────────────────────────────────────────────────────────────────

export const GHATS: Ghat[] = [
  {
    id: 'ghat-ramkund',
    slug: 'ramkund',
    cultureSlug: 'ramkund',
    category: 'ghat',
    name: {
      en: 'Ramkund Ghat',
      hi: 'रामकुंड घाट',
      mr: 'रामकुंड घाट',
    },
    coordinates: { lat: 19.9961, lng: 73.7888 },
    description: {
      en: 'The most sacred bathing ghat on the Godavari river in Nashik, where Lord Ram is believed to have bathed during his exile. Primary Amrit Snan site.',
      hi: 'नाशिक में गोदावरी नदी पर सबसे पवित्र स्नान घाट, जहाँ भगवान राम ने अपने वनवास के दौरान स्नान किया था। मुख्य अमृत स्नान स्थल।',
      mr: 'नाशिकमधील गोदावरी नदीवरील सर्वात पवित्र स्नान घाट, जेथे भगवान रामाने वनवासात स्नान केले असे मानले जाते. मुख्य अमृत स्नान स्थळ.',
    },
    riverName: 'Godavari',
    snanPriority: 1,
    verified: false,
    lastVerified: undefined,
    tags: ['primary-snan', 'accessible'],
  },
  {
    id: 'ghat-kushavarta',
    slug: 'kushavarta',
    cultureSlug: 'godavari',
    category: 'ghat',
    name: {
      en: 'Kushavarta Ghat',
      hi: 'कुशावर्त घाट',
      mr: 'कुशावर्त घाट',
    },
    coordinates: { lat: 19.9416, lng: 73.5306 },
    description: {
      en: 'Sacred bathing kund (tank) at Trimbakeshwar, considered the source of the Godavari river. Key Snan site during Kumbh.',
      hi: 'त्र्यंबकेश्वर में पवित्र स्नान कुंड, जो गोदावरी नदी का उद्गम माना जाता है। कुंभ के दौरान मुख्य स्नान स्थल।',
      mr: 'त्र्यंबकेश्वर येथील पवित्र कुशावर्त कुंड, गोदावरी नदीचे उगमस्थान. कुंभ मेळ्यातील मुख्य स्नान स्थळ.',
    },
    riverName: 'Godavari (source)',
    snanPriority: 1,
    verified: false,
    tags: ['primary-snan', 'trimbakeshwar'],
  },
  {
    id: 'ghat-gorakhkund',
    slug: 'gorakhkund',
    category: 'ghat',
    name: {
      en: 'Gorakhkund Ghat',
      hi: 'गोरखकुंड घाट',
      mr: 'गोरखकुंड घाट',
    },
    coordinates: { lat: 19.9972, lng: 73.7895 },
    description: {
      en: 'A bathing ghat near Ramkund, Nashik.',
      hi: 'नाशिक में रामकुंड के पास एक स्नान घाट।',
      mr: 'नाशिकमधील रामकुंडजवळील स्नान घाट.',
    },
    riverName: 'Godavari',
    snanPriority: 2,
    verified: false,
  },
];

// ─── Temples ─────────────────────────────────────────────────────────────────

export const TEMPLES: Temple[] = [
  {
    id: 'temple-trimbakeshwar',
    slug: 'trimbakeshwar',
    cultureSlug: 'trimbakeshwar',
    category: 'temple',
    name: {
      en: 'Trimbakeshwar Shiva Temple',
      hi: 'त्र्यंबकेश्वर शिव मंदिर',
      mr: 'त्र्यंबकेश्वर शिव मंदिर',
    },
    coordinates: { lat: 19.9325, lng: 73.5306 },
    description: {
      en: 'One of the twelve Jyotirlinga shrines of Lord Shiva. Located ~28 km from Nashik city. Principal temple of the Kumbh Mela.',
      hi: 'भगवान शिव के बारह ज्योतिर्लिंगों में से एक। नाशिक शहर से लगभग 28 किमी दूर। कुंभ मेले का प्रमुख मंदिर।',
      mr: 'भगवान शिवाच्या बारा ज्योतिर्लिंगांपैकी एक. नाशिक शहरापासून सुमारे 28 किमी. कुंभ मेळ्याचे मुख्य मंदिर.',
    },
    deity: 'Shiva (Trimbakeshwar)',
    timingsEn: null,
    verified: false,
    tags: ['jyotirlinga', 'principal-kumbh-site'],
  },
  {
    id: 'temple-kalaram',
    slug: 'kalaram',
    cultureSlug: 'panchavati',
    category: 'temple',
    name: {
      en: 'Kalaram Temple',
      hi: 'काळाराम मंदिर',
      mr: 'काळाराम मंदिर',
    },
    coordinates: { lat: 19.9934, lng: 73.7875 },
    description: {
      en: 'Historic Rama temple in Panchvati, Nashik, built in black stone. One of the most visited temples during Kumbh.',
      hi: 'नाशिक के पंचवटी में काले पत्थर से बना ऐतिहासिक राम मंदिर। कुंभ के दौरान सबसे अधिक देखे जाने वाले मंदिरों में से एक।',
      mr: 'नाशिकच्या पंचवटीत काळ्या दगडात बांधलेले ऐतिहासिक राम मंदिर. कुंभात सर्वाधिक भेट दिले जाणाऱ्या मंदिरांपैकी एक.',
    },
    deity: 'Rama (Black stone)',
    timingsEn: null,
    verified: false,
    tags: ['panchvati', 'historic'],
  },
  {
    id: 'temple-saptashringi',
    slug: 'saptashringi',
    category: 'temple',
    name: {
      en: 'Saptashringi Devi Temple',
      hi: 'सप्तश्रृंगी देवी मंदिर',
      mr: 'सप्तश्रृंगी देवी मंदिर',
    },
    coordinates: { lat: 20.3133, lng: 73.8355 },
    description: {
      en: 'An important Shakti Peetha located ~65 km from Nashik.',
      hi: 'नाशिक से लगभग 65 किमी दूर स्थित एक महत्वपूर्ण शक्तिपीठ।',
      mr: 'नाशिकपासून सुमारे 65 किमी अंतरावर असलेली एक महत्त्वाची शक्तीपीठ.',
    },
    deity: 'Saptashringi Devi',
    timingsEn: null,
    verified: false,
    tags: ['shakti-peetha', 'day-trip'],
  },
];

// ─── Parking Zones ───────────────────────────────────────────────────────────

export const PARKING_ZONES: ParkingZone[] = [
  {
    id: 'parking-zone-a',
    slug: 'parking-zone-a',
    category: 'parking',
    name: {
      en: 'Parking Zone A — Nashik Road',
      hi: 'पार्किंग जोन A — नाशिक रोड',
      mr: 'पार्किंग झोन A — नाशिक रोड',
    },
    coordinates: { lat: 20.0067, lng: 73.7992 },
    capacityVehicles: null,
    vehicleTypes: ['car', 'two_wheeler'],
    distanceToMainGhatKm: null,
    shuttleAvailable: null,
    verified: false,
  },
  {
    id: 'parking-zone-b',
    slug: 'parking-zone-b',
    category: 'parking',
    name: {
      en: 'Parking Zone B — Panchvati',
      hi: 'पार्किंग जोन B — पंचवटी',
      mr: 'पार्किंग झोन B — पंचवटी',
    },
    coordinates: { lat: 19.9943, lng: 73.7901 },
    capacityVehicles: null,
    vehicleTypes: ['car', 'bus', 'two_wheeler'],
    distanceToMainGhatKm: null,
    shuttleAvailable: null,
    verified: false,
  },
];

// ─── Transport Hubs ──────────────────────────────────────────────────────────

export const TRANSPORT_HUBS: TransportHub[] = [
  {
    id: 'hub-nashik-road-station',
    slug: 'nashik-road-station',
    category: 'transport_hub',
    name: {
      en: 'Nashik Road Railway Station',
      hi: 'नाशिक रोड रेलवे स्टेशन',
      mr: 'नाशिक रोड रेल्वे स्टेशन',
    },
    coordinates: { lat: 20.0024, lng: 73.7913 },
    hubType: 'railway_station',
    verified: false,
  },
  {
    id: 'hub-cbs-nashik',
    slug: 'cbs-nashik',
    category: 'transport_hub',
    name: {
      en: 'CBS (Central Bus Stand) Nashik',
      hi: 'CBS (केंद्रीय बस स्टैंड) नाशिक',
      mr: 'CBS (मध्यवर्ती बस स्थानक) नाशिक',
    },
    coordinates: { lat: 20.0004, lng: 73.7862 },
    hubType: 'bus_stand',
    verified: false,
  },
];

// ─── Medical Aid Posts ───────────────────────────────────────────────────────

export const MEDICAL_POSTS: Place[] = [
  {
    id: 'med-ramkund-post',
    slug: 'ramkund-medical-post',
    category: 'medical',
    name: {
      en: 'Ramkund Emergency Medical Aid Post',
      hi: 'रामकुंड आपातकालीन चिकित्सा सहायता केंद्र',
      mr: 'रामकुंड आपत्कालीन वैद्यकीय मदत केंद्र',
    },
    coordinates: { lat: 19.9965, lng: 73.7884 },
    description: {
      en: '24x7 Emergency first-aid center near Ramkund Ghat with ambulances standby.',
      hi: 'रामकुंड घाट के पास एम्बुलेंस के साथ 24x7 आपातकालीन प्राथमिक चिकित्सा केंद्र।',
      mr: 'रामकुंड घाटाजवळ रुग्णवाहिकेसह 24x7 आपत्कालीन प्राथमिक उपचार केंद्र.',
    },
    verified: false,
    tags: ['first-aid', '24x7', 'ambulance'],
  },
  {
    id: 'med-trimbak-post',
    slug: 'trimbak-medical-post',
    category: 'medical',
    name: {
      en: 'Trimbakeshwar Civil Health Center',
      hi: 'त्र्यंबकेश्वर नागरिक स्वास्थ्य केंद्र',
      mr: 'त्र्यंबकेश्वर नागरी आरोग्य केंद्र',
    },
    coordinates: { lat: 19.9338, lng: 73.5312 },
    description: {
      en: 'Primary health center providing emergency medical aid near Trimbakeshwar Temple.',
      hi: 'त्र्यंबकेश्वर मंदिर के पास आपातकालीन चिकित्सा सहायता प्रदान करने वाला प्राथमिक स्वास्थ्य केंद्र।',
      mr: 'त्र्यंबकेश्वर मंदिरा जवळ आपत्कालीन वैद्यकीय मदत देणारे प्राथमिक आरोग्य केंद्र.',
    },
    verified: false,
    tags: ['first-aid', 'trimbak'],
  },
];

// ─── Police Aid Booths ───────────────────────────────────────────────────────

export const POLICE_BOOTHS: Place[] = [
  {
    id: 'pol-ramkund-booth',
    slug: 'ramkund-police-booth',
    category: 'police',
    name: {
      en: 'Ramkund Police Assistance Booth',
      hi: 'रामकुंड पुलिस सहायता बूथ',
      mr: 'रामकुंड पोलीस मदत कक्ष',
    },
    coordinates: { lat: 19.9958, lng: 73.7892 },
    description: {
      en: 'Crowd control and lost-and-found assistance booth manned by Nashik Police.',
      hi: 'नाशिक पुलिस द्वारा संचालित भीड़ नियंत्रण और खोया-पाया सहायता बूथ।',
      mr: 'नाशिक पोलिसांकडून संचलित गर्दी नियंत्रण व हरवले-सापडले मदत कक्ष.',
    },
    verified: false,
    tags: ['police', 'lost-found'],
  },
];

// ─── Public Toilets ──────────────────────────────────────────────────────────

export const PUBLIC_TOILETS: Place[] = [
  {
    id: 'toilet-panchvati-complex',
    slug: 'panchvati-public-toilet',
    category: 'toilet',
    name: {
      en: 'Panchvati Sanitation Complex',
      hi: 'पंचवटी स्वच्छता परिसर',
      mr: 'पंचवटी स्वच्छता गृह',
    },
    coordinates: { lat: 19.9948, lng: 73.7881 },
    description: {
      en: 'High-capacity public toilets and bathing cubicles near Panchvati ghats.',
      hi: 'पंचवटी घाटों के पास उच्च क्षमता वाले सार्वजनिक शौचालय और स्नान गृह।',
      mr: 'पंचवटी घाटांजवळ उच्च क्षमतेची सार्वजनिक स्वच्छतागृहे व स्नानगृहे.',
    },
    verified: false,
    tags: ['sanitation', 'accessible'],
  },
  {
    id: 'toilet-trimbak-bus-stand',
    slug: 'trimbak-bus-toilet',
    category: 'toilet',
    name: {
      en: 'Trimbakeshwar Bus Stand Sanitation Facility',
      hi: 'त्र्यंबकेश्वर बस स्टैंड स्वच्छता सुविधा',
      mr: 'त्र्यंबकेश्वर बस स्थानक स्वच्छता गृह',
    },
    coordinates: { lat: 19.9345, lng: 73.5320 },
    description: {
      en: 'Public sanitation facility located at Trimbakeshwar main bus stand.',
      hi: 'त्र्यंबकेश्वर मुख्य बस स्टैंड पर स्थित सार्वजनिक स्वच्छता सुविधा।',
      mr: 'त्र्यंबकेश्वर मुख्य बस स्थानकावर सार्वजनिक स्वच्छता गृह.',
    },
    verified: false,
    tags: ['sanitation'],
  },
];

// ─── Food / Annakshetra Zones ────────────────────────────────────────────────

export const FOOD_ZONES: Place[] = [
  {
    id: 'food-ramkund-bhojanalaya',
    slug: 'ramkund-annakshetra',
    category: 'food',
    name: {
      en: 'Ramkund Free Annakshetra (Meal Distribution)',
      hi: 'रामकुंड नि:शुल्क अन्नक्षेत्र (प्रसाद वितरण)',
      mr: 'रामकुंड मोफत अन्नछत्र (महाप्रसाद)',
    },
    coordinates: { lat: 19.9968, lng: 73.7898 },
    description: {
      en: 'Free vegetarian meals and drinking water distributed by charitable trusts during Snan days.',
      hi: 'स्नान के दिनों में चैरिटेबल ट्रस्टों द्वारा नि:शुल्क शाकाहारी भोजन और पेयजल वितरण।',
      mr: 'स्नान दिनानिमित्त विविध संस्थांकडून मोफत शाकाहारी महाप्रसाद व पिण्याचे पाणी वितरण.',
    },
    verified: false,
    tags: ['free-food', 'water'],
  },
];

// ─── Information Centers ─────────────────────────────────────────────────────

export const INFO_CENTRES: Place[] = [
  {
    id: 'info-cbs-helpdesk',
    slug: 'cbs-kumbh-infocentre',
    category: 'information_centre',
    name: {
      en: 'CBS Kumbh Mela Pilgrim Information Desk',
      hi: 'CBS कुंभ मेला तीर्थयात्री सूचना केंद्र',
      mr: 'CBS कुंभ मेळा यात्रेकरू माहिती केंद्र',
    },
    coordinates: { lat: 20.0008, lng: 73.7868 },
    description: {
      en: 'Pilgrim help desk providing route maps, shuttle timetables, and multi-lingual assistance.',
      hi: 'मार्ग मानचित्र, शटल समय सारणी और बहुभाषी सहायता प्रदान करने वाला तीर्थयात्री सहायता डेस्क।',
      mr: 'मार्ग नकाशा, शटल वेळापत्रक व बहुभाषिक मदत देणारे यात्रेकरू माहिती केंद्र.',
    },
    verified: false,
    tags: ['information', 'maps', 'multilingual'],
  },
];

// ─── Consolidated Map POIs Export ────────────────────────────────────────────

export const ALL_MAP_PLACES: Place[] = [
  ...GHATS,
  ...TEMPLES,
  ...PARKING_ZONES,
  ...TRANSPORT_HUBS,
  ...MEDICAL_POSTS,
  ...POLICE_BOOTHS,
  ...PUBLIC_TOILETS,
  ...FOOD_ZONES,
  ...INFO_CENTRES,
];

// ─── Transport Routes ─────────────────────────────────────────────────────────

export const TRANSPORT_ROUTES: TransportRoute[] = [
  {
    id: 'route-nashik-trimbak',
    routeNumber: null,
    routeNameEn: 'Nashik → Trimbakeshwar',
    routeNameHi: 'नाशिक → त्र्यंबकेश्वर',
    routeNameMr: 'नाशिक → त्र्यंबकेश्वर',
    origin: 'CBS Nashik',
    destination: 'Trimbakeshwar',
    frequencyMinutes: null,
    operatorEn: 'MSRTC [PLACEHOLDER — verify]',
    verified: false,
    notes: 'PLACEHOLDER — route number and frequency to be verified with MSRTC',
  },
];

// ─── Emergency Contacts ──────────────────────────────────────────────────────

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'emg-police',
    labelEn: 'Nashik Police',
    labelHi: 'नाशिक पुलिस',
    labelMr: 'नाशिक पोलीस',
    phone: null,
    category: 'police',
    verified: false,
  },
  {
    id: 'emg-ambulance',
    labelEn: 'Ambulance',
    labelHi: 'एम्बुलेंस',
    labelMr: 'रुग्णवाहिका',
    phone: null,
    category: 'medical',
    verified: false,
  },
  {
    id: 'emg-kumbh-helpline',
    labelEn: 'Kumbh Mela Helpline',
    labelHi: 'कुंभ मेला हेल्पलाइन',
    labelMr: 'कुंभ मेळा हेल्पलाईन',
    phone: null,
    category: 'kumbh_helpline',
    verified: false,
  },
  {
    id: 'emg-women-helpline',
    labelEn: 'Women Helpline',
    labelHi: 'महिला हेल्पलाइन',
    labelMr: 'महिला हेल्पलाईन',
    phone: null,
    category: 'women_helpline',
    verified: false,
  },
];
