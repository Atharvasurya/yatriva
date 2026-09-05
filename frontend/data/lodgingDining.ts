/**
 * lodgingDining.ts — Static data for the /stay-and-eat page.
 *
 * ⚠️  TEST DATA ONLY — every entry below is clearly fictional.
 *     Names are intentional placeholders.
 *     Replace with verified real listings before any public launch.
 *
 * This file is ISOLATED from seed.ts and the existing `places` / map data.
 * Do NOT import or reference this file from the map, places, or seed modules.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ListingType = 'lodging' | 'restaurant';

export type PriceRange = 'budget' | 'mid' | 'premium';

export type AccommodationType =
  | 'guesthouse'
  | 'hotel'
  | 'tent_resort';

export interface LocalizedString {
  en: string;
  hi: string;
  mr: string;
}

export interface LodgingListing {
  id: string;
  listingType: 'lodging';
  name: LocalizedString;
  description: LocalizedString;
  coordinates: { lat: number; lng: number };
  priceRange: PriceRange;
  accommodationType: AccommodationType;
  distance: LocalizedString;
  timing: LocalizedString;
  rating: number;
  reviewsCount: number;
  priceDisplay: LocalizedString;
  priceAmount: string;
  priceSubtext: LocalizedString;
  tags: LocalizedString[];
  imageUrl: string;
  thumbnails: string[];
  ratingScore: number;
  ratingLabel: LocalizedString;
  starCount: number;
  checklist: LocalizedString[];
}

export interface RestaurantListing {
  id: string;
  listingType: 'restaurant';
  name: LocalizedString;
  description: LocalizedString;
  coordinates: { lat: number; lng: number };
  priceRange: PriceRange;
  vegOnly: boolean;
  cuisineType: string;
  distance: LocalizedString;
  timing: LocalizedString;
  rating: number;
  reviewsCount: number;
  priceDisplay: LocalizedString;
  priceAmount: string;
  priceSubtext: LocalizedString;
  tags: LocalizedString[];
  imageUrl: string;
  thumbnails: string[];
  ratingScore: number;
  ratingLabel: LocalizedString;
  starCount: number;
  checklist: LocalizedString[];
}

export type Listing = LodgingListing | RestaurantListing;

// ─── Test Seed Data ───────────────────────────────────────────────────────────

export const LODGING_DINING_LISTINGS: Listing[] = [

  // ── LODGING (Hotels, Guesthouses, Tent Resorts) ───────────────────────────

  {
    id: 'ld-hotel-1',
    listingType: 'lodging',
    name: {
      en: 'The Godavari Heritage City Hotel',
      hi: 'गोदावरी हेरिटेज सिटी होटल',
      mr: 'गोदावरी हेरिटेज सिटी हॉटेल',
    },
    description: {
      en: 'Modern air-conditioned rooms with elevator access, complimentary breakfast buffet, comfortable bedding, and dedicated travel desk for Kumbh pilgrims.',
      hi: 'एसी कमरे, लिफ्ट, निःशुल्क नाश्ता और तीर्थयात्री डेस्क के साथ आधुनिक होटल।',
      mr: 'एसी खोल्या, लिफ्ट, मोफत नाश्ता आणि यात्रेकरू डेस्कसह आधुनिक हॉटेल.',
    },
    coordinates: { lat: 20.0037, lng: 73.7872 },
    priceRange: 'mid',
    accommodationType: 'hotel',
    distance: {
      en: '1.2 km from City Center • Panchavati',
      hi: 'पंचवटी चौक से 1.2 किमी',
      mr: 'पंचवटी चौकापासून 1.2 किमी',
    },
    timing: {
      en: '24-Hour Front Desk',
      hi: '24 घंटे फ्रंट डेस्क',
      mr: '24 तास रिसेप्शन',
    },
    rating: 4.8,
    reviewsCount: 245,
    priceDisplay: {
      en: '₹1,800 / Night',
      hi: '₹1,800 / प्रति रात्रि',
      mr: '₹1,800 / प्रति रात्र',
    },
    priceAmount: '₹1,800',
    priceSubtext: {
      en: 'includes taxes, breakfast & Wi-Fi',
      hi: 'कर, नाश्ता एवं वाई-फाई शामिल',
      mr: 'कर, नाश्ता व वाय-फाय समाविष्ट',
    },
    tags: [
      { en: 'Air Conditioned', hi: 'वातानुकूलित (AC)', mr: 'एसी खोल्या' },
      { en: 'Elevator', hi: 'लिफ्ट उपलब्ध', mr: 'लिफ्ट सोय' },
      { en: 'Breakfast Buffet', hi: 'नाश्ता शामिल', mr: 'नाश्ता समाविष्ट' },
    ],
    imageUrl: '/images/lodging/hotel_main.jpg',
    thumbnails: [
      '/images/lodging/hotel_thumb_1.jpg',
      '/images/lodging/hotel_thumb_2.jpg',
      '/images/lodging/hotel_thumb_3.jpg',
    ],
    ratingScore: 9.1,
    ratingLabel: {
      en: 'Exceptional',
      hi: 'उत्कृष्ट',
      mr: 'अतिउत्कृष्ट',
    },
    starCount: 5,
    checklist: [
      { en: 'Great Breakfast Included', hi: 'स्वादिष्ट नाश्ता शामिल', mr: 'उत्कृष्ट नाश्ता समाविष्ट' },
      { en: 'Comfortable Luxury Beds', hi: 'आरामदायक बिस्तर', mr: 'आरामदायी बिछाने' },
      { en: 'Elevator & Wheelchair Access', hi: 'लिफ्ट व सुलभ प्रवेश', mr: 'लिफ्ट व सुलभ प्रवेश' },
      { en: 'Clean Restrooms & Power Backup', hi: 'स्वच्छ प्रसाधनगृह व बैकअप', mr: 'स्वच्छ प्रसाधनगृह व बॅकअप' },
    ],
  },



  {
    id: 'ld-guesthouse-1',
    listingType: 'lodging',
    name: {
      en: 'Panchavati Sacred Pilgrim Guesthouse',
      hi: 'पंचवटी पावन तीर्थ गेस्टहाउस',
      mr: 'पंचवटी पावन यात्रेकरू गेस्टहाऊस',
    },
    description: {
      en: 'Private rooms with attached western bathrooms, 24-hour hot water, quiet atmosphere, and a peaceful courtyard walking distance from Kala Ram Temple.',
      hi: 'अटैच बाथरूम, गर्म पानी और शांत वातावरण वाले साफ-सुथरे पारिवारिक कमरे।',
      mr: 'स्वतंत्र स्नानगृह, गरम पाणी व शांत वातावरण असलेल्या स्वच्छ कौटुंबिक खोल्या.',
    },
    coordinates: { lat: 20.0055, lng: 73.7890 },
    priceRange: 'budget',
    accommodationType: 'guesthouse',
    distance: {
      en: '500 m from Kala Ram Temple',
      hi: 'कालाराम मंदिर से 500 मी',
      mr: 'काळाराम मंदिरापासून 500 मी',
    },
    timing: {
      en: 'Check-in: 12:00 PM • Flexible',
      hi: 'चेक-इन: दोपहर 12:00',
      mr: 'चेक-इन: दुपारी 12:00',
    },
    rating: 4.5,
    reviewsCount: 112,
    priceDisplay: {
      en: '₹750 / Room',
      hi: '₹750 / कमरा',
      mr: '₹750 / खोली',
    },
    priceAmount: '₹750',
    priceSubtext: {
      en: 'per room / includes taxes',
      hi: 'प्रति कमरा / सभी कर शामिल',
      mr: 'प्रति खोली / सर्व कर समाविष्ट',
    },
    tags: [
      { en: 'Attached Bath', hi: 'निजी शौचालय', mr: 'स्वतंत्र स्नानगृह' },
      { en: 'Family Rooms', hi: 'पारिवारिक कमरे', mr: 'कौटुंबिक खोल्या' },
    ],
    imageUrl: '/images/lodging/guesthouse_main.jpg',
    thumbnails: [
      '/images/lodging/guesthouse_thumb_1.jpg',
      '/images/lodging/guesthouse_thumb_2.jpg',
      '/images/lodging/guesthouse_thumb_3.jpg',
    ],
    ratingScore: 8.6,
    ratingLabel: {
      en: 'Very Good',
      hi: 'बहुत अच्छा',
      mr: 'खूप छान',
    },
    starCount: 4,
    checklist: [
      { en: 'Attached Western Bathroom', hi: 'कमरे में संलग्न शौचालय', mr: 'खोलीत संलग्न स्नानगृह' },
      { en: '24-Hour Hot Water Supply', hi: '24 घंटे गर्म पानी', mr: '24 तास गरम पाणी' },
      { en: 'Family-Friendly Quiet Environment', hi: 'सुरक्षित पारिवारिक वातावरण', mr: 'सुरक्षित कौटुंबिक वातावरण' },
      { en: 'Short Walk to Ramkund & Kala Ram', hi: 'रामकुंड व कालाराम पैदल दूरी', mr: 'रामकुंड व काळाराम पायी अंतरावर' },
    ],
  },

  {
    id: 'ld-camp-1',
    listingType: 'lodging',
    name: {
      en: 'Tapovan Kumbh Heritage Tent Resort',
      hi: 'तपोवन कुंभ हेरिटेज टेंट रिसॉर्ट',
      mr: 'तपोवन कुंभ हेरिटेज टेंट रिसॉर्ट',
    },
    description: {
      en: 'Well-appointed Swiss cottage tents with comfortable beds, private attached bathrooms, air cooling, electricity backup, and direct shuttle to sacred snan ghats.',
      hi: 'आरामदायक स्विस कॉटेज टेंट, अटैच बाथरूम, कूलर और रामकुंड के लिए सीधी शटल बस।',
      mr: 'आरामदायी स्विस कॉटेज तंबू, संलग्न स्नानगृह, कुलर आणि थेट शटल बस सुविधा.',
    },
    coordinates: { lat: 20.0112, lng: 73.8010 },
    priceRange: 'mid',
    accommodationType: 'tent_resort',
    distance: {
      en: 'Tapovan Sector 3 • Direct Shuttle #4',
      hi: 'तपोवन सेक्टर 3 • शटल बस 4',
      mr: 'तपोवन सेक्टर 3 • शटल बस 4',
    },
    timing: {
      en: 'Check-in: 1:00 PM • 24/7 Desk',
      hi: 'चेक-इन: दोपहर 1:00 • 24/7 हेल्पडेस्क',
      mr: 'चेक-इन: दुपारी 1:00 • 24/7 हेल्पडेस्क',
    },
    rating: 4.8,
    reviewsCount: 195,
    priceDisplay: {
      en: '₹1,200 / Tent',
      hi: '₹1,200 / तंबू',
      mr: '₹1,200 / तंबू',
    },
    priceAmount: '₹1,200',
    priceSubtext: {
      en: 'per tent / attached bath & breakfast',
      hi: 'प्रति टेंट / नाश्ता एवं संलग्न स्नानगृह',
      mr: 'प्रति तंबू / नाश्ता व संलग्न स्नानगृह',
    },
    tags: [
      { en: 'Swiss Cottage Tent', hi: 'स्विस कॉटेज टेंट', mr: 'स्विस कॉटेज तंबू' },
      { en: 'Attached Bath', hi: 'संलग्न स्नानगृह', mr: 'संलग्न स्नानगृह' },
      { en: 'Power Backup', hi: 'बिजली बैकअप', mr: 'वीज बॅकअप' },
    ],
    imageUrl: '/images/lodging/camp_main.jpg',
    thumbnails: [
      '/images/lodging/camp_thumb_1.jpg',
      '/images/lodging/camp_thumb_2.jpg',
      '/images/lodging/camp_thumb_3.jpg',
    ],
    ratingScore: 9.0,
    ratingLabel: {
      en: 'Exceptional',
      hi: 'उत्कृष्ट',
      mr: 'अतिउत्कृष्ट',
    },
    starCount: 5,
    checklist: [
      { en: 'Spacious Swiss Tent with Real Beds', hi: 'आरामदायक बिस्तरों वाला विशाल टेंट', mr: 'आरामदायी बिछान्यांसह प्रशस्त तंबू' },
      { en: 'Private Attached Modern Bathroom', hi: 'निजी आधुनिक संलग्न शौचालय', mr: 'स्वतंत्र आधुनिक संलग्न स्नानगृह' },
      { en: 'Fresh Morning Breakfast Included', hi: 'ताज़ा सुबह का नाश्ता शामिल', mr: 'ताजा सकाळचा नाश्ता समाविष्ट' },
      { en: 'Continuous Shuttle to Ramkund', hi: 'रामकुंड हेतु निरंतर शटल बस', mr: 'रामकुंडासाठी सतत शटल बस' },
    ],
  },

  {
    id: 'ld-hotel-2',
    listingType: 'lodging',
    name: {
      en: 'The Grand Panchavati Riverfront Hotel',
      hi: 'द ग्रैंड पंचवटी रिवरफ्रंट होटल',
      mr: 'द ग्रँड पंचवटी रिव्हरफ्रंट हॉटेल',
    },
    description: {
      en: 'Premium heritage hotel overlooking the sacred Godavari river, offering riverfront balconies, multi-cuisine restaurant, banquet hall, and 24-hour room service.',
      hi: 'गोदावरी नदी के तट पर स्थित प्रीमियम हेरिटेज होटल, बालकनी, बहुव्यंजन रेस्तरां और 24 घंटे रूम सर्विस।',
      mr: 'गोदावरी नदीकाठावरील प्रीमियर हेरिटेज हॉटेल, रिव्हरफ्रंट बाल्कनी, रेस्टॉरंट आणि २४ तास रूम सर्व्हिस.',
    },
    coordinates: { lat: 20.0089, lng: 73.7935 },
    priceRange: 'premium',
    accommodationType: 'hotel',
    distance: {
      en: '400 m from Ramkund Ghat • Riverside',
      hi: 'रामकुंड घाट से 400 मी • नदी तट',
      mr: 'रामकुंड घाटापासून 400 मी • नदीकाठ',
    },
    timing: {
      en: '24-Hour Front Desk',
      hi: '24 घंटे फ्रंट डेस्क',
      mr: '24 तास रिसेप्शन',
    },
    rating: 4.9,
    reviewsCount: 310,
    priceDisplay: {
      en: '₹2,600 / Night',
      hi: '₹2,600 / प्रति रात्रि',
      mr: '₹2,600 / प्रति रात्र',
    },
    priceAmount: '₹2,600',
    priceSubtext: {
      en: 'includes riverfront view & breakfast buffet',
      hi: 'रिवरफ्रंट दृश्य एवं नाश्ता बुफे शामिल',
      mr: 'रिव्हरफ्रंट व्ह्यू आणि नाश्ता बुफे समाविष्ट',
    },
    tags: [
      { en: 'Riverfront View', hi: 'नदी का दृश्य', mr: 'नदीचे दृश्य' },
      { en: 'Luxury Suites', hi: 'लक्जरी सुइट', mr: 'लक्झरी सुट्स' },
      { en: 'Elevator', hi: 'लिफ्ट सुविधा', mr: 'लिफ्ट सोय' },
    ],
    imageUrl: '/images/lodging/bhavan_main.jpg',
    thumbnails: [
      '/images/lodging/bhavan_thumb_1.jpg',
      '/images/lodging/bhavan_thumb_2.jpg',
      '/images/lodging/bhavan_thumb_3.jpg',
    ],
    ratingScore: 9.3,
    ratingLabel: {
      en: 'Exceptional',
      hi: 'उत्कृष्ट',
      mr: 'अतिउत्कृष्ट',
    },
    starCount: 5,
    checklist: [
      { en: 'Panoramic Sacred Godavari River View', hi: 'पवित्र गोदावरी नदी का भव्य दृश्य', mr: 'पवित्र गोदावरी नदीचे विहंगम दृश्य' },
      { en: 'Grand Dining & Complimentary Breakfast', hi: 'शानदार भोजन एवं मानद नाश्ता', mr: 'भव्य जेवण व मोफत नाश्ता' },
      { en: 'Luxury AC Rooms with King Bed', hi: 'लक्जरी एसी कमरे व आरामदायक बेड', mr: 'लक्झरी एसी खोल्या व आरामदायी बेड' },
      { en: 'Valet Parking & 24/7 Security', hi: 'वैले पार्किंग एवं 24/7 सुरक्षा', mr: 'व्हॅलेट पार्किंग व २४/७ सुरक्षा' },
    ],
  },

  // ── RESTAURANTS / DINING (Standard Dining, Thali & Cafes) ─────────────────

  {
    id: 'ld-restaurant-1',
    listingType: 'restaurant',
    name: {
      en: 'Panchavati Heritage Thali Restaurant',
      hi: 'पंचवटी हेरिटेज थाली भोजनालय',
      mr: 'पंचवटी हेरिटेज थाळी भोजनालय',
    },
    description: {
      en: 'Traditional Maharashtrian vegetarian thali with unlimited refills, pitla bhakri, puran poli, and seasonal local delicacies served in hygienic family AC dining.',
      hi: 'असीमित भरपाई के साथ पारंपरिक महाराष्ट्रीय थाली, पिठला भाकरी एवं पूरनपोली।',
      mr: 'अमर्यादित रिफिलसह पारंपरिक महाराष्ट्रीय थाळी, पिठलं भाकरी व पुरणपोळी.',
    },
    coordinates: { lat: 20.0063, lng: 73.7920 },
    priceRange: 'budget',
    vegOnly: true,
    cuisineType: 'Maharashtrian Pure Veg',
    distance: {
      en: '300 m from Ramkund Ghat',
      hi: 'रामकुंड घाट से 300 मी',
      mr: 'रामकुंड घाटापासून 300 मी',
    },
    timing: {
      en: '11:00 AM – 4:00 PM • 7:00 PM – 10:30 PM',
      hi: 'सुबह 11:00 – शाम 4:00 • शाम 7:00 – रात 10:30',
      mr: 'सकाळी 11:00 – दुपारी 4:00 • संध्या 7:00 – रात्री 10:30',
    },
    rating: 4.8,
    reviewsCount: 420,
    priceDisplay: {
      en: '₹140 Unlimited Thali',
      hi: '₹140 असीमित थाली',
      mr: '₹140 अमर्यादित थाळी',
    },
    priceAmount: '₹140',
    priceSubtext: {
      en: 'per person / unlimited refills',
      hi: 'प्रति व्यक्ति / असीमित भोजन',
      mr: 'प्रति व्यक्ती / अमर्यादित भोजन',
    },
    tags: [
      { en: 'Pure Desi Ghee', hi: 'शुद्ध देसी घी', mr: 'शुद्ध देशी तूप' },
      { en: 'Unlimited Refills', hi: 'अनलिमिटेड भोजन', mr: 'अमर्यादित अन्न' },
      { en: 'AC Family Seating', hi: 'एसी पारिवारिक बैठक', mr: 'एसी कौटुंबिक बैठक' },
    ],
    imageUrl: '/images/dining/thali_pure_veg.jpg',
    thumbnails: [
      '/images/dining/thali_thumb_1.jpg',
      '/images/dining/thali_thumb_2.jpg',
      '/images/dining/thali_thumb_3.jpg',
    ],
    ratingScore: 9.1,
    ratingLabel: {
      en: 'Exceptional',
      hi: 'उत्कृष्ट',
      mr: 'अतिउत्कृष्ट',
    },
    starCount: 5,
    checklist: [
      { en: 'Unlimited Pure Desi Ghee Thali', hi: 'असीमित शुद्ध देसी घी थाली', mr: 'अमर्यादित शुद्ध देशी तूप थाळी' },
      { en: 'Air-Conditioned Family Dining', hi: 'वातानुकूलित पारिवारिक बैठक', mr: 'वातानुकूलित कौटुंबिक बैठक' },
      { en: '100% Pure Vegetarian Kitchen', hi: '100% शुद्ध शाकाहारी रसोई', mr: '100% शुद्ध शाकाहारी स्वयंपाकघर' },
      { en: 'Convenient 300m Walk from Ramkund', hi: 'रामकुंड से मात्र 300 मी पैदल दूरी', mr: 'रामकुंडापासून फक्त 300 मी पायी अंतर' },
    ],
  },

  {
    id: 'ld-restaurant-2',
    listingType: 'restaurant',
    name: {
      en: 'Shree Sai Godavari Pure Veg Dining',
      hi: 'श्री साई गोदावरी शुद्ध शाकाहारी भोजनालय',
      mr: 'श्री साई गोदावरी शुद्ध शाकाहारी भोजनालय',
    },
    description: {
      en: 'Popular multi-cuisine vegetarian restaurant offering North Indian curries, South Indian dosas, dal fry, fresh rotis, and thali meals for families.',
      hi: 'उत्तर भारतीय, दक्षिण भारतीय और थाली भोजन उपलब्ध कराने वाला लोकप्रिय शाकाहारी रेस्तरां।',
      mr: 'उत्तर भारतीय, दक्षिण भारतीय आणि थाळी देणारे प्रसिद्ध शाकाहारी रेस्टॉरंट.',
    },
    coordinates: { lat: 20.0105, lng: 73.7985 },
    priceRange: 'budget',
    vegOnly: true,
    cuisineType: 'Multi-Cuisine Pure Veg',
    distance: {
      en: '200 m from Tapovan Snan Ghat',
      hi: 'तपोवन स्नान घाट से 200 मी',
      mr: 'तपोवन स्नान घाटापासून 200 मी',
    },
    timing: {
      en: '7:00 AM – 11:00 PM',
      hi: 'सुबह 7:00 – रात 11:00',
      mr: 'सकाळी 7:00 – रात्री 11:00',
    },
    rating: 4.6,
    reviewsCount: 310,
    priceDisplay: {
      en: '₹220 for two',
      hi: '₹220 दो व्यक्तियों के लिए',
      mr: '₹220 दोन व्यक्तींसाठी',
    },
    priceAmount: '₹220',
    priceSubtext: {
      en: 'approx cost for two persons',
      hi: 'दो व्यक्तियों के लिए अनुमानित',
      mr: 'दोन व्यक्तींसाठी अंदाजे दर',
    },
    tags: [
      { en: 'Pure Veg', hi: 'शुद्ध शाकाहारी', mr: 'शुद्ध शाकाहारी' },
      { en: 'South Indian Breakfast', hi: 'दक्षिण भारतीय नाश्ता', mr: 'साऊथ इंडियन नाश्ता' },
      { en: 'Clean Restrooms', hi: 'स्वच्छ शौचालय', mr: 'स्वच्छ प्रसाधनगृह' },
    ],
    imageUrl: '/images/dining/dining_veg_main.jpg',
    thumbnails: [
      '/images/dining/dining_veg_thumb_1.jpg',
      '/images/dining/dining_veg_thumb_2.jpg',
      '/images/dining/dining_veg_thumb_3.jpg',
    ],
    ratingScore: 8.8,
    ratingLabel: {
      en: 'Very Good',
      hi: 'बहुत अच्छा',
      mr: 'खूप छान',
    },
    starCount: 4,
    checklist: [
      { en: 'Hot South Indian Breakfast from 7 AM', hi: 'सुबह 7 बजे से गरमागरम नाश्ता', mr: 'सकाळी 7 पासून गरमागरम नाश्ता' },
      { en: 'North Indian Meals & Thalis', hi: 'उत्तर भारतीय भोजन व थाली', mr: 'उत्तर भारतीय जेवण व थाळी' },
      { en: 'Clean Family Restrooms', hi: 'स्वच्छ पारिवारिक शौचालय', mr: 'स्वच्छ कौटुंबिक प्रसाधनगृह' },
      { en: 'Close to Tapovan Snan Ghat', hi: 'तपोवन स्नान घाट के निकट', mr: 'तपोवन स्नान घाटाजवळ' },
    ],
  },

  {
    id: 'ld-restaurant-3',
    listingType: 'restaurant',
    name: {
      en: 'Kumbh Marg Famous Misal & Chai House',
      hi: 'कुंभ मार्ग प्रसिद्ध मिसल एवं चाय हाउस',
      mr: 'कुंभ मार्ग प्रसिद्ध मिसळ व चहा हाऊस',
    },
    description: {
      en: 'Famous Nashik tarri misal pav, batata vada, and steaming masala chai. Quick service counter right beside the central pilgrim shuttle stop.',
      hi: 'प्रसिद्ध नासिक तरी मिसल पाव, गरमागरम वड़ा और मसाला चाय।',
      mr: 'प्रसिद्ध नाशिक तर्री मिसळ पाव, गरमागरम वडा आणि मसाला चहा.',
    },
    coordinates: { lat: 20.0031, lng: 73.7860 },
    priceRange: 'budget',
    vegOnly: true,
    cuisineType: 'Nashik Street Food',
    distance: {
      en: 'Adjacent to Kumbh Central Bus Bay',
      hi: 'कुंभ सेंट्रल बस स्टैंड के निकट',
      mr: 'कुंभ मध्यवर्ती बस स्थानकाजवळ',
    },
    timing: {
      en: '6:00 AM – 11:00 PM',
      hi: 'सुबह 6:00 – रात 11:00',
      mr: 'सकाळी 6:00 – रात्री 11:00',
    },
    rating: 4.6,
    reviewsCount: 230,
    priceDisplay: {
      en: '₹70 per person',
      hi: '₹70 प्रति व्यक्ति',
      mr: '₹70 प्रति व्यक्ती',
    },
    priceAmount: '₹70',
    priceSubtext: {
      en: 'per person / fast counter service',
      hi: 'प्रति व्यक्ति / त्वरित सेवा',
      mr: 'प्रति व्यक्ती / जलद सेवा',
    },
    tags: [
      { en: 'Famous Nashik Misal', hi: 'प्रसिद्ध नासिक मिसळ', mr: 'प्रसिद्ध नाशिक मिसळ' },
      { en: 'Quick Service', hi: 'त्वरित सेवा', mr: 'जलद सेवा' },
      { en: 'Fresh Masala Chai', hi: 'मसाला चाय', mr: 'गरमागरम चहा' },
    ],
    imageUrl: '/images/dining/misal_chai_main.jpg',
    thumbnails: [
      '/images/dining/misal_chai_thumb_1.jpg',
      '/images/dining/misal_chai_thumb_2.jpg',
      '/images/dining/misal_chai_thumb_3.jpg',
    ],
    ratingScore: 8.5,
    ratingLabel: {
      en: 'Very Good',
      hi: 'बहुत अच्छा',
      mr: 'खूप छान',
    },
    starCount: 4,
    checklist: [
      { en: 'Authentic Spicy Nashik Tarri Misal', hi: 'अस्ली मसालेदार नासिक मिसल', mr: 'अस्सल मसालेदार नाशिक मिसळ' },
      { en: 'Fast Counter Service & Parcel', hi: 'त्वरित काउंटर एवं पार्सल सेवा', mr: 'जलद काउंटर व पार्सल सेवा' },
      { en: 'Fresh Steaming Masala Chai', hi: 'ताज़ी गरमागरम मसाला चाय', mr: 'ताजा गरमागरम मसाला चहा' },
      { en: 'Convenient Bus Station Location', hi: 'बस स्टैंड के ठीक पास', mr: 'बस स्थानकाच्या अगदी जवळ' },
    ],
  },

  {
    id: 'ld-restaurant-4',
    listingType: 'restaurant',
    name: {
      en: 'Highway Sangam Family Dhaba',
      hi: 'हाईवे संगम फैमिली ढाबा',
      mr: 'हायवे संगम फॅमिली ढाबा',
    },
    description: {
      en: 'Spacious roadside dining hall serving freshly baked tandoori rotis, paneer specialties, dal fry, and north Indian dishes with ample group parking.',
      hi: 'तंदूरी रोटी, पनीर व्यंजन और उत्तर भारतीय भोजन उपलब्ध कराने वाला विशाल ढाबा।',
      mr: 'तंदूर रोटी, पनीर आणि उत्तर भारतीय जेवण देणारा मोठा ढाबा.',
    },
    coordinates: { lat: 20.0098, lng: 73.7948 },
    priceRange: 'mid',
    vegOnly: false,
    cuisineType: 'North Indian & Mughlai',
    distance: {
      en: '600 m from Main Highway Junction',
      hi: 'मुख्य हाईवे जंक्शन से 600 मी',
      mr: 'महामार्ग जंक्शनपासून 600 मी',
    },
    timing: {
      en: '10:00 AM – Midnight',
      hi: 'सुबह 10:00 – मध्यरात्रि',
      mr: 'सकाळी 10:00 – मध्यरात्र',
    },
    rating: 4.4,
    reviewsCount: 160,
    priceDisplay: {
      en: '₹280 for two',
      hi: '₹280 दो व्यक्तियों के लिए',
      mr: '₹280 दोन व्यक्तींसाठी',
    },
    priceAmount: '₹280',
    priceSubtext: {
      en: 'estimated cost for two persons',
      hi: 'दो व्यक्तियों के लिए अनुमानित',
      mr: 'दोन व्यक्तींसाठी अंदाजे दर',
    },
    tags: [
      { en: 'Tandoori Roti', hi: 'तंदूरी रोटी', mr: 'तंदूर रोटी' },
      { en: 'Group Seating', hi: 'बड़ी बैठक', mr: 'मोठी बैठक' },
    ],
    imageUrl: '/images/dining/dhaba_tandoor.jpg',
    thumbnails: [
      '/images/dining/dhaba_thumb_1.jpg',
      '/images/dining/dhaba_thumb_2.jpg',
      '/images/dining/dhaba_thumb_3.jpg',
    ],
    ratingScore: 8.3,
    ratingLabel: {
      en: 'Very Good',
      hi: 'बहुत अच्छा',
      mr: 'खूप छान',
    },
    starCount: 4,
    checklist: [
      { en: 'Fresh Tandoori Breads & Gravies', hi: 'ताज़ी तंदूरी रोटी एवं ग्रेवी', mr: 'ताजी तंदूर रोटी व ग्रेव्ही' },
      { en: 'Spacious Seating for Large Groups', hi: 'बड़े समूहों के लिए खुली बैठक', mr: 'मोठ्या समूहांसाठी प्रशस्त बैठक' },
      { en: 'Open Late Till Midnight', hi: 'देर रात तक खुला', mr: 'उशिरा रात्रीपर्यंत खुले' },
      { en: 'Ample Free Parking Beside Venue', hi: 'परिसर के पास सुलभ पार्किंग', mr: 'परिसराशेजारी सुलभ पार्किंग' },
    ],
  },
];
