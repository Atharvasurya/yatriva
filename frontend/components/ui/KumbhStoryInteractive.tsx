'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Droplets,
  Sun,
  Landmark,
  Flag,
  Star,
  ShieldCheck,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  X,
  Layers,
} from 'lucide-react';

/* ─── Story Chapter Types ─────────────────────────────────────────────────── */

interface StoryChapter {
  id: string;
  tabTitle: { en: string; hi: string; mr: string };
  timelineTitle: { en: string; hi: string; mr: string };
  title: { en: string; hi: string; mr: string };
  tagline: { en: string; hi: string; mr: string };
  narrative: { en: string; hi: string; mr: string };
  bulletPoints: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  bulletDetail?: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  highlightFact: { en: string; hi: string; mr: string };
  imageSrc: string;
  imageAlt: string;
  imageSource: string;
  imageBadge: string;
  imageCaption: { en: string; hi: string; mr: string };
  icon: typeof Droplets;
  accentColor: string;
  accentColorLight: string;
  borderColor: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'samudra-manthan',
    tabTitle: { en: 'Samudra Manthan', hi: 'समुद्र मंथन', mr: 'समुद्र मंथन' },
    timelineTitle: { en: 'Cosmic Churning', hi: 'क्षीरसागर मंथन', mr: 'समुद्र मंथन' },
    title: {
      en: 'The Cosmic Churning & 4 Drops of Amrita',
      hi: 'समुद्र मंथन और अमृत की चार दिव्य बूंदें',
      mr: 'समुद्र मंथन आणि अमृताचे चार दिव्य थेंब',
    },
    tagline: {
      en: "The Divine Origin of the World's Greatest Spiritual Gathering",
      hi: 'विश्व के सबसे बड़े धार्मिक समागम की पौराणिक उत्पत्ति',
      mr: 'जगातील सर्वात मोठ्या आध्यात्मिक मेळाव्याची पौराणिक उत्पत्ती',
    },
    imageSrc: '/images/samudra-manthan-historic.webp',
    imageAlt: 'Historic Sagar Manthan (Churning of the Cosmic Ocean) Painting, circa 1820',
    imageSource: 'Wikimedia Commons / South Indian Painting (circa 1820, Public Domain)',
    imageBadge: 'Amrita Kumbha',
    imageCaption: {
      en: 'Samudra Manthan: Mount Mandara & Vasuki Serpent — Churning of the Cosmic Ocean of Milk',
      hi: 'समुद्र मंथन: मंदराचल पर्वत और वासुकी नाग द्वारा क्षीरसागर का दिव्य मंथन',
      mr: 'समुद्र मंथन: मंदराचल पर्वत आणि वासुकी नागाच्या सहाय्याने क्षीरसागराचे मंथन',
    },
    narrative: {
      en: 'According to Hindu Puranas, the Devas (gods) and Asuras (demons) churned the cosmic ocean of milk (Kshira Sagara) using Mount Mandara as the rod and serpent Vasuki as the rope to obtain the nectar of immortality (Amrita). When Lord Dhanvantari emerged holding the golden pot (Kumbha) of Amrita, a celestial pursuit ensued across the cosmos.',
      hi: 'हिंदू पुराणों के अनुसार, देवताओं और दानवों ने अमरता का अमृत पाने के लिए मंदराचल पर्वत और वासुकी नाग की सहायता से क्षीरसागर का मंथन किया। जब भगवान धन्वंतरि अमृत का स्वर्ण कुंभ (कलश) लेकर प्रकट हुए, तो अमृत पाने के लिए देवताओं और असुरों के बीच संघर्ष हुआ।',
      mr: 'हिंदू पुराणांनुसार, देव आणि दानवांनी अमृताच्या प्राप्तीसाठी मंदराचल पर्वत आणि वासुकी नागाच्या सहाय्याने क्षीरसागराचे मंथन केले. जेव्हा भगवान धन्वंतरी अमृताचा सुवर्ण कुंभ घेऊन प्रकट झाले, तेव्हा अमृत मिळवण्यासाठी देव-दानवांमध्ये संघर्ष सुरू झाला.',
    },
    bulletPoints: {
      en: [
        "Lord Vishnu's celestial vehicle Garuda flew with the Amrita Kumbha for 12 divine days (= 12 human earthly years).",
        'During the aerial pursuit, exactly 4 drops of divine Amrita fell upon 4 sacred riverbanks on Earth.',
        'The 4 sacred Kumbh sites are Nashik (Godavari), Ujjain (Shipra), Haridwar (Ganga), and Prayagraj (Triveni Sangam).',
        'Bathing in the sacred Godavari during Kumbh is revered as purifying generations of karmic debt.',
      ],
      hi: [
        'भगवान विष्णु के वाहन गरुड़ जी अमृत कुंभ को लेकर 12 दिव्य दिनों (पृथ्वी के 12 मानव वर्ष) तक उड़े।',
        'इस यात्रा के दौरान पृथ्वी पर 4 पवित्र नदी तटों पर अमृत की दिव्य बूंदें गिरीं।',
        'ये 4 पवित्र कुंभ स्थल हैं — नाशिक (गोदावरी), उज्जैन (शिप्रा), हरिद्वार (गंगा) और प्रयागराज (त्रिवेणी संगम)।',
        'कुंभ के पावन काल में गोदावरी में स्नान करने से अमृत तत्व की प्राप्ति और जन्म-जन्मांतर के पापों से मुक्ति मिलती है।',
      ],
      mr: [
        'भगवान विष्णूंचे वाहन गरुड अमृताचा कुंभ घेऊन १२ दिव्य दिवस (मानवी १२ वर्षे) आकाशात उडाले.',
        'या काळात पृथ्वीवरील ४ पवित्र नद्यांच्या काठावर अमृताचे थेंब सांडले.',
        'ही ४ पवित्र कुंभक्षेत्रे म्हणजे नाशिक (गोदावरी), उज्जैन (शिप्रा), हरिद्वार (गंगा) आणि प्रयागराज (त्रिवेणी संगम).',
        'सिंहस्थ कुंभ काळात गोदावरीत स्नान केल्याने अमृताचे पुण्य प्राप्त होते अशी श्रद्धा आहे.',
      ],
    },
    bulletDetail: {
      en: [
        "Garuda, the divine eagle, is Vishnu's eternal vehicle. Each divine day equals one earthly human year per Vedic cosmological reckoning in the Puranas.",
        'The four drops fell at spots where rivers hold maximum sacred potency during specific planetary alignments, which is why each site hosts Kumbh at different astronomical intervals.',
        'Each city hosts its own Kumbh on its own astronomical cycle: Nashik, Haridwar, Prayagraj, and Ujjain each every 12 years, rotating across India.',
        'The Godavari is called "Dakshin Ganga" (Ganga of the South) and is considered equal in sanctity to the Ganga. Bathing during Kumbh is believed to cleanse karmic impressions across lifetimes.',
      ],
      hi: [
        'गरुड़ भगवान विष्णु के दिव्य वाहन हैं। एक दिव्य दिन = एक मानव वर्ष — यह अंतर वैदिक कालगणना (ब्रह्माण्ड काल) की विशेषता है।',
        'जहाँ अमृत की बूंदें गिरीं, वे स्थान विशेष ग्रह-योग में सर्वाधिक पुण्यकारी होते हैं, इसलिए हर स्थल का अपना खगोलीय चक्र है।',
        'नाशिक, हरिद्वार, प्रयागराज और उज्जैन — सभी 12 वर्ष के चक्र में आते हैं और भारत भर में बारी-बारी से आयोजित होते हैं।',
        'गोदावरी को दक्षिण गंगा कहते हैं। कुंभ काल में इसका पुण्यत्व गंगा के समान माना जाता है।',
      ],
      mr: [
        'गरुड भगवान विष्णूंचे शाश्वत वाहन आहेत. एक दिव्य दिवस म्हणजे एक मानवी वर्ष — हे वैदिक कालगणनेनुसार ठरते.',
        'ज्या ठिकाणी अमृताचे थेंब पडले, त्या ठिकाणांना विशिष्ट ग्रह-योगात सर्वाधिक आध्यात्मिक ऊर्जा प्राप्त होते.',
        'नाशिक, हरिद्वार, प्रयागराज आणि उज्जैन — सर्व १२ वर्षांच्या चक्रात येतात आणि भारतभर आलटून-पालटून भरतात.',
        'गोदावरीला "दक्षिण गंगा" म्हणतात. कुंभपर्वी गोदावरीचे पुण्य गंगेएवढे मानले जाते.',
      ],
    },
    highlightFact: {
      en: '12 Divine Days = 12 Earth Years: The astronomical reason why the Kumbh returns to Nashik once every 12 years.',
      hi: '12 दिव्य दिन = 12 मानव वर्ष: इसी कारण नाशिक में हर 12 वर्ष बाद सिंहस्थ कुंभ का आयोजन होता है।',
      mr: '१२ दिव्य दिवस = १२ मानवी वर्षे: म्हणूनच नाशिकमध्ये दर १२ वर्षांनी सिंहस्थ कुंभमेळा भरतो.',
    },
    icon: Droplets,
    accentColor: '#AD4E11',
    accentColorLight: '#FFF7ED',
    borderColor: 'rgba(173,78,17,0.20)',
  },
  {
    id: 'simhastha-yoga',
    tabTitle: { en: 'Simhastha Yoga', hi: 'सिंहस्थ योग', mr: 'सिंहस्थ योग' },
    timelineTitle: { en: 'Cosmic Science', hi: 'खगोलीय संरेखण', mr: 'खगोलीय योग' },
    title: {
      en: 'Planetary Alignment — Jupiter in Leo (Simha Rashi)',
      hi: 'खगोलीय योग — सिंह राशि में गुरु का प्रवेश',
      mr: 'खगोलीय योग — सिंह राशीत बृहस्पतीचा प्रवेश',
    },
    tagline: {
      en: 'The Cosmic Science Behind the Timing of Nashik Kumbh Mela',
      hi: 'नाशिक सिंहस्थ कुंभ के शुभ मुहूर्त का खगोलीय और आध्यात्मिक विज्ञान',
      mr: 'नाशिक सिंहस्थ कुंभपर्वाचे खगोलीय आणि आध्यात्मिक रहस्य',
    },
    imageSrc: '/images/culture/simhastha-celestial-yoga.jpg',
    imageAlt: 'Simhastha Kumbh Celestial Ephemeris — Brihaspati (Jupiter) in Simha Rashi (Leo)',
    imageSource: 'Vedic Astronomical Manuscript / Simhastha Yoga Mandala',
    imageBadge: 'Brihaspati in Simha',
    imageCaption: {
      en: 'Planetary Alignment: Devaguru Brihaspati in Leo & Sun in Cancer — Initiating Simhastha Cycle',
      hi: 'खगोलीय योग: देवगुरु बृहस्पति का सिंह राशि में प्रवेश — 12 वर्षीय सिंहस्थ महापर्व का शुभारंभ',
      mr: 'खगोलीय योग: देवगुरू बृहस्पतींचा सिंह राशीत प्रवेश — १२ वर्षांच्या सिंहस्थ कुंभपर्वाचा प्रारंभ',
    },
    narrative: {
      en: 'The Kumbh Mela at Nashik and Trimbakeshwar is uniquely known as "Simhastha". It is strictly calculated based on ancient Vedic astronomical alignments when Brihaspati (Jupiter) enters the zodiac sign of Leo (Simha Rashi) and the Sun aligns in Cancer (Karka) or Leo.',
      hi: 'नाशिक और त्र्यंबकेश्वर के कुंभ को "सिंहस्थ" कहा जाता है। इसका निर्धारण वैदिक ज्योतिषीय गणना से होता है, जब देवगुरु बृहस्पति (गुरु) सिंह राशि में प्रवेश करते हैं और सूर्य कर्क या सिंह राशि में स्थित होते हैं।',
      mr: 'नाशिक आणि त्र्यंबकेश्वर येथील कुंभमेळ्याला "सिंहस्थ" असे विशेष नाव आहे. जेव्हा देवगुरु बृहस्पती (गुरू ग्रह) सिंह राशीत प्रवेश करतात, तेव्हा या सिंहस्थ पर्वाचा प्रारंभ होतो.',
    },
    bulletPoints: {
      en: [
        'Jupiter completes one full orbit around the Sun approximately every 11.86 Earth years, defining the 12-year recurrence.',
        'During this rare planetary alignment, the sacred waters of Godavari resonate with amplified spiritual, electromagnetic, and cosmic energy.',
        'Ancient Vedic rishis designated specific Amrit Snan days (Somvati Amavasya, Shravan Amavasya, Bhadrapad Ekadashi) as maximum energetic thresholds.',
        'Performing ritual charity (Daan), meditation, and holy dips during Simhastha yields thousands of times more spiritual merit.',
      ],
      hi: [
        'गुरु ग्रह लगभग 11.86 वर्षों में सूर्य की परिक्रमा पूरी करता है, जिससे 12 वर्ष का चक्र बनता है।',
        'इस दुर्लभ खगोलीय स्थिति में गोदावरी का जल विशेष ब्रह्मांडीय और आध्यात्मिक ऊर्जा से अभिमंत्रित हो जाता है।',
        'ऋषि-मुनियों ने सोमवती अमावस्या, श्रावण अमावस्या व भाद्रपद एकादशी को अमृत स्नान की सर्वोच्च तिथियां निर्धारित की हैं।',
        'सिंहस्थ काल में किया गया दान, जप, तप और पवित्र स्नान अनंत गुना फलदायी माना जाता है।',
      ],
      mr: [
        'गुरू ग्रह सूर्याभोवतीची एक प्रदक्षिणा सुमारे १२ वर्षांत पूर्ण करतो, ज्यामुळे हा १२ वर्षांचा कालचक्र ठरतो.',
        'या काळात गोदावरीच्या जलामध्ये वैश्विक आणि आध्यात्मिक ऊर्जा प्रवाहित होते.',
        'सोमवती अमावस्या, श्रावण अमावस्या व भाद्रपद एकादशी या अमृत स्नानाच्या अत्यंत पवित्र तिथी मानल्या जातात.',
        'सिंहस्थ काळात केलेले ध्यान, जप, दान आणि स्नान मोक्षदायी ठरते.',
      ],
    },
    bulletDetail: {
      en: [
        "Jupiter's orbital period is 11.86 years, rounded to 12 in the Vedic system — one of humanity's oldest astronomical calculations, predating modern telescopes by millennia.",
        'Vedic scholars describe how cosmic alignments create subtle resonance in the gravitational and geomagnetic fields around sacred rivers, amplifying the purifying effects of ritual immersion.',
        'The three principal Amrit Snan dates for Nashik Kumbh 2027 are officially determined by the Akhada Parishad and district administration according to Vedic Panchanga.',
        'The concept of "multiplied merit" (guna-phal) during Kumbh is documented across the Skanda Purana and the Kumbha Mahatmya scriptures.',
      ],
      hi: [
        'गुरु ग्रह की परिक्रमा काल 11.86 वर्ष है। यह मानवजाति का सबसे प्राचीन खगोलीय अवलोकन है, जो आधुनिक खगोलशास्त्र से हजारों वर्ष पुराना है।',
        'वैदिक मनीषियों के अनुसार इस काल में गुरुत्वाकर्षण और विद्युतचुम्बकीय क्षेत्रों में विशेष परिवर्तन होता है जिससे पवित्र नदियाँ विशेष ऊर्जावान हो जाती हैं।',
        'नाशिक कुंभ 2027 की अमृत स्नान तिथियाँ नाशिक जिला प्रशासन और अखाड़ा परिषद द्वारा पंचांग अनुसार आधिकारिक रूप से घोषित की जाएंगी।',
        '"गुण-फल" (गुणित पुण्य) की अवधारणा स्कंद पुराण और कुंभ महात्म्य ग्रंथ सहित अनेक पुराणों में उल्लेखित है।',
      ],
      mr: [
        'गुरू ग्रहाचा परिभ्रमण काळ ११.८६ वर्षे आहे. हे मानवजातीचे सर्वात प्राचीन खगोलीय निरीक्षण आहे, जे आधुनिक खगोलशास्त्रापेक्षा हजारो वर्षे जुने आहे.',
        'वैदिक विद्वानांच्या मते या काळात गुरुत्वाकर्षण व विद्युतचुंबकीय क्षेत्रात बदल होतात, ज्यामुळे पवित्र नद्यांची आध्यात्मिक शक्ती वाढते.',
        'नाशिक कुंभ २०२७ च्या अमृत स्नान तिथी नाशिक जिल्हा प्रशासन व आखाडा परिषदेकडून पंचांगानुसार अधिकृतपणे जाहीर केल्या जातील.',
        '"गुण-फल" (पुण्याचा गुणाकार) ही संकल्पना स्कंद पुराण व कुंभ महात्म्यात सविस्तर नमूद आहे.',
      ],
    },
    highlightFact: {
      en: 'The Only Dual Kumbh: Pilgrims bathe in Nashik (Ramkund) and Trimbakeshwar (Kushavarta Kund) simultaneously.',
      hi: 'एकमात्र युगल कुंभ: श्रद्धालु नाशिक (रामकुंड) और त्र्यंबकेश्वर (कुशावर्त कुंड) दोनों स्थानों पर स्नान करते हैं।',
      mr: 'एकमेव जोड कुंभ: भाविक नाशिक (रामकुंड) आणि त्र्यंबकेश्वर (कुशावर्त कुंड) या दोन्ही ठिकाणी स्नान करतात.',
    },
    icon: Sun,
    accentColor: '#C2581A',
    accentColorLight: '#FFF7ED',
    borderColor: 'rgba(194,88,26,0.20)',
  },
  {
    id: 'gautama-godavari',
    tabTitle: { en: 'Sage Gautama & Godavari', hi: 'गौतम ऋषि व गोदावरी', mr: 'गौतम ऋषी व गोदावरी' },
    timelineTitle: { en: 'Descent of Ganga', hi: 'गोदावरी अवतरण', mr: 'गोदावरी उगम' },
    title: {
      en: 'Sage Gautama & Descent of Dakshin Ganga',
      hi: 'महर्षि गौतम और दक्षिण गंगा गोदावरी का अवतरण',
      mr: 'महर्षी गौतम आणि दक्षिण गंगा गोदावरीचा उगम',
    },
    tagline: {
      en: 'How the Holiest River of South India Originated at Brahmagiri',
      hi: 'त्र्यंबकेश्वर के ब्रह्मगिरि पर्वत पर कैसे अवतरित हुई जीवनदायिनी गोदावरी',
      mr: 'ब्रह्मगिरी पर्वतावर पवित्र गोदावरी नदीचे कसे झाले अवतरण',
    },
    imageSrc: '/images/culture/sage-gautama-descent.jpg',
    imageAlt: 'Sage Gautama meditating at Brahmagiri as Lord Shiva releases Holy Godavari into Kushavarta Kund',
    imageSource: 'Brahmagiri Puranic Miniature / Descent of Dakshin Ganga',
    imageBadge: 'Dakshin Ganga',
    imageCaption: {
      en: 'Descent of Godavari: Sage Gautama\'s penance at Brahmagiri and Lord Shiva releasing the sacred river',
      hi: 'दक्षिण गंगा गोदावरी का अवतरण: महर्षि गौतम की तपस्या पर भगवान शिव द्वारा ब्रह्मगिरि से पावन धारा का मोचन',
      mr: 'दक्षिण गंगा गोदावरीचे अवतरण: महर्षी गौतमांच्या तपावर प्रसन्न होऊन भगवान शंकरांनी ब्रह्मगिरीवरून गंगा सोडली',
    },
    narrative: {
      en: 'Sage Gautama lived in an ashram on Brahmagiri hill in Trimbakeshwar during a severe 12-year drought. Through his ascetic powers, his hermitage flourished. Sage Gautama undertook fierce penance to Lord Shiva to bring the celestial Ganga down to purify the earth, sanctifying Maharashtra as the sacred Godavari.',
      hi: 'प्राचीन काल में 12 वर्षों के भयंकर अकाल के समय महर्षि गौतम त्र्यंबकेश्वर के ब्रह्मगिरि पर निवास करते थे। अपने तपोबल से उन्होंने सभी ऋषियों का भरण-पोषण किया। महर्षि गौतम ने भगवान शिव की कठोर तपस्या कर गंगाजी को धरती पर आने की प्रार्थना की, जो गोदावरी कहलाई।',
      mr: 'प्राचीन काळी १२ वर्षांच्या दुष्काळात महर्षी गौतम त्र्यंबकेश्वर येथील ब्रह्मगिरीवर तपश्चर्या करत होते. त्यांनी भगवान शंकराची कठोर आराधना करून गंगा मातेला भूतलावर आणले, जी पुढे "गोदावरी" म्हणून ओळखली गेली.',
    },
    bulletPoints: {
      en: [
        'Lord Shiva released the holy river from his matted locks at Brahmagiri mountain, forming the sacred source of Godavari.',
        'Sage Gautama used Kusha grass to encircle the holy waters, creating the revered Kushavarta Kund at Trimbakeshwar.',
        'Lord Rama visited Panchavati (Nashik) during his 14-year exile and performed ancestral rites (Pitru Tarpan) at Ramkund.',
        'Trimbakeshwar is home to one of the 12 sacred Jyotirlingas, featuring the tri-faced linga representing Brahma, Vishnu, and Shiva.',
      ],
      hi: [
        'भगवान शिव ने अपनी जटाओं से गंगा को ब्रह्मगिरि पर छोड़ा, जो दक्षिण गंगा गोदावरी कहलाई।',
        'महर्षि गौतम ने कुशा घास से जल को बांधा, जिससे त्र्यंबकेश्वर का विश्वप्रसिद्ध कुशावर्त कुंड बना।',
        'भगवान श्रीराम ने 14 वर्ष के वनवास में पंचवटी में निवास किया और रामकुंड में अपने पिता का श्राद्ध (पितृ तर्पण) किया।',
        'त्र्यंबकेश्वर में 12 ज्योतिर्लिंगों में से एक अत्यंत दुर्लभ त्रिमुख ज्योतिर्लिंग (ब्रह्मा, विष्णु, महेश) स्थित है।',
      ],
      mr: [
        'भगवान शंकरांनी आपल्या जटांतून गंगेचा प्रवाह ब्रह्मगिरीवर सोडला, ज्याला दक्षिण गंगा गोदावरी नाव मिळाले.',
        'महर्षी गौतमांनी दर्भाच्या (कुशा) सहाय्याने पाणी अडवून पवित्र "कुशावर्त कुंड" निर्माण केले.',
        'प्रभू श्रीरामांनी वनवासात पंचवटीत वास्तव्य केले आणि रामकुंडात पितृतर्पण केले.',
        'त्र्यंबकेश्वर येथे ब्रह्मा, विष्णू आणि महेश या तिन्हींचे रूप असलेले एकमेव त्रिमुखी ज्योतिर्लिंग आहे.',
      ],
    },
    bulletDetail: {
      en: [
        'The exact spot where Lord Shiva released Ganga from his locks is marked by the sacred Kushavarta Kund inside Trimbakeshwar town — the ritually designated starting point of the Godavari river.',
        'Kushavarta Kund is the principal ritual bathing tank for the Shaiva Akhadas during Trimbakeshwar Kumbh. Kusha grass is considered the most sacred grass in Vedic rites.',
        'Panchavati in Nashik is where Sita was abducted by Ravana. The ancient Sita Gupha (cave) and the Kalaram Temple are visited by pilgrims as part of Nashik Kumbh darshan.',
        'The Trimbakeshwar Jyotirlinga is unique: it has three faces representing Brahma, Vishnu, and Shiva within a single linga — unlike all other Jyotirlingas which represent Shiva alone.',
      ],
      hi: [
        'कुशावर्त कुंड त्र्यंबकेश्वर नगर में स्थित है और गोदावरी के उद्गम का पवित्र प्रतीक है। यहाँ से गोदावरी की अधिकारिक यात्रा प्रारंभ मानी जाती है।',
        'कुशावर्त कुंड में अखाड़े त्र्यंबकेश्वर कुंभ के दौरान शाही स्नान करते हैं। कुशा घास वैदिक कर्मकांड में सर्वाधिक पवित्र मानी जाती है।',
        'पंचवटी (नाशिक) में सीता गुफा और कालाराम मंदिर हैं, जो नाशिक कुंभ तीर्थयात्रा के प्रमुख दर्शनीय स्थल हैं।',
        'त्र्यंबकेश्वर ज्योतिर्लिंग सभी 12 ज्योतिर्लिंगों में अद्वितीय है — इसमें ब्रह्मा, विष्णु और महेश तीनों की त्रिमुखी प्रतिमा एक ही पिंड में है।',
      ],
      mr: [
        'कुशावर्त कुंड हे त्र्यंबकेश्वर नगरातील पवित्र स्नानकुंड आहे आणि गोदावरी नदीचे अधिकृत उगमस्थान मानले जाते.',
        'सिंहस्थ काळात आखाडे कुशावर्त कुंडात शाही स्नान करतात. दर्भ (कुशा) गवत वैदिक कर्मकांडात सर्वांत पवित्र मानले जाते.',
        'पंचवटीत (नाशिक) सीता गुंफा व कालाराम मंदिर आहेत, जे नाशिक कुंभ तीर्थयात्रेतील प्रमुख दर्शनस्थळे आहेत.',
        'त्र्यंबकेश्वर ज्योतिर्लिंग सर्व १२ ज्योतिर्लिंगांत अनन्यसाधारण आहे — एकाच पिंडीत ब्रह्मा, विष्णू आणि शिव यांचे त्रिमुखी रूप आहे.',
      ],
    },
    highlightFact: {
      en: 'Trimbakeshwar Jyotirlinga: The only temple representing the Holy Trinity of Brahma, Vishnu, and Shiva together in one Lingam.',
      hi: 'त्र्यंबकेश्वर ज्योतिर्लिंग: एकमात्र मंदिर जहाँ ब्रह्मा, विष्णु और महेश तीनों देव एक ही लिंग में विराजते हैं।',
      mr: 'त्र्यंबकेश्वर ज्योतिर्लिंग: ब्रह्मा, विष्णू आणि महेश हे तिन्ही देव एकाच पिंडीत असलेले एकमेव ज्योतिर्लिंग.',
    },
    icon: Landmark,
    accentColor: '#1B2B4B',
    accentColorLight: '#EEF2F8',
    borderColor: 'rgba(27,43,75,0.20)',
  },
  {
    id: 'akhadas-shahi-snan',
    tabTitle: { en: 'Akhadas & Shahi Snan', hi: 'अखाड़े व शाही स्नान', mr: 'आखाडे व शाही स्नान' },
    timelineTitle: { en: 'Monastic Traditions', hi: 'अखाड़ा वैभव', mr: 'आखाडे परंपरा' },
    title: {
      en: 'The 13 Sacred Akhadas & Royal Shahi Snan',
      hi: '13 अखाड़े और भव्य शाही स्नान की परंपरा',
      mr: '१३ आखाडे आणि भव्य शाही स्नानाची परंपरा',
    },
    tagline: {
      en: 'The Historic Monastic Guardians of Sanatana Dharma and Royal Ceremonies',
      hi: 'सनातन संस्कृति के रक्षक अखाड़े और उनकी सदियों पुरानी संन्यास परंपरा',
      mr: 'सनातन धर्माचे संरक्षक आखाडे आणि त्यांची ऐतिहासिक परंपरा',
    },
    imageSrc: '/images/culture/akhadas-shahi-procession.jpg',
    imageAlt: 'The 13 Sacred Akhadas Royal Shahi Snan procession at Kumbh Mela',
    imageSource: 'Kumbh Mela Heritage Archive / 13 Holy Akhadas Shahi Shobhayatra',
    imageBadge: '13 Holy Akhadas',
    imageCaption: {
      en: 'Royal Shahi Snan Procession: Mahants, Dharma Dhwaj flags, and revered Sadhus marching to the holy kund',
      hi: 'शाही स्नान शोभायात्रा: धर्म ध्वजा, स्वर्ण छत्र और पूज्य संतों के साथ 13 अखाड़ों का पावन संगम स्नान',
      mr: 'शाही स्नान मिरवणूक: धर्मध्वज, सुवर्ण छत्र आणि पूज्य साधू-महंतांसह १३ आखाड्यांचे पवित्र तीर्थस्नान',
    },
    narrative: {
      en: 'The Akhadas are ancient ascetic orders established by Adi Shankaracharya in the 8th century to unite spiritual wisdom and protect Hindu dharma. During the Kumbh Mela, the 13 recognised Akhadas lead the magnificent royal bathing processions (Shahi Snan / Amrit Snan).',
      hi: 'अखाड़े सनातन संस्कृति की रक्षा और एकता के लिए आदि शंकराचार्य द्वारा स्थापित प्राचीन संन्यास परंपराएं हैं। कुंभ मेले में 13 प्रमुख अखाड़े भव्य शाही शोभायात्रा (शाही स्नान / अमृत स्नान) का नेतृत्व करते हैं।',
      mr: 'आद्य शंकराचार्यांनी सनातन संस्कृतीच्या रक्षणार्थ आणि ऐक्यासाठी आखाड्यांची स्थापना केली. कुंभमेळ्यात १३ मान्यताप्राप्त आखाडे भव्य शाही मिरवणुकीसह (शाही स्नान / अमृत स्नान) अग्रभागी असतात.',
    },
    bulletPoints: {
      en: [
        'The 13 Akhadas are categorized into Shaiva (followers of Shiva), Vaishnava (followers of Vishnu/Rama/Krishna), and Udasin orders.',
        'In Nashik Kumbh, Vaishnava Akhadas camp at Sadhugram (Tapovan) and take Shahi Snan at Ramkund.',
        'Shaiva Akhadas camp at Trimbakeshwar and perform their royal bath at Kushavarta Kund.',
        'The Shahi Shobhayatra features revered Mahants, golden flags (Dhwaj), drums, and venerable Naga Sadhus riding in solemn spiritual dignity.',
      ],
      hi: [
        '13 अखाड़ों को शैव (शिव उपासक), वैष्णव (विष्णु/राम/कृष्ण उपासक) और उदासीन संप्रदायों में बांटा गया है।',
        'नाशिक कुंभ में वैष्णव अखाड़े तपोवन (साधुग्राम) में छावनी लगाते हैं और रामकुंड में शाही स्नान करते हैं।',
        'शैव अखाड़े त्र्यंबकेश्वर में पड़ाव डालते हैं और कुशावर्त कुंड में पवित्र शाही स्नान करते हैं।',
        'शाही शोभायात्रा में स्वर्ण-रजत छत्र, धर्म ध्वजाएं और नागा साधु भव्य आध्यात्मिक वैभव के साथ सम्मिलित होते हैं।',
      ],
      mr: [
        '१३ आखाड्यांची विभागणी शैव (शिवभक्त), वैष्णव (विष्णुभक्त) आणि उदासीन पंथांमध्ये झालेली आहे.',
        'नाशिकमध्ये वैष्णव आखाडे तपोवनातील साधुग्राममध्ये मुक्काम करतात आणि रामकुंडात शाही स्नान करतात.',
        'त्र्यंबकेश्वरमध्ये शैव आखाडे तळ ठोकतात आणि कुशावर्त कुंडात शाही स्नान करतात.',
        'शाही मिरवणुकीत सुवर्ण छत्र, धर्मध्वज आणि नागा साधूंचे दर्शन हे कुंभमेळ्याचे सर्वात मोठे आकर्षण असते.',
      ],
    },
    bulletDetail: {
      en: [
        'The 7 Shaiva Akhadas include Juna (largest), Niranjani, Mahanirvani, Avahan, Atal, Agni, and Anand Akhada. The 3 Vaishnava: Nirmohi, Digambar, Nirvani. The 3 Udasin: Bada, Naya, Nirmal.',
        'Tapovan (Sadhugram), near Nashik, is the historic encampment ground where Vaishnava saints set up their temporary ashrams during Kumbh. Open to pilgrims for darshan.',
        'The Kushavarta Kund Shahi Snan procession is the most visually spectacular moment of the Trimbakeshwar Kumbh — narrow streets fill as Akhadas march with elephants, chariots, and Naga Sadhus.',
        'Naga Sadhus are initiated ascetics who renounce all worldly possessions. They are the most visible symbol of Kumbh and are revered for their extreme spiritual discipline.',
      ],
      hi: [
        '7 शैव अखाड़ों में जूना (सबसे बड़ा), निरंजनी, महानिर्वाणी, आवाहन, अटल, अग्नि और आनंद अखाड़ा शामिल हैं। 3 वैष्णव अखाड़े — निर्मोही, दिगम्बर और निर्वाणी। 3 उदासीन — बड़ा, नया और निर्मल।',
        'तपोवन (साधुग्राम) नाशिक के समीप है जहाँ वैष्णव संत कुंभ काल में अस्थायी आश्रम स्थापित करते हैं। भक्त यहाँ दर्शन के लिए आ सकते हैं।',
        'कुशावर्त कुंड का शाही स्नान जुलूस त्र्यंबकेश्वर कुंभ का सबसे भव्य दृश्य होता है — हाथी, रथ और नागा साधुओं के साथ अखाड़े संकरी गलियों से गुजरते हैं।',
        'नागा साधु दीक्षित संन्यासी होते हैं जो सांसारिक मोह-माया त्याग चुके हैं। वे कुंभ के सबसे प्रतिष्ठित प्रतीक हैं।',
      ],
      mr: [
        '७ शैव आखाड्यांमध्ये जुना (सर्वात मोठा), निरंजनी, महानिर्वाणी, आवाहन, अटल, अग्नि व आनंद आखाडा यांचा समावेश आहे. ३ वैष्णव व ३ उदासीन आखाडे देखील मान्यताप्राप्त आहेत.',
        'तपोवन (साधुग्राम) नाशिकजवळ आहे जिथे वैष्णव संत कुंभकाळात तात्पुरते आश्रम उभारतात. भाविकांना येथे दर्शन घेता येते.',
        'कुशावर्त कुंडाची शाही मिरवणूक त्र्यंबकेश्वर कुंभाचा सर्वाधिक नेत्रदीपक क्षण असतो — हत्ती, रथ आणि नागा साधूंसह आखाडे अरुंद गल्ल्यांतून जातात.',
        'नागा साधू हे दीक्षित संन्यासी असतात जे सर्व सांसारिक गोष्टींचा त्याग करतात. ते कुंभाचे सर्वाधिक प्रसिद्ध प्रतीक आहेत.',
      ],
    },
    highlightFact: {
      en: 'Unique Division of Honors: Vaishnava Akhadas lead Nashik, while Shaiva Akhadas lead Trimbakeshwar.',
      hi: 'विशिष्ट व्यवस्था: वैष्णव अखाड़े नाशिक में और शैव अखाड़े त्र्यंबकेश्वर में मुख्य स्नान करते हैं।',
      mr: 'ऐतिहासिक व्यवस्था: वैष्णव आखाडे नाशिकमध्ये तर शैव आखाडे त्र्यंबकेश्वरमध्ये शाही स्नान करतात.',
    },
    icon: Flag,
    accentColor: '#166534',
    accentColorLight: '#F0FDF4',
    borderColor: 'rgba(22,101,52,0.20)',
  },
];

