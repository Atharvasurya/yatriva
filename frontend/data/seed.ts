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
    imageUrl: '/images/ghats/ramkund.jpg',
    youtubeVideoId: 'cZ57l8f_-pI',
    verified: true,
    tags: ['primary-snan', 'accessible', 'ramayana'],
    history: {
      en: 'Built in 1696 AD by Chitrao Khatarkar. Named after Lord Rama, who resided in Panchavati during his 14-year exile and performed the Asthi-Visarjan (immersion of ancestral ashes) of his father King Dasharatha here.',
      hi: '1696 ईस्वी में चित्रराव खटारकर द्वारा बनवाया गया था। इसका नाम भगवान राम के नाम पर रखा गया है, जिन्होंने अपने 14 वर्ष के वनवास के दौरान यहाँ अपने पिता महाराजा दशरथ का अस्थि-विसर्जन किया था।',
      mr: '१६९६ मध्ये चित्रराव खटारकर यांनी बांधले. वनवासात असताना श्रीरामाने आपले पिता राजा दशरथ यांचे अस्थिविसर्जन येथे केले होते म्हणून याला रामकुंड म्हणतात.',
    },
    importance: {
      en: 'The holy epicenter of the Kumbh Mela Shahi Snan in Nashik city. Devotees from around the world take a holy dip here to wash away sins and achieve spiritual salvation (Moksha).',
      hi: 'नाशिक शहर में कुंभ मेले के शाही स्नान का मुख्य केंद्र। माना जाता है कि यहाँ गोदावरी में डुबकी लगाने से सभी पाप नष्ट होते हैं और मोक्ष की प्राप्ति होती है।',
      mr: 'नाशिक कुंभमेळ्यातील शाही स्नानाचे मुख्य केंद्र. गोदावरी नदीच्या या पवित्र कुंडात स्नान केल्याने मोक्ष मिळतो अशी अढळ श्रद्धा आहे.',
    },
    highlights: {
      en: 'Asthi Visarjan Kund where bones dissolve naturally in sacred waters; Daily evening Godavari River Aarti; seat of Vaishnava Akhada processions.',
      hi: 'अस्थि विसर्जन कुंड; प्रतिदिन सायं गोदावरी महाआरती; वैष्णव अखाड़ा जुलूस का मुख्य केंद्र।',
      mr: 'अस्थि विसर्जन कुंड; दररोज सायंकाळी होणारी गोदावरी महाआरती; वैष्णव आखाड्यांचे स्नानाचे प्रमुख ठिकाण.',
    },
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
    imageUrl: '/images/ghats/kushavarta.jpg',
    youtubeVideoId: '9yP6Y7e6x0A',
    verified: true,
    tags: ['primary-snan', 'trimbakeshwar'],
    history: {
      en: 'Constructed in 1750 AD by Shrimant Rao Sahib Parnekar. Legend says Sage Gautama encircled the sacred River Godavari with Kusha (Darbha grass) to hold her holy waters at this spot.',
      hi: '1750 ईस्वी में श्रीमंत राव साहेब पारणेकर द्वारा निर्मित। पौराणिक मान्यता है कि महर्षि गौतम ने पवित्र गोदावरी को कुश (दूर्वा घास) से बांधकर इस कुंड में स्थापित किया था।',
      mr: '१७५० मध्ये श्रीमंत रावसाहेब पारणेकर यांनी बांधले. ऋषी गौतमांनी दर्भाच्या (कुश) साहाय्याने गोदावरीला येथे अडवले म्हणून यास कुशावर्त म्हणतात.',
    },
    importance: {
      en: 'Revered as the holy origin tank of the Godavari River. Principal bathing site for Sadhus, Mahants, and Shaiva Akhadas during Trimbakeshwar Kumbh Mela.',
      hi: 'गोदावरी नदी का पवित्र उद्गम कुंड। त्र्यंबकेश्वर कुंभ मेले के दौरान साधुओं, महंतुओं और शैव अखाड़ों के शाही स्नान का मुख्य स्थान।',
      mr: 'गोदावरी नदीचे पवित्र उगमस्थान. त्र्यंबकेश्वर कुंभमेळ्यात साधू, महंत व शैव आखाड्यांच्या शाही स्नानाचे मुख्य ठिकाण.',
    },
    highlights: {
      en: 'Square stone-carved water tank with carved stone steps on all 4 sides; direct heritage pathway leading to Trimbakeshwar Jyotirlinga Temple.',
      hi: 'चारों ओर नक्काशीदार पत्थरों से घिरा वर्ग कुंड; त्र्यंबकेश्वर ज्योतिर्लिंग मंदिर का सीधा मार्ग।',
      mr: 'चारही बाजूंनी कोरीव दगडांनी बांधलेला कुंड; त्र्यंबकेश्वर ज्योतिर्लिंग मंदिराचा मुख्य मार्ग.',
    },
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
      en: 'Historic bathing ghat on Godavari near Ramkund, named after Guru Gorakhnath of the Nath Sampradaya.',
      hi: 'रामकुंड के पास गोदावरी नदी पर ऐतिहासिक स्नान घाट, जिसका नाम नाथ संप्रदाय के गुरु गोरखनाथ के नाम पर रखा गया है।',
      mr: 'रामकुंड जवळील गोदावरी नदीवरील ऐतिहासिक स्नान घाट, ज्याचे नाव नाथ संप्रदायाच्या गुरू गोरखनाथ यांच्यावरून ठेवले गेले.',
    },
    riverName: 'Godavari',
    snanPriority: 2,
    imageUrl: '/images/ghats/gorakhkund.jpg',
    youtubeVideoId: '1qS7Vp3G7Q0',
    verified: true,
    tags: ['nath-sampradaya', 'panchvati'],
    history: {
      en: 'Established during the medieval era near Panchavati, where Mahayogi Guru Gorakhnath performed penance on the banks of River Godavari.',
      hi: 'मध्यकाल में पंचवटी के पास स्थापित, जहाँ महायोगी गुरु गोरखनाथ जी ने गोदावरी तट पर तपस्या की थी।',
      mr: 'मध्ययुगीन काळात पंचवटीजवळ स्थापन झालेले, जिथे महायोगी गुरु गोरखनाथ यांनी गोदावरी तीरावर तपश्चर्या केली होती.',
    },
    importance: {
      en: 'Highly venerated by Nath Sampradaya yogis and pilgrims seeking peaceful bathing close to the main Ramkund area.',
      hi: 'नाथ संप्रदाय के योगियों और श्रद्धालुओं द्वारा अत्यधिक पूजनीय, जो रामकुंड के पास शांत स्नान का अनुभव चाहते हैं।',
      mr: 'नाथ संप्रदायातील योगी व भाविकांसाठी अत्यंत पवित्र स्नान स्थान.',
    },
    highlights: {
      en: 'Picturesque stone stairs overlooking Godavari riverbed; peaceful atmosphere near Kapaleshwar Shiva temple.',
      hi: 'गोदावरी नदी के तट पर सुंदर पत्थर की सीढ़ियाँ; कपालेश्वर शिव मंदिर के निकट शांत वातावरण।',
      mr: 'गोदावरी पात्रातील सुंदर दगडी पायऱ्या; कपालेश्वर मंदिराच्या जवळील शांत परिसर.',
    },
  },
  {
    id: 'ghat-laxmankund',
    slug: 'laxmankund',
    category: 'ghat',
    name: {
      en: 'Laxman Kund Ghat',
      hi: 'लक्ष्मण कुंड घाट',
      mr: 'लक्ष्मण कुंड घाट',
    },
    coordinates: { lat: 19.9955, lng: 73.7882 },
    description: {
      en: 'Sacred ghat adjacent to Ramkund where Shri Laxmana performed morning ablutions during the Panchavati exile.',
      hi: 'रामकुंड के पास स्थित पवित्र घाट जहाँ श्री लक्ष्मण जी ने पंचवटी वनवास के दौरान सुबह का स्नान किया था।',
      mr: 'रामकुंडालगतचा पवित्र घाट जिथे श्री लक्ष्मणाने पंचवटी वनवासात नित्य स्नान केले होते.',
    },
    riverName: 'Godavari',
    snanPriority: 2,
    imageUrl: '/images/ghats/laxmankund.jpg',
    youtubeVideoId: '8_jX7e6x0A8',
    verified: true,
    tags: ['ramayana', 'panchvati'],
    history: {
      en: 'Associated with Shri Laxmana in the Ramayana. Restored during the Peshwa period to provide structured bathing access for pilgrims.',
      hi: 'रामायण काल में श्री लक्ष्मण जी से जुड़ा स्थान। पेशवा काल में तीर्थयात्रियों के स्नान हेतु व्यवस्थित घाट का निर्माण किया गया।',
      mr: 'रामायणात श्री लक्ष्मणाशी संबंधित स्थान. पेशवेकाळात भाविकांच्या स्नानासाठी याची पुनर्रचना करण्यात आली.',
    },
    importance: {
      en: 'Preferred by families for peaceful sacred ritual dips and tarpan (ancestral tribute) during Kumbh Mela.',
      hi: 'कुंभ मेले के दौरान परिवारों द्वारा शांतिपूर्ण स्नान और तर्पण अनुष्ठान हेतु विशेष रूप से चुना जाने वाला घाट।',
      mr: 'कुंभमेळ्यात कौटुंबिक स्नान व तर्पण विधीसाठी भाविकांचे आवडते ठिकाण.',
    },
    highlights: {
      en: 'Clean wide stone steps; direct walking access to Ramkund and Kalaram Temple.',
      hi: 'चौड़ी पत्थर की सीढ़ियाँ; रामकुंड और काळाराम मंदिर का सीधा मार्ग।',
      mr: 'रुंद दगडी पायऱ्या; रामकुंड व काळाराम मंदिराकडे जाणारा सुलभ मार्ग.',
    },
  },
  {
    id: 'ghat-ahilyaghat',
    slug: 'ahilyaghat',
    category: 'ghat',
    name: {
      en: 'Ahilya Ramkund Ghat',
      hi: 'अहिल्या रामकुंड घाट',
      mr: 'अहिल्या रामकुंड घाट',
    },
    coordinates: { lat: 19.9968, lng: 73.7891 },
    description: {
      en: 'Historic bathing ghat commissioned by Maharani Ahilyabai Holkar of Indore on the banks of Godavari.',
      hi: 'इंदौर की महारानी अहिल्याबाई होल्कर द्वारा गोदावरी नदी के तट पर निर्मित ऐतिहासिक स्नान घाट।',
      mr: 'इंदूरच्या महाराणी अहिल्याबाई होळकर यांनी गोदावरी तीरावर बांधलेला ऐतिहासिक स्नान घाट.',
    },
    riverName: 'Godavari',
    snanPriority: 2,
    imageUrl: '/images/ghats/ahilyaghat.jpg',
    youtubeVideoId: 's5z_Nn7-x2w',
    verified: true,
    tags: ['holkar-heritage', 'panchvati'],
    history: {
      en: 'Commissioned in the 18th century by the legendary Maratha ruler Maharani Ahilyabai Holkar as part of her nationwide temple and riverfront revitalization campaign.',
      hi: '18वीं शताब्दी में महान मराठा शासक महारानी अहिल्याबाई होल्कर द्वारा भारतभर के तीर्थों के पुनरुद्धार अभियान के अंतर्गत बनवाया गया था।',
      mr: '१८व्या शतकात पुण्यश्लोक महाराणी अहिल्याबाई होळकर यांनी देशभरातील तीर्थक्षेत्रांच्या जीर्णोद्धार मोहिमेचा भाग म्हणून बांधले.',
    },
    importance: {
      en: 'A testament to Holkar Maratha architecture, offering safe and spacious bathing steps for large crowds of pilgrims during Kumbh.',
      hi: 'होल्कर मराठा वास्तुकला की मिसाल, जो कुंभ के दौरान श्रद्धालुओं की भारी भीड़ के लिए सुरक्षित स्नान की सुविधा प्रदान करता है।',
      mr: 'होळकरकालीन मराठा स्थापत्यशैलीचा उत्कृष्ट नमुना, कुंभमेळ्यात गर्दीच्या नियंत्रणासाठी अत्यंत उपयुक्त.',
    },
    highlights: {
      en: 'Massive stone masonry; wide safety railings; historical Holkar inscription pillars.',
      hi: 'विशाल पत्थर की संरचना; सुरक्षा रेलिंग; ऐतिहासिक होल्कर शिलालेख।',
      mr: 'भव्य दगडी बांधकाम; सुरक्षित रेलिंगची सोय; ऐतिहासिक माहिती स्तंभ.',
    },
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
      mr: 'त्र्यंबkeश्वर शिव मंदिर',
    },
    coordinates: { lat: 19.9325, lng: 73.5306 },
    description: {
      en: 'One of the twelve Jyotirlinga shrines of Lord Shiva. Located ~28 km from Nashik city. Principal temple of the Kumbh Mela.',
      hi: 'भगवान शिव के बारह ज्योतिर्लिंगों में से एक। नाशिक शहर से लगभग 28 किमी दूर। कुंभ मेले का प्रमुख मंदिर।',
      mr: 'भगवान शिवाच्या बारा ज्योतिर्लिंगांपैकी एक. नाशिक शहरापासून सुमारे 28 किमी. कुंभ मेळ्याचे मुख्य मंदिर.',
    },
    deity: 'Shiva (Trimbakeshwar)',
    timingsEn: '5:30 AM – 9:00 PM',
    imageUrl: '/images/temples/trimbakeshwar.jpg',
    youtubeVideoId: 'cZ57l8f_-pI',
    verified: true,
    tags: ['jyotirlinga', 'principal-kumbh-site'],
    history: {
      en: 'Reconstructed between 1755 and 1786 AD by Peshwa Balaji Baji Rao (Nana Saheb) using black basalt stone carved by master artisans over 31 years at a cost of 16 lakh rupees. The ancient site has been a major pilgrimage hub since Vedic antiquity.',
      hi: 'पेशवा बालाजी बाजीराव (नाना साहब) द्वारा 1755 से 1786 ईस्वी के बीच काले बेसाल्ट पत्थर से 31 वर्षों के कठोर परिश्रम के बाद बनवाया गया था। यह स्थान वैदिक काल से ही शिव साधना का प्रमुख केंद्र रहा है।',
      mr: 'पेशवे बालाजी बाजीराव (नानासाहेब) यांनी १७५५ ते १७८६ दरम्यान काळ्या दगडांमध्ये ३१ वर्षांच्या कालावधीत बांधले. वैदिक काळापासून हे स्थान अत्यंत पवित्र मानले जाते.',
    },
    importance: {
      en: 'Unique among all 12 Jyotirlingas because the sacred Linga embodies the Holy Trinity—Brahma, Vishnu, and Maheshvara. Kushavarta Kund located nearby is the revered holy origin site of River Godavari.',
      hi: 'यह सभी 12 ज्योतिर्लिंगों में अद्वितीय है क्योंकि यहाँ शिवलिंग में त्रिदेव—ब्रह्मा, विष्णु और महेश तीन रूपों में विराजमान हैं। पास ही स्थित कुशावर्त कुंड गोदावरी नदी का पवित्र उद्गम माना जाता है।',
      mr: 'हे १२ ज्योतिर्लिंगांपैकी एकमेव असे मंदिर आहे जेथे ब्रह्मा, विष्णू आणि महेश या तीन देवांचे त्रिमुख लिंग आहे. जवळच असलेला कुशावर्त कुंड हा गोदावरीचा उगम मानला जातो.',
    },
    highlights: {
      en: 'Principal seat of Shaiva Akhadas for Shahi Snan during Kumbh Mela; Golden crown studded with diamonds displayed every Monday between 4:00 PM and 5:00 PM.',
      hi: 'कुंभ मेले के शाही स्नान का मुख्य केंद्र; प्रति सोमवार शाम 4 से 5 बजे के बीच हीरों से जड़ा स्वर्ण मुकुट दर्शन हेतु रखा जाता है।',
      mr: 'कुंभमेळ्यातील शाही स्नानाचे प्रमुख केंद्र; दर सोमवारी दुपारी ४ ते ५ दरम्यान हिरे जडित सुवर्ण मुकुटाचे दर्शन घडते.',
    },
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
    timingsEn: '5:00 AM – 10:00 PM',
    imageUrl: '/images/temples/kalaram.jpg',
    youtubeVideoId: '1qS7Vp3G7Q0',
    verified: true,
    tags: ['panchvati', 'historic'],
    history: {
      en: 'Built in 1782 AD by Sardar Rangarao Odhekar after dreaming of a black idol of Lord Rama submerged in the Godavari River. Over 2,000 artisans worked for 12 years to construct this 70-foot tall architectural masterpiece using black basalt stone.',
      hi: '1782 ईस्वी में सरदार रंगराव ओढेकर द्वारा गोदावरी नदी में भगवान राम की मूर्ति का स्वप्न देखने के बाद बनवाया गया था। 2000 से अधिक कारीगरों ने 12 वर्षों तक 70 फीट ऊंचे मंदिर का निर्माण किया।',
      mr: '१७८२ मध्ये गोदावरी नदीतील राममूर्तीचा दृष्टांत झाल्यानंतर सरदार रंगराव ओढेकर यांनी बांधले. २०00 कारागिरांनी १२ वर्षे मेहनत करून ७० फूट उंच भव्य दगडी मंदिर उभारले.',
    },
    importance: {
      en: 'Houses 2-foot tall idols of Lord Rama, Sita, and Lakshmana carved out of rare black stone. Famous historical site of the 1930 Temple Entry Movement led by Bharat Ratna Dr. B.R. Ambedkar.',
      hi: 'दुर्लभ काले पत्थर से तराशी गई भगवान राम, माता सीता और लक्ष्मण जी की मूर्तियां स्थित हैं। यह 1930 में डॉ. बी.आर. आंबेडकर द्वारा चलाए गए ऐतिहासिक मंदिर प्रवेश सत्याग्रह का स्थान है।',
      mr: 'काळ्या दगडात कोरलेल्या श्रीराम, सीता व लक्ष्मणाच्या मूर्ती आहेत. डॉ. बाबासाहेब आंबेडकर यांच्या १९३० मधील ऐतिहासिक सत्याग्रहाची ही कर्मभूमी आहे.',
    },
    highlights: {
      en: '14-foot gold-plated pinnacle (Kalash); 40 intricately carved arches in the courtyard; Ram Navami grand Rath Yatra procession.',
      hi: '14 फीट ऊंचा स्वर्णमंडित कलश; 40 नक्काशीदार मेहराबदार विशाल प्रांगण; राम नवमी की प्रसिद्ध रथयात्रा।',
      mr: '१४ फूट उंच सुवर्ण कलश; ४० कोरीव कमानींचे प्रांगण; रामनवमीची भव्य पारंपरिक रथयात्रा.',
    },
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
      en: 'An important Shakti Peetha located on a mountain peak ~65 km from Nashik, featuring 510 steps and a funicular ropeway.',
      hi: 'नाशिक से लगभग 65 किमी दूर एक पर्वत शिखर पर स्थित एक महत्वपूर्ण शक्तिपीठ, जिसमें 510 सीढ़ियां और रोप-वे की सुविधा है।',
      mr: 'नाशिकपासून सुमारे 65 किमी अंतरावर डोंगरमाथ्यावर असलेले महत्त्वाचे शक्तीपीठ, ५१० पायऱ्या व रोप-वे सुविधा.',
    },
    deity: 'Saptashringi Nivasini Devi',
    timingsEn: '6:00 AM – 8:00 PM',
    imageUrl: '/images/temples/saptashringi.jpg',
    youtubeVideoId: '3Rk2H1z8_1Q',
    verified: true,
    tags: ['shakti-peetha', 'day-trip'],
    history: {
      en: 'Vedic shrine referenced in Ramayana and Mahabharata. Nestled among 7 mountain peaks ("Saptashrungi") at 4,659 feet altitude in Vani village near Nashik.',
      hi: 'रामायण और महाभारत में वर्णित प्राचीन वैदिक पीठ। नाशिक के पास वणी गांव में 4,659 फीट की ऊंचाई पर 7 पर्वत शिखरों (सप्तश्रृंग) के बीच स्थित।',
      mr: 'रामायण व महाभारतात उल्लेख असलेले अतिप्राचीन शक्तीपीठ. नाशिकजवळील वणी येथे ४,६५९ फूट उंचीवर ७ शिखरांच्या कुशीत वसलेले.',
    },
    importance: {
      en: 'Counted among 51 sacred Shakti Peethas where Goddess Sati’s right arm fell. The 10-foot tall idol of Goddess Saptashringi is self-manifested (Swayambhu) with 18 arms holding divine weapons.',
      hi: '51 शक्तिपीठों में से एक जहाँ सती की दाहिनी भुजा गिरी थी। 10 फीट ऊंची महाकाली/महालक्ष्मी की मूर्ति स्वयंभू है और उनकी 18 भुजाओं में दिव्य अस्त्र सुसज्जित हैं।',
      mr: '५१ शक्तीपीठांपैकी एक जिथे सतीचा उजवा हात पडला होता. १० फूट उंच अष्टादशभुजा (१८ हात) असलेली देवीची स्वयंभू मूर्ती सिंदूरचर्चित आहे.',
    },
    highlights: {
      en: '510 stone mountain steps; modern funicular ropeway transit; Navratri and Chaitra Purnima mega pilgrimage fairs.',
      hi: '510 पर्वतीय सीढ़ियाँ; आधुनिक फनिक्युलर रोप-वे यात्रा; नवरात्रि एवं चैत्र पूर्णिमा का विशाल मेला।',
      mr: '५१० पायऱ्यांचा डोंगर मार्ग; आधुनिक फनिकलर रोप-वे सुविधा; नवरात्र व चैत्र पौर्णिमेचा मोठा उत्सव.',
    },
  },
  {
    id: 'temple-muktidham',
    slug: 'muktidham',
    category: 'temple',
    name: {
      en: 'Muktidham Temple',
      hi: 'मुक्तिधाम मंदिर',
      mr: 'मुक्तिधाम मंदिर',
    },
    coordinates: { lat: 19.9531, lng: 73.8276 },
    description: {
      en: 'Renowned temple complex built with pure Rajasthan Makrana white marble, featuring replicas of 12 Jyotirlingas and 18 chapters of Bhagavad Gita inscribed on walls.',
      hi: 'शुद्ध राजस्थान मकराना सफेद संगमरमर से निर्मित प्रसिद्ध मंदिर परिसर, जिसमें 12 ज्योतिर्लिंगों की प्रतिकृतियां और दीवारों पर भगवद गीता के 18 अध्याय उकेरे गए हैं।',
      mr: 'राजस्थान मकराना पांढऱ्या संगमरवरामध्ये बांधलेले प्रसिद्ध मंदिर संकुल, ज्यामध्ये १२ ज्योतिर्लिंगांच्या प्रतिकृती आणि भिंतींवर भगवद्गीतेचे १८ अध्याय कोरलेले आहेत.',
    },
    deity: '12 Jyotirlingas & Bhagavad Gita',
    timingsEn: '6:00 AM – 7:00 PM',
    imageUrl: '/images/temples/muktidham.jpg',
    youtubeVideoId: 'W4QZ_6P8X8A',
    verified: true,
    tags: ['nashik-road', 'white-marble'],
    history: {
      en: 'Established in 1971 AD by industrialist and philanthropist Seth J.D. Chauhan Bytco to create a single spiritual destination representing India’s core sacred shrines.',
      hi: '1971 में उद्योगपति और समाजसेवी सेठ जे.डी. चौहान बायटको द्वारा भारत के सभी पवित्र तीर्थों का एक स्थान पर दर्शन कराने हेतु निर्मित किया गया था।',
      mr: '१९७१ मध्ये उद्योगपती सेठ जे.डी. चौहान बायटको यांनी भारतातील सर्व प्रमुख ज्योतिर्लिंगांचे एकाच ठिकाणी दर्शन व्हावे या उद्देशाने बांधले.',
    },
    importance: {
      en: 'Contains exact architectural replicas of all 12 Jyotirlingas of India, allowing elderly and devout pilgrims to pay homage to all 12 Jyotirlingas under one roof.',
      hi: 'भारत के सभी 12 ज्योतिर्लिंगों की हूबहू प्रतिकृतियां स्थापित हैं, जिससे श्रद्धालु एक ही स्थान पर 12 ज्योतिर्लिंगों का पुण्य लाभ ले सकते हैं।',
      mr: 'भारतातील सर्व १२ ज्योतिर्लिंगांच्या हुबेहूब प्रतिकृती येथे आहेत, ज्यामुळे भाविकांना एकाच छताखाली सर्व ज्योतिर्लिंगांचे दर्शन घडते.',
    },
    highlights: {
      en: 'All 18 chapters of the Srimad Bhagavad Gita engraved in Sanskrit on pure white Makrana marble walls; Krishna Janmashtami celebrations.',
      hi: 'श्रीमद्भगवद्गीता के सभी 18 अध्याय मकराना संगमरमर की दीवारों पर संस्कृत में उकेरे गए हैं; कृष्ण जन्माष्टमी का विशेष उत्सव।',
      mr: 'श्रीमद्भगवद्गीतेचे १८ अध्याय भिंतींवर संस्कृतमध्ये कोरलेले आहेत; पांढऱ्या संगमरवराचे अप्रतिम काम.',
    },
  },
  {
    id: 'temple-kapaleshwar',
    slug: 'kapaleshwar',
    category: 'temple',
    name: {
      en: 'Kapaleshwar Mahadev Temple',
      hi: 'कपालेश्वर महादेव मंदिर',
      mr: 'कपालेश्वर महादेव मंदिर',
    },
    coordinates: { lat: 19.9960, lng: 73.7890 },
    description: {
      en: 'Ancient Shiva temple near Ramkund in Panchavati. Unique among Shiva shrines as Nandi is absent because Shiva accepted Nandi as his Guru here.',
      hi: 'पंचवटी में रामकुंड के पास प्राचीन शिव मंदिर। शिव मंदिरों में अद्वितीय क्योंकि यहाँ नंदी अनुपस्थित हैं क्योंकि शिवजी ने यहाँ नंदी को अपना गुरु माना था।',
      mr: 'पंचवटीतील रामकुंड जवळील प्राचीन शिव मंदिर. शिवांनी येथे नंदींना आपले गुरू मानल्यामुळे नंदी नसलेले दुर्मिळ मंदिर.',
    },
    deity: 'Shiva (Kapaleshwar)',
    timingsEn: '5:00 AM – 9:00 PM',
    imageUrl: '/images/temples/kapaleshwar.jpg',
    youtubeVideoId: 'K1xP0_jK5n0',
    verified: true,
    tags: ['panchvati', 'historic-shiva'],
    history: {
      en: 'One of the oldest documented temples in Nashik, restored during Maratha rule near Ramkund Ghat on the banks of Godavari River.',
      hi: 'नाशिक के सबसे प्राचीन शिव मंदिरों में से एक, जिसका मराठा शासनकाल के दौरान रामकुंड घाट के पास जीर्णोद्धार किया गया था।',
      mr: 'नाशिकमधील सर्वात जुन्या मंदिरांपैकी एक. मराठा काळात गोदावरी नदीकाठी रामकुंड जवळ याचा जीर्णोद्धार झाला.',
    },
    importance: {
      en: 'World-unique Shiva temple where Nandi is absent. According to mythology, Lord Shiva accidentally committed Brahma-hatya and Nandi guided him to bathe at Ramkund to absolve the sin. Shiva honoured Nandi as his Guru, so Nandi is not seated facing Shiva here.',
      hi: 'विश्व का दुर्लभ शिव मंदिर जहाँ नंदी की मूर्ति नहीं है। पौराणिक कथा के अनुसार शिवजी पर लगे ब्रह्महत्या के पाप का निवारण नंदी के मार्गदर्शन से रामकुंड स्नान से हुआ; अतः शिवजी ने नंदी को अपना गुरु माना।',
      mr: 'नंदी नसलेले जगातील एकमेव शिव मंदिर. ब्रह्महत्येच्या पापातून मुक्ती मिळवण्यासाठी नंदीने शंकराला रामकुंडाचा मार्ग दाखवला. शंकराने नंदीला गुरू मानल्याने येथे नंदीची मूर्ती नाही.',
    },
    highlights: {
      en: 'Overlooking Ramkund Ghat; Mahashivratri night vigil; traditional brass deepstambhas (lamp towers).',
      hi: 'रामकुंड घाट का विहंगम दृश्य; महाशिवरात्रि का रात्रि जागरण; पीतल के प्राचीन दीपस्तंभ।',
      mr: 'रामकुंड घाटाचे दृश्य; महाशिवरात्रीचा भव्य उत्सव; पारंपरिक दीपस्तंभ.',
    },
  },
  {
    id: 'temple-someshwar',
    slug: 'someshwar',
    category: 'temple',
    name: {
      en: 'Someshwar Shiva Temple',
      hi: 'सोमेश्वर शिव मंदिर',
      mr: 'सोमेश्वर शिव मंदिर',
    },
    coordinates: { lat: 20.0210, lng: 73.7375 },
    description: {
      en: 'Picturesque temple of Lord Shiva located on the serene banks of Godavari River in Gangapur, surrounded by greenery and a small scenic waterfall.',
      hi: 'गंगापुर में गोदावरी नदी के शांत तट पर स्थित भगवान शिव का सुरम्य मंदिर, जो हरियाली और एक छोटे सुंदर झरने से घिरा हुआ है।',
      mr: 'गंगापूर येथे गोदावरी नदीच्या शांत तीरावर वसलेले भगवान शिवाचे निसर्गरम्य मंदिर, हिरवळ आणि धबधब्याने वेढलेले.',
    },
    deity: 'Shiva (Someshwar)',
    timingsEn: '6:00 AM – 8:00 PM',
    imageUrl: '/images/temples/someshwar.jpg',
    youtubeVideoId: 'e8X3X1W4N3E',
    verified: true,
    tags: ['riverfront', 'scenic'],
    history: {
      en: 'Ancient riverfront temple rebuilt during Maratha rule in Gangapur (~7 km from Nashik city center). Named after King Someshwar who offered prayers here.',
      hi: 'गंगापुर (नाशिक शहर से 7 किमी) में गोदावरी नदी के तट पर मराठा काल का ऐतिहासिक शिव मंदिर, जिसका नाम राजा सोमेश्वर के नाम पर पड़ा।',
      mr: 'नाशिक शहरापासून ७ किमी अंतरावर गंगापूर येथे गोदावरी नदीकाठी वसलेले प्राचीन शिव मंदिर, ज्याचे नाव राजा सोमेश्वरवरून ठेवले गेले.',
    },
    importance: {
      en: 'Situated at the peaceful confluence of Godavari and Someshwari rivers; revered as a nature-blessed spiritual sanctuary for meditation.',
      hi: 'गोदावरी और सोमेश्वरी नदियों के संगम पर स्थित; प्राकृतिक वातावरण में ध्यान और शांति का प्रमुख स्थान।',
      mr: 'गोदावरी नदीच्या निसर्गरम्य घाटावर वसलेले; शांतता आणि ध्यानासाठी प्रसिद्ध.',
    },
    highlights: {
      en: 'Lush green trees along river ghats; Dudhsagar waterfalls nearby; river boating for pilgrims.',
      hi: 'नदी घाट के आसपास प्राकृतिक सौंदर्य; पास ही दूधसागर झरना; बोटिंग की सुविधा।',
      mr: 'नदीकाठावरील हिरवळ; जवळच दूधसागर धबधबा; नौकाविहाराची सुविधा.',
    },
  },
  {
    id: 'temple-navshya-ganpati',
    slug: 'navshya-ganpati',
    category: 'temple',
    name: {
      en: 'Navshya Ganpati Temple',
      hi: 'नवश्या गणपती मंदिर',
      mr: 'नवश्या गणपती मंदिर',
    },
    coordinates: { lat: 20.0090, lng: 73.7630 },
    description: {
      en: 'Historic 300+ year old Lord Ganesha temple established during Raghunathrao Peshwa era on the Godavari banks in Anandvalli, Nashik.',
      hi: 'आनंदवल्ली नाशिक में गोदावरी के तट पर रघुनाथराव पेशवा काल के दौरान स्थापित 300 से अधिक वर्ष पुराना ऐतिहासिक भगवान गणेश मंदिर।',
      mr: 'आनंदवल्ली नाशिक येथील गोदावरी तीरावर रघुनाथराव पेशवे यांच्या काळात स्थापन झालेले ३०० हून अधिक वर्षे जुने ऐतिहासिक गणेश मंदिर.',
    },
    deity: 'Ganesha (Navshya)',
    timingsEn: '5:30 AM – 9:30 PM',
    imageUrl: '/images/temples/navshya_ganpati.jpg',
    youtubeVideoId: 's5z_Nn7-x2w',
    verified: true,
    tags: ['ganesha', 'historic-peshwa'],
    history: {
      en: 'Established in 1774 AD by Raghunathrao Peshwa and his wife Anandibai in the village of Anandvalli on the Godavari banks.',
      hi: '1774 ईस्वी में रघुनाथराव पेशवा और उनकी पत्नी आनंदीबाई द्वारा गोदावरी तट पर आनंदवल्ली में स्थापित किया गया था।',
      mr: '१७७४ मध्ये रघुनाथराव पेशवे व त्यांच्या पत्नी आनंदीबाई यांनी आनंदवल्ली येथे गोदावरी नदीकाठी स्थापन केले.',
    },
    importance: {
      en: '"Navshya" derives from "Navas" (sacred vow). Devotees believe that Ganesha here fulfills all earnest prayers and vows.',
      hi: '"नवश्या" का अर्थ है "मन्नत पूरी करने वाले"। मान्यता है कि यहाँ श्रद्धापूर्वक मांगी गई हर मन्नत गणेश जी पूरी करते हैं।',
      mr: '"नवश्या" म्हणजे "नवसाला पावणारा". येथील गणपती भाविकांच्या सर्व मनोकामना व नवस पूर्ण करतो अशी असीम श्रद्धा आहे.',
    },
    highlights: {
      en: 'Historic Peshwa Maratha archways; 10-day Ganesh Chaturthi grand festival; serene Godavari riverfront steps.',
      hi: 'पेशवाकालीन मराठा वास्तुकला; 10 दिवसीय गणेशोत्सव का भव्य आयोजन; गोदावरी घाट।',
      mr: 'पेशवेकालीन वास्तुशैली; १० दिवसांचा मोठा गणेशोत्सव; गोदावरी नदीचा सुंदर परिसर.',
    },
  },
  {
    id: 'temple-sita-gufa',
    slug: 'sita-gufa',
    cultureSlug: 'panchavati',
    category: 'temple',
    name: {
      en: 'Sita Gufa (Panchavati)',
      hi: 'सीता गुफा (पंचवटी)',
      mr: 'सीता गुंफा (पंचवटी)',
    },
    coordinates: { lat: 19.9940, lng: 73.7880 },
    description: {
      en: 'Sacred cave complex near Kalaram temple where Goddess Sita stayed during Panchavati exile and from where Ravana abducted her. Surrounded by five ancient banyan trees.',
      hi: 'काळाराम मंदिर के पास पवित्र गुफा परिसर जहाँ पंचवटी वनवास के दौरान देवी सीता ठहरी थीं और जहाँ से रावण ने उनका अपहरण किया था। पांच प्राचीन बरगद के पेड़ों से घिरा हुआ।',
      mr: 'काळाराम मंदिराजवळील पवित्र गुंफा जेथे पंचवटी वनवासात सीतामाता राहिल्या होत्या आणि जेथून रावणाने अपहरण केले होते. ५ प्राचीन वटवृक्षांनी वेढलेले.',
    },
    deity: 'Sita, Rama & Lakshmana',
    timingsEn: '6:00 AM – 7:30 PM',
    imageUrl: '/images/temples/sita_gufa.jpg',
    youtubeVideoId: 'v8_7mG1YwF8',
    verified: true,
    tags: ['ramayana', 'panchvati'],
    history: {
      en: 'Sacred Ramayana site located in Panchavati near Kalaram Temple. Preserves the natural underground cave where Lord Rama, Goddess Sita, and Lakshmana lived in exile in the Dandakaranya forest.',
      hi: 'पंचवटी में काळाराम मंदिर के पास रामायण कालीन पवित्र स्थल। दण्डकारण्य वनवास के दौरान भगवान राम, माता सीता और लक्ष्मण द्वारा प्रयुक्त प्राकृतिक भूमिगत गुफा।',
      mr: 'पंचवटीतील काळाराम मंदिराजवळील रामायणकालीन स्थान. वनवासात श्रीराम, सीता व लक्ष्मण राहत असलेली भूगर्भीय गुंफा.',
    },
    importance: {
      en: 'Famous epicenter of the Ramayana epic—the exact spot from where Demon King Ravana deceived Sita and abducted her. Surrounded by five massive ancient Banyan trees (Panchavati).',
      hi: 'रामायण महाकाव्य का प्रमुख केंद्र—वही स्थान जहाँ से रावण ने माता सीता का हरण किया था। 5 विशाल बरगद के वृक्षों (पंचवटी) से आच्छादित।',
      mr: 'रामायणातील महानाट्याचे केंद्र—जिथून रावणाने सीतामातेचे अपहरण केले. ५ प्राचीन वटवृक्षांनी (पंचवटी) वेढलेली पवित्र भूमी.',
    },
    highlights: {
      en: 'Narrow underground stone staircase leading to ancient idols of Lord Rama, Sita, Lakshmana, and a Shiva Linga worshipped by Sita.',
      hi: 'भूमिगत संकरी सीढ़ियों से नीचे स्थित प्राचीन राम-सीता-लक्ष्मण की मूर्तियां और माता सीता द्वारा पूजित शिवलिंग।',
      mr: 'गुंफेतील अरुंद पायऱ्यांखालील श्रीराम-सीता-लक्ष्मण मूर्ती आणि सीतामातेने पूजलेले प्राचीन शिवलिंग.',
    },
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