/* ─── Expandable Interactive Fact Card ────────────────────────────────────── */

function InteractiveFactCard({
  point,
  detail,
  accentColor,
  isOpen,
  onToggle,
  index,
}: {
  point: string;
  detail?: string;
  accentColor: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const hasDetail = Boolean(detail);

  return (
    <div
      onClick={() => hasDetail && onToggle()}
      className={`rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
        hasDetail ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
      } ${
        isOpen
          ? 'border-amber-400 bg-amber-50/80 shadow-sm ring-2 ring-amber-400/20'
          : 'border-amber-200/70 bg-white/90 hover:border-amber-300 hover:bg-amber-50/30'
      }`}
    >
      <div className="p-4 flex items-start gap-3 min-h-[58px]">
        {/* Number / Check Badge */}
        <div
          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs mt-0.5"
          style={{
            background: isOpen ? accentColor : '#FEF3C7',
            color: isOpen ? '#FFFFFF' : '#92400E',
          }}
        >
          {isOpen ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : index + 1}
        </div>

        {/* Fact Statement */}
        <div className="flex-1 min-w-0 pr-1">
          <span className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed block">
            {point}
          </span>
          {hasDetail && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider mt-1 inline-flex items-center gap-1 transition-colors"
              style={{ color: isOpen ? accentColor : '#B45309' }}
            >
              {isOpen ? 'Tap to close insight ▴' : 'Tap to reveal deep insight ▾'}
            </span>
          )}
        </div>

        {/* Action Toggle Pill */}
        {hasDetail && (
          <button
            type="button"
            aria-label={isOpen ? 'Collapse insight' : 'Expand insight'}
            className="p-1.5 rounded-lg shrink-0 transition-all group-hover:scale-110"
            style={{
              background: isOpen ? accentColor + '18' : '#F1F5F9',
              color: isOpen ? accentColor : '#64748B',
            }}
          >
            {isOpen ? (
              <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
            ) : (
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Depth Detail */}
      {hasDetail && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out border-t"
          style={{
            maxHeight: isOpen ? '240px' : '0px',
            opacity: isOpen ? 1 : 0,
            borderColor: isOpen ? 'rgba(245,158,11,0.25)' : 'transparent',
          }}
          aria-hidden={!isOpen}
        >
          <div className="p-4 bg-white/70 text-[11px] sm:text-xs text-slate-600 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>Puranic &amp; Historical Context</span>
            </div>
            <p className="font-medium text-slate-700">{detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function KumbhStoryInteractive() {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openFacts, setOpenFacts] = useState<Record<number, boolean>>({ 0: true });
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const prefersReducedMotion = useRef(false);

  // Initialize SpeechSynthesis and check motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mq.matches;

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Chapter Navigation Handler with Smooth Transition
  const goToChapter = useCallback(
    (idx: number) => {
      if (idx === activeChapterIndex || isAnimating || idx < 0 || idx >= CHAPTERS.length) return;

      // Stop audio if speaking
      if (synthRef.current && isAudioPlaying) {
        synthRef.current.cancel();
        setIsAudioPlaying(false);
      }

      // Reset auto-play progress
      setAutoProgress(0);

      // Default expand the first fact card for instant interactive affordance
      setOpenFacts({ 0: true });

      if (prefersReducedMotion.current) {
        setActiveChapterIndex(idx);
        setDisplayIndex(idx);
        return;
      }

      setIsAnimating(true);
      const outDir = idx > activeChapterIndex ? '-14px' : '14px';
      if (cardRef.current) {
        cardRef.current.style.transition = 'opacity 160ms ease, transform 160ms ease';
        cardRef.current.style.opacity = '0';
        cardRef.current.style.transform = `translateX(${outDir})`;
      }

      setTimeout(() => {
        setDisplayIndex(idx);
        setActiveChapterIndex(idx);
        const inDir = idx > activeChapterIndex ? '14px' : '-14px';
        if (cardRef.current) {
          cardRef.current.style.transition = 'none';
          cardRef.current.style.transform = `translateX(${inDir})`;
          cardRef.current.style.opacity = '0';
          void cardRef.current.offsetHeight;
          cardRef.current.style.transition = 'opacity 220ms ease, transform 220ms ease';
          cardRef.current.style.opacity = '1';
          cardRef.current.style.transform = 'translateX(0)';
        }
        setTimeout(() => {
          setIsAnimating(false);
          if (cardRef.current) cardRef.current.style.transition = '';
        }, 230);
      }, 170);
    },
    [activeChapterIndex, isAnimating, isAudioPlaying],
  );

  const goNext = useCallback(
    () => goToChapter((activeChapterIndex + 1) % CHAPTERS.length),
    [activeChapterIndex, goToChapter],
  );
  const goPrev = useCallback(
    () => goToChapter(Math.max(0, activeChapterIndex - 1)),
    [activeChapterIndex, goToChapter],
  );

  // Auto-Play Guided Tour Timer
  useEffect(() => {
    if (!isAutoPlay) {
      setAutoProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setAutoProgress((prev) => {
        if (prev >= 100) {
          goNext();
          return 0;
        }
        return prev + 1.25; // 8 seconds total per chapter
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoPlay, goNext]);

  // Audio Speech Narration
  const toggleAudio = () => {
    if (!synthRef.current) return;

    if (isAudioPlaying) {
      synthRef.current.cancel();
      setIsAudioPlaying(false);
      return;
    }

    synthRef.current.cancel();
    const curChapter = CHAPTERS[activeChapterIndex];
    const textToRead = `${curChapter.title[locale] || curChapter.title.en}. ${
      curChapter.narrative[locale] || curChapter.narrative.en
    }. ${curChapter.highlightFact[locale] || curChapter.highlightFact.en}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsAudioPlaying(false);
    utterance.onerror = () => setIsAudioPlaying(false);

    synthRef.current.speak(utterance);
    setIsAudioPlaying(true);
  };

  const activeChapter = CHAPTERS[displayIndex];
  const IconComponent = activeChapter.icon;

  const chapterLabel = locale === 'hi' ? 'अध्याय' : locale === 'mr' ? 'प्रकरण' : 'Chapter';
  const prevLabel = locale === 'hi' ? 'पिछला अध्याय' : locale === 'mr' ? 'मागील प्रकरण' : 'Previous chapter';
  const nextLabel = locale === 'hi' ? 'अगला अध्याय' : locale === 'mr' ? 'पुढील प्रकरण' : 'Next chapter';

  // Toggle single fact
  const handleToggleFact = (index: number) => {
    setOpenFacts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Expand / Collapse all
  const allExpanded = Object.keys(openFacts).length >= 4 && Object.values(openFacts).every(Boolean);
  const handleToggleAllFacts = () => {
    if (allExpanded) {
      setOpenFacts({});
    } else {
      setOpenFacts({ 0: true, 1: true, 2: true, 3: true });
    }
  };

  return (
    <section
      id="kumbh-story"
      className="w-full bg-[#FAF5EC] border-y border-amber-200/90 py-8 sm:py-14 my-4 shadow-inner relative overflow-hidden"
      aria-labelledby="kumbh-story-heading"
    >
      {/* ── Dynamic Atmospheric Background Elements ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Shifting Chapter Glow Orbs */}
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl transition-all duration-1000 ease-out opacity-60"
          style={{
            background:
              activeChapterIndex === 0
                ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)'
                : activeChapterIndex === 1
                ? 'radial-gradient(circle, rgba(234, 88, 12, 0.22) 0%, transparent 70%)'
                : activeChapterIndex === 2
                ? 'radial-gradient(circle, rgba(14, 116, 144, 0.18) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(22, 101, 52, 0.20) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[460px] h-[460px] rounded-full blur-3xl transition-all duration-1000 ease-out opacity-50"
          style={{
            background:
              activeChapterIndex === 0
                ? 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, transparent 70%)'
                : activeChapterIndex === 1
                ? 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)'
                : activeChapterIndex === 2
                ? 'radial-gradient(circle, rgba(30, 64, 175, 0.16) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(202, 138, 4, 0.18) 0%, transparent 70%)',
          }}
        />

        {/* Slowly Rotating Sacred Vedic Mandala Watermark (Top Right) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 text-amber-700/10 transition-transform"
          style={{ animation: 'kSlowSpin 140s linear infinite' }}
        >
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="32" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* 12 Petal Nodes representing 12-Year Kumbh Cycle */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 40 * Math.cos(angle);
            const y1 = 100 + 40 * Math.sin(angle);
            const x2 = 100 + 82 * Math.cos(angle);
            const y2 = 100 + 82 * Math.sin(angle);
            const cx = 100 + 70 * Math.cos(angle);
            const cy = 100 + 70 * Math.sin(angle);
            return (
              <g key={`mandala-petal-${i}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />
                <circle cx={cx} cy={cy} r="4" fill="currentColor" opacity="0.35" />
              </g>
            );
          })}
        </svg>

        {/* Counter-Rotating Sacred Mandala Watermark (Bottom Left) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute -bottom-24 -left-24 w-80 h-80 sm:w-96 sm:h-96 text-amber-700/8"
          style={{ animation: 'kSlowSpin 180s linear infinite reverse' }}
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x = 100 + 60 * Math.cos(angle);
            const y = 100 + 60 * Math.sin(angle);
            return <circle key={`mandala-inner-${i}`} cx={x} cy={y} r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />;
          })}
        </svg>

        {/* Floating Sacred Golden Embers */}
        <div className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" style={{ animation: 'kFloatEmber1 7s ease-in-out infinite' }} />
        <div className="absolute top-1/3 right-[12%] w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_#EA580C]" style={{ animation: 'kFloatEmber2 8.5s ease-in-out infinite 1.5s' }} />
        <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#FBBF24]" style={{ animation: 'kFloatEmber3 6.5s ease-in-out infinite 0.8s' }} />
        <div className="absolute bottom-1/4 right-[25%] w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" style={{ animation: 'kFloatEmber1 9s ease-in-out infinite 2.5s' }} />
        <div className="absolute top-1/2 left-[5%] w-1.5 h-1.5 rounded-full bg-orange-300 shadow-[0_0_6px_#FB923C]" style={{ animation: 'kFloatEmber2 7.5s ease-in-out infinite 3s' }} />

        {/* Subtle Watermark Shloka Ribbon at Top Edge */}
        <div className="absolute top-1 inset-x-0 overflow-hidden select-none opacity-[0.14] whitespace-nowrap text-[11px] font-serif font-bold text-amber-900 tracking-widest flex items-center justify-around">
          <span>॥ ॐ गङ्गे च यमुने चैव गोदावरि सरस्वति नर्मदे सिन्धु कावेरि जलेऽस्मिन् संनिधिं कुरु ॥</span>
          <span className="hidden sm:inline">★ सिंहस्थ कुंभ महापर्व नाशिक-त्र्यंबकेश्वर २०२७ ★</span>
          <span className="hidden md:inline">॥ ॐ नमः शिवाय ॥</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 relative z-10">

        {/* ── Section Header & Guided Controls ───────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-200/60 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Sacred Origin &amp; Spiritual Significance</span>
            </div>
            <h2 id="kumbh-story-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              The Story &amp; Spiritual Significance of Kumbh Mela
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Discover why millions gather at Nashik and Trimbakeshwar once every 12 years.
            </p>
          </div>

          {/* Interactive Guided Mode & Audio Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Auto-Play Story Button */}
            <button
              type="button"
              onClick={() => setIsAutoPlay((v) => !v)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
                isAutoPlay
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                  : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-50'
              }`}
              title="Auto-play all 4 chapters like an interactive documentary"
            >
              {isAutoPlay ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause Tour</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current text-amber-600" />
                  <span>Auto-Play Tour</span>
                </>
              )}
            </button>

            {/* Audio Voice Narration Button */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-800 text-amber-50 border-amber-900 ring-2 ring-amber-500/30'
                  : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-50'
              }`}
              title="Listen to this chapter spoken out loud"
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-amber-300" />
                  <span>Stop Audio</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-amber-300 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-amber-200 rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Listen to Story</span>
                </>
              )}
            </button>

            <Link
              href={`/${locale}/culture`}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white/80 border border-amber-200/90 px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:bg-white"
            >
              <span>Explore All Heritage</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Keyframe Animations for Background & Progress Bars ───────── */}
        <style>{`
          @keyframes kProgressFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes kShimmerBeam {
            0% { transform: translateX(-150%); opacity: 0; }
            35% { opacity: 0.9; }
            70% { opacity: 0.9; }
            100% { transform: translateX(250%); opacity: 0; }
          }
          @keyframes kBeaconPulse {
            0%, 100% { transform: translate(50%, -50%) scale(1); box-shadow: 0 0 8px #f59e0b, 0 0 16px #ea580c; }
            50% { transform: translate(50%, -50%) scale(1.35); box-shadow: 0 0 14px #fbbf24, 0 0 24px #ea580c; }
          }
          @keyframes kSlowSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes kFloatEmber1 {
            0%, 100% { transform: translate(0, 0) scale(0.85); opacity: 0.25; }
            50% { transform: translate(14px, -32px) scale(1.2); opacity: 0.75; }
          }
          @keyframes kFloatEmber2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            50% { transform: translate(-18px, -40px) scale(1.25); opacity: 0.8; }
          }
          @keyframes kFloatEmber3 {
            0%, 100% { transform: translate(0, 0) scale(0.7); opacity: 0.2; }
            50% { transform: translate(12px, -26px) scale(1.1); opacity: 0.7; }
          }
        `}</style>

        {/* ── Auto-Play Timer Bar ────────────────────────────────────── */}
        {isAutoPlay && (
          <div className="space-y-1.5 -mt-2 transition-all duration-300">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 px-1">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
                </span>
                <span className="uppercase tracking-wider font-extrabold text-[10px] text-amber-950">
                  {locale === 'hi' ? 'कथा यात्रा सक्रिय' : locale === 'mr' ? 'कथा प्रवास सुरू' : 'Story Tour Active'}
                </span>
              </span>
              <span className="font-mono text-[10px] font-black text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/80 shadow-2xs">
                {locale === 'hi' ? 'अगला: ' : locale === 'mr' ? 'पुढील: ' : 'Next: '}
                {Math.max(1, Math.ceil(8 - (autoProgress / 100) * 8))}s
              </span>
            </div>

            <div className="w-full bg-amber-200/70 rounded-full h-2 sm:h-2.5 overflow-hidden p-[2px] border border-amber-300/90 shadow-inner relative">
              <div
                className="h-full rounded-full relative transition-all duration-100 ease-linear overflow-hidden"
                style={{
                  width: `${autoProgress}%`,
                  background: 'linear-gradient(90deg, #B45309 0%, #D97706 30%, #EA580C 65%, #F59E0B 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'kProgressFlow 2.5s ease infinite',
                  boxShadow: '0 0 10px rgba(234, 88, 12, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                }}
              >
                {/* Light sweep shimmer beam */}
                <div
                  className="absolute inset-0 w-2/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                  style={{ animation: 'kShimmerBeam 1.6s infinite ease-in-out' }}
                />

                {/* Glowing leading beacon tip */}
                <div
                  className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-white z-10"
                  style={{ animation: 'kBeaconPulse 1s infinite' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Interactive Visual Journey Stepper ─────────────────────── */}
        <div className="space-y-2">
          {/* Connected timeline progress line */}
          <div className="relative flex items-center justify-between px-3 sm:px-6">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 sm:h-2.5 bg-amber-200/70 rounded-full z-0 overflow-hidden shadow-inner border border-amber-300/80 p-[1.5px]">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{
                  width: `${(activeChapterIndex / (CHAPTERS.length - 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #B45309 0%, #D97706 35%, #EA580C 70%, #F59E0B 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'kProgressFlow 3s ease infinite',
                  boxShadow: '0 0 12px rgba(234, 88, 12, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                }}
              >
                {/* Shimmer light sweep beam */}
                <div
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none"
                  style={{ animation: 'kShimmerBeam 2s infinite ease-in-out' }}
                />

                {/* Pulsing beacon spark at leading edge */}
                {activeChapterIndex > 0 && (
                  <div
                    className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-white z-10"
                    style={{ animation: 'kBeaconPulse 1.2s infinite' }}
                  />
                )}
              </div>
            </div>

            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              const isPassed = idx < activeChapterIndex;
              return (
                <button
                  key={`timeline-step-${ch.id}`}
                  onClick={() => goToChapter(idx)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus-visible:outline-none"
                  aria-label={`Jump to Chapter ${idx + 1}: ${ch.tabTitle[locale] || ch.tabTitle.en}`}
                >
                  <div
                    className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                      isActive
                        ? 'ring-4 ring-amber-400 scale-110 shadow-md'
                        : isPassed
                        ? 'ring-2 ring-amber-600'
                        : 'border-2 border-amber-300 hover:border-amber-500'
                    }`}
                  >
                    <Image
                      src={ch.imageSrc}
                      alt={ch.timelineTitle[locale] || ch.timelineTitle.en}
                      fill
                      sizes="44px"
                      className="object-cover object-center"
                    />
                    <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-amber-900/35' : 'bg-black/45 group-hover:bg-black/25'}`} />
                    <span className="relative z-10 text-white font-black text-xs sm:text-sm drop-shadow-md">
                      {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mt-1.5 hidden sm:block transition-colors ${
                      isActive ? 'text-amber-900 font-black' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    {ch.timelineTitle[locale] || ch.timelineTitle.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Chapter Tab Buttons Row with Thumbnail Images ──────────── */}
        <div
          role="tablist"
          aria-label="Kumbh Story Chapters"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-amber-100/60 p-1.5 rounded-2xl border border-amber-200/80"
        >
          {CHAPTERS.map((chapter, idx) => {
            const isActive = idx === activeChapterIndex;
            const TabIcon = chapter.icon;
            return (
              <button
                key={chapter.id}
                role="tab"
                id={`chapter-tab-${idx}`}
                aria-controls={`chapter-panel-${idx}`}
                aria-selected={isActive}
                onClick={() => goToChapter(idx)}
                className={`group p-2 sm:p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 min-h-[58px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 ${
                  isActive
                    ? 'bg-white shadow-md text-slate-950 font-black border border-amber-400 ring-2 ring-amber-500/25'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/70 border border-transparent'
                }`}
              >
                {/* Respective Miniature Image Thumbnail */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-amber-300/80 shadow-2xs group-hover:scale-105 transition-transform bg-amber-50">
                  <Image
                    src={chapter.imageSrc}
                    alt={chapter.tabTitle[locale] || chapter.tabTitle.en}
                    fill
                    sizes="48px"
                    className="object-cover object-center"
                  />
                  {/* Small icon badge overlay */}
                  <div
                    className="absolute bottom-0.5 right-0.5 p-0.5 rounded text-white shadow-xs backdrop-blur-xs"
                    style={{ background: isActive ? 'var(--color-accent)' : 'rgba(0,0,0,0.65)' }}
                  >
                    <TabIcon className="h-2.5 w-2.5" aria-hidden="true" />
                  </div>
                </div>

                <div className="overflow-hidden min-w-0 flex-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider block"
                    style={{ color: isActive ? 'var(--color-accent-text)' : '#78716C' }}
                  >
                    {chapterLabel} {idx + 1}
                  </span>
                  <span className="text-xs sm:text-[13px] font-black truncate block leading-tight">
                    {chapter.tabTitle[locale] || chapter.tabTitle.en}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Chapter Interactive Card ─────────────────────────── */}
        <div
          ref={cardRef}
          role="tabpanel"
          id={`chapter-panel-${activeChapterIndex}`}
          aria-labelledby={`chapter-tab-${activeChapterIndex}`}
          className="p-5 sm:p-8 rounded-3xl bg-white text-slate-900 shadow-md border border-amber-200/90 space-y-6"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Chapter Authentic Visual Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 shadow-md bg-amber-50/40 group">
            <div className="relative w-full h-60 sm:h-80 md:h-96">
              <Image
                src={activeChapter.imageSrc}
                alt={activeChapter.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                className="object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 pointer-events-none">
                <div
                  className="flex items-center gap-1.5 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-amber-300"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-100" aria-hidden="true" />
                  <span>{activeChapter.imageBadge}</span>
                </div>
              </div>

              {/* Expand Lightbox Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="View full artwork image"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-1.5 text-white text-[11px] font-bold bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 transition-all cursor-pointer shadow-md"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Inspect Artwork</span>
              </button>

              {/* UI Caption Overlay — Rendered HTML text, NOT baked into bitmap */}
              <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div className="max-w-2xl">
                  <span
                    className="text-[10px] uppercase tracking-widest font-extrabold block drop-shadow-md"
                    style={{ color: '#FCD34D' }}
                  >
                    Vedic Sacred Iconography
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white/95 leading-tight drop-shadow-md">
                    {activeChapter.imageCaption[locale] || activeChapter.imageCaption.en}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-200/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 self-start sm:self-auto shrink-0 shadow-xs">
                  <ShieldCheck className="h-3 w-3 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>{activeChapter.imageSource}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Title & Tagline Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3.5">
              <div
                className="p-3 rounded-2xl shrink-0 shadow-inner"
                style={{ background: activeChapter.accentColorLight, color: activeChapter.accentColor }}
              >
                <IconComponent className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-widest border px-2.5 py-0.5 rounded-md"
                  style={{
                    color: 'var(--color-accent-text)',
                    background: '#FFF7ED',
                    borderColor: 'rgba(173,78,17,0.25)',
                  }}
                >
                  {chapterLabel} {activeChapterIndex + 1} of 4
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 leading-snug">
                  {activeChapter.title[locale] || activeChapter.title.en}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  {activeChapter.tagline[locale] || activeChapter.tagline.en}
                </p>
              </div>
            </div>

            {/* Quick Listen Button inside card */}
            <button
              type="button"
              onClick={toggleAudio}
              aria-label={isAudioPlaying ? 'Pause audio reading' : 'Play audio reading'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-all self-start shrink-0 cursor-pointer"
            >
              <Volume2 className="h-4 w-4 text-amber-700" />
              <span>{isAudioPlaying ? 'Pause Narration' : 'Narrate Chapter'}</span>
            </button>
          </div>

          {/* Main Narrative Paragraph */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {activeChapter.narrative[locale] || activeChapter.narrative.en}
          </p>

          {/* ── Tap-to-Expand Fact Cards Section ──────────────────────── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Sacred Insights &amp; Puranic Facts
                </h4>
              </div>
              <button
                type="button"
                onClick={handleToggleAllFacts}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
              >
                {allExpanded ? 'Collapse All' : 'Expand All Insights'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(activeChapter.bulletPoints[locale] || activeChapter.bulletPoints.en).map((point, i) => {
                const detailArr = activeChapter.bulletDetail?.[locale] || activeChapter.bulletDetail?.en;
                return (
                  <InteractiveFactCard
                    key={`${activeChapter.id}-fact-${i}`}
                    index={i}
                    point={point}
                    detail={detailArr?.[i]}
                    accentColor={activeChapter.accentColor}
                    isOpen={Boolean(openFacts[i])}
                    onToggle={() => handleToggleFact(i)}
                  />
                );
              })}
            </div>
          </div>

          {/* Core Insight Callout Box */}
          <div
            className="p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 border shadow-2xs"
            style={{
              background: activeChapter.accentColorLight,
              borderColor: activeChapter.borderColor,
            }}
          >
            <div
              className="p-2.5 rounded-xl text-white shrink-0 shadow-xs"
              style={{ background: activeChapter.accentColor }}
            >
              <Star className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                Core Spiritual Insight
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {activeChapter.highlightFact[locale] || activeChapter.highlightFact.en}
              </p>
            </div>
          </div>

          {/* ── Sequential Prev / Next Navigation Controls ───────────── */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeChapterIndex === 0}
              aria-label={prevLabel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 cursor-pointer"
              style={
                activeChapterIndex > 0
                  ? { background: '#FFF7ED', color: 'var(--color-accent-text)', borderColor: 'rgba(173,78,17,0.25)' }
                  : { background: '#F8FAFC', color: '#94A3B8', borderColor: '#E2E8F0' }
              }
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>{prevLabel}</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-950 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span>Chapter</span>
              <span className="text-amber-700">{activeChapterIndex + 1}</span>
              <span>of</span>
              <span>{CHAPTERS.length}</span>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={activeChapterIndex === CHAPTERS.length - 1}
              aria-label={nextLabel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 cursor-pointer"
              style={
                activeChapterIndex < CHAPTERS.length - 1
                  ? { background: 'var(--color-accent-text)', color: '#FFF', borderColor: 'var(--color-accent-text)' }
                  : { background: '#F8FAFC', color: '#94A3B8', borderColor: '#E2E8F0' }
              }
            >
              <span>{nextLabel}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Must-Fix Milestone Stats (Audited & Corrected) ─────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
            <span className="text-xl sm:text-2xl font-black block" style={{ color: 'var(--color-accent-text)' }}>
              12 Years
            </span>
            <span className="text-xs font-bold text-slate-500">1 Divine Day = 1 Earth Year</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
            <span className="text-xl sm:text-2xl font-black block" style={{ color: 'var(--color-primary-deep)' }}>
              4 Sacred Sites
            </span>
            <span className="text-xs font-bold text-slate-500">Nashik, Ujjain, Haridwar, Prayag</span>
          </div>

          {/* Corrected 150-200M+ pilgrims (fixed recurring 30M+ bug) */}
          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-white to-emerald-50/40">
            <span className="text-xl sm:text-2xl font-black block text-emerald-700">
              150–200M+
            </span>
            <span className="text-xs font-bold text-slate-700">Expected Pilgrims, Kumbh 2027</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
            <span className="text-xl sm:text-2xl font-black block" style={{ color: 'var(--color-accent)' }}>
              13 Holy Akhadas
            </span>
            <span className="text-xs font-bold text-slate-500">Ancient Ascetic Orders</span>
          </div>
        </div>

      </div>

      {/* ── Lightbox Artwork Modal ─────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged artwork view"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  {activeChapter.imageBadge}
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  {activeChapter.title[locale] || activeChapter.title.en}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close artwork viewer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative w-full h-80 sm:h-[480px] rounded-2xl overflow-hidden bg-black">
              <Image
                src={activeChapter.imageSrc}
                alt={activeChapter.imageAlt}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
              <p className="text-white/90 font-medium">
                {activeChapter.imageCaption[locale] || activeChapter.imageCaption.en}
              </p>
              <span className="text-[11px] text-amber-300 font-mono shrink-0">
                {activeChapter.imageSource}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
