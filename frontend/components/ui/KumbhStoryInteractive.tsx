'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Sparkles, Waves, Compass, Landmark, Flag, BookOpen, ChevronRight, Check, Droplets, Sun, Star, ShieldCheck
} from 'lucide-react';

interface StoryChapter {
  id: string;
  tabTitle: { en: string; hi: string; mr: string };
  title: { en: string; hi: string; mr: string };
  tagline: { en: string; hi: string; mr: string };
  narrative: { en: string; hi: string; mr: string };
  bulletPoints: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  highlightFact: { en: string; hi: string; mr: string };
  icon: typeof Waves;
  accentColor: string;
  bgLight: string;
  borderColor: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'samudra-manthan',
    tabTitle: {
      en: 'Samudra Manthan',
      hi: 'समुद्र मंथन',
      mr: 'समुद्र मंथन',
    },
    title: {
      en: 'The Cosmic Churning & 4 Drops of Amrita',
      hi: 'समुद्र मंथन और अमृत की चार दिव्य बूंदें',
      mr: 'समुद्र मंथन आणि अमृताचे चार दिव्य थेंब',
    },
    tagline: {
      en: 'The Divine Origin of the World\'s Greatest Spiritual Gathering',
      hi: 'विश्व के सबसे बड़े धार्मिक समागम की पौराणिक उत्पत्ति',
      mr: 'जगातील सर्वात मोठ्या आध्यात्मिक मेळाव्याची पौराणिक उत्पत्ती',
    },
    narrative: {
      en: 'According to Hindu Puranas, the Devas (gods) and Asuras (demons) churned the cosmic ocean of milk (Kshira Sagara) using Mount Mandara as the rod and serpent Vasuki as the rope to obtain the nectar of immortality (Amrita). When Lord Dhanvantari emerged holding the golden pot (Kumbha) of Amrita, a celestial pursuit ensued.',
      hi: 'हिंदू पुराणों के अनुसार, देवताओं और दानवों ने अमरता का अमृत पाने के लिए मंदराचल पर्वत और वासुकी नाग की सहायता से क्षीरसागर का मंथन किया। जब भगवान धन्वंतरि अमृत का स्वर्ण कुंभ (कलश) लेकर प्रकट हुए, तो अमृत पाने के लिए देवताओं और असुरों के बीच संघर्ष हुआ।',
      mr: 'हिंदू पुराणांनुसार, देव आणि दानवांनी अमृताच्या प्राप्तीसाठी मंदराचल पर्वत आणि वासुकी नागाच्या सहाय्याने क्षीरसागराचे मंथन केले. जेव्हा भगवान धन्वंतरी अमृताचा सुवर्ण कुंभ घेऊन प्रकट झाले, तेव्हा अमृत मिळवण्यासाठी देव-दानवांमध्ये संघर्ष सुरू झाला.',
    },
    bulletPoints: {
      en: [
        'Lord Vishnu\'s celestial eagle vehicle, Garuda, flew with the Amrita Kumbha for 12 divine days (equivalent to 12 human earthly years).',
        'During the aerial pursuit, exactly 4 drops of divine Amrita fell upon 4 sacred riverbanks on Earth.',
        'The 4 sacred Kumbh sites are Nashik (Godavari), Ujjain (Shipra), Haridwar (Ganga), and Prayagraj (Triveni Sangam).',
        'Bathing in the Godavari during Kumbh is believed to bestow the purifying essence of this celestial Amrita.',
      ],
      hi: [
        'भगवान विष्णु के वाहन गरुड़ जी अमृत कुंभ को लेकर 12 दिव्य दिनों (पृथ्वी के 12 मानव वर्ष) तक उड़े।',
        'इस यात्रा के दौरान पृथ्वी पर 4 पवित्र नदी तटों पर अमृत की बूंदें गिरीं।',
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
    highlightFact: {
      en: '12 Divine Days = 12 Earth Years: Why the Kumbh Mela returns to Nashik once every 12 years.',
      hi: '12 दिव्य दिन = 12 मानव वर्ष: इसी कारण नाशिक में हर 12 वर्ष बाद सिंहस्थ कुंभ का आयोजन होता है।',
      mr: '१२ दिव्य दिवस = १२ मानवी वर्षे: म्हणूनच नाशिकमध्ये दर १२ वर्षांनी सिंहस्थ कुंभमेळा भरतो.',
    },
    icon: Droplets,
    accentColor: '#AD4E11',
    bgLight: 'bg-amber-50/80',
    borderColor: 'border-amber-200',
  },
  {
    id: 'simhastha-yoga',
    tabTitle: {
      en: 'Simhastha Yoga',
      hi: 'सिंहस्थ योग',
      mr: 'सिंहस्थ योग',
    },
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
    narrative: {
      en: 'The Kumbh Mela at Nashik and Trimbakeshwar is uniquely known as "Simhastha". It is strictly calculated based on Vedic astronomical alignments when Brihaspati (Jupiter) enters the zodiac sign of Leo (Simha Rashi) and the Sun aligns in Cancer (Karka) or Leo.',
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
    highlightFact: {
      en: 'The Only Dual Kumbh: Pilgrims bathe in Nashik (Ramkund) and Trimbakeshwar (Kushavarta Kund) simultaneously.',
      hi: 'एकमात्र युगल कुंभ: श्रद्धालु नाशिक (रामकुंड) और त्र्यंबकेश्वर (कुशावर्त कुंड) दोनों स्थानों पर स्नान करते हैं।',
      mr: 'एकमेव जोड कुंभ: भाविक नाशिक (रामकुंड) आणि त्र्यंबकेश्वर (कुशावर्त कुंड) या दोन्ही ठिकाणी स्नान करतात.',
    },
    icon: Sun,
    accentColor: '#E87722',
    bgLight: 'bg-orange-50/80',
    borderColor: 'border-orange-200',
  },
  {
    id: 'gautama-godavari',
    tabTitle: {
      en: 'Sage Gautama & Godavari',
      hi: 'गौतम ऋषि व गोदावरी',
      mr: 'गौतम ऋषी व गोदावरी',
    },
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
    narrative: {
      en: 'Sage Gautama lived in an ashram on Brahmagiri hill in Trimbakeshwar during a severe 12-year drought. Through his ascetic powers, his hermitage flourished. When fellow sages inadvertently caused a divine cow (Gau) to perish, Sage Gautama undertook fierce penance to Lord Shiva to bring the celestial Ganga down to purify the earth and atone for the sin.',
      hi: 'प्राचीन काल में 12 वर्षों के भयंकर अकाल के समय महर्षि गौतम त्र्यंबकेश्वर के ब्रह्मगिरि पर निवास करते थे। अपने तपोबल से उन्होंने सभी ऋषियों का भरण-पोषण किया। अनजाने में हुए एक प्रसंग के बाद, महर्षि गौतम ने भगवान शिव की कठोर तपस्या कर गंगाजी को धरती पर आने की प्रार्थना की।',
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
    highlightFact: {
      en: 'Trimbakeshwar Jyotirlinga: The only temple representing the Holy Trinity of Brahma, Vishnu, and Shiva together in one Lingam.',
      hi: 'त्र्यंबकेश्वर ज्योतिर्लिंग: एकमात्र मंदिर जहाँ ब्रह्मा, विष्णु और महेश तीनों देव एक ही लिंग में विराजते हैं।',
      mr: 'त्र्यंबकेश्वर ज्योतिर्लिंग: ब्रह्मा, विष्णू आणि महेश हे तिन्ही देव एकाच पिंडीत असलेले एकमेव ज्योतिर्लिंग.',
    },
    icon: Landmark,
    accentColor: '#1B2B4B',
    bgLight: 'bg-navy-50/80',
    borderColor: 'border-navy-200',
  },
  {
    id: 'akhadas-shahi-snan',
    tabTitle: {
      en: 'Akhadas & Shahi Snan',
      hi: 'अखाड़े व शाही स्नान',
      mr: 'आखाडे व शाही स्नान',
    },
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
    highlightFact: {
      en: 'Unique Division of Honors: Vaishnava Akhadas lead Nashik, while Shaiva Akhadas lead Trimbakeshwar.',
      hi: 'विशिष्ट व्यवस्था: वैष्णव अखाड़े नाशिक में और शैव अखाड़े त्र्यंबकेश्वर में मुख्य स्नान करते हैं।',
      mr: 'ऐतिहासिक व्यवस्था: वैष्णव आखाडे नाशिकमध्ये तर शैव आखाडे त्र्यंबकेश्वरमध्ये शाही स्नान करतात.',
    },
    icon: Flag,
    accentColor: '#166534',
    bgLight: 'bg-emerald-50/80',
    borderColor: 'border-emerald-200',
  },
];

export default function KumbhStoryInteractive() {
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeChapter = CHAPTERS[activeChapterIndex];
  const IconComponent = activeChapter.icon;

  return (
    <section
      id="kumbh-story"
      className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-5"
      aria-labelledby="kumbh-story-heading"
    >
      {/* ── Section Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>
              {locale === 'hi'
                ? 'सिंहस्थ कुंभ महात्म्य एवं पौराणिक गाथा'
                : locale === 'mr'
                ? 'सिंहस्थ कुंभ महात्म्य आणि पौराणिक गाथा'
                : 'Sacred Origin & Spiritual Significance'}
            </span>
          </div>
          <h2
            id="kumbh-story-heading"
            className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
            style={{ color: '#0F1E35' }}
          >
            {locale === 'hi'
              ? 'कुंभ मेले का रहस्य और आध्यात्मिक महत्व'
              : locale === 'mr'
              ? 'कुंभमेळ्याचे रहस्य आणि आध्यात्मिक महत्त्व'
              : 'The Story & Spiritual Significance of Kumbh Mela'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {locale === 'hi'
              ? 'जानिए हर 12 वर्ष में नाशिक-त्र्यंबकेश्वर में करोड़ों श्रद्धालु क्यों एकत्रित होते हैं।'
              : locale === 'mr'
              ? 'जाणून घ्या दर १२ वर्षांनी नाशिक-त्र्यंबकेश्वर येथे कोट्यवधी भाविक का जमतात.'
              : 'Discover why millions gather at Nashik and Trimbakeshwar once every 12 years.'}
          </p>
        </div>

        <Link
          href={`/${locale}/culture`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors shrink-0 group self-start sm:self-auto"
        >
          <span>
            {locale === 'hi' ? 'सभी सांस्कृतिक लेख देखें' : locale === 'mr' ? 'सर्व सांस्कृतिक माहिती' : 'Explore All Heritage'}
          </span>
          <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Interactive Chapter Switcher Tabs ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
        {CHAPTERS.map((chapter, idx) => {
          const isActive = idx === activeChapterIndex;
          const TabIcon = chapter.icon;

          return (
            <button
              key={chapter.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`p-2.5 sm:p-3 rounded-xl text-left transition-all flex items-center gap-2.5 min-h-[52px] cursor-pointer ${
                isActive
                  ? 'bg-white shadow-md text-slate-900 border border-slate-200/90 ring-2 ring-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                <TabIcon className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chapter {idx + 1}
                </span>
                <span className="text-xs font-black truncate block">
                  {chapter.tabTitle[locale] || chapter.tabTitle.en}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Chapter Interactive Presentation Box ──────────────── */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border ${activeChapter.borderColor} bg-white shadow-md transition-all space-y-5 animate-in fade-in duration-200`}
      >
        {/* Active Chapter Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            <div
              className="p-3 rounded-2xl shrink-0 shadow-inner"
              style={{ background: activeChapter.bgLight, color: activeChapter.accentColor }}
            >
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Chapter {activeChapterIndex + 1} of 4
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 leading-snug">
                {activeChapter.title[locale] || activeChapter.title.en}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {activeChapter.tagline[locale] || activeChapter.tagline.en}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Paragraph */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {activeChapter.narrative[locale] || activeChapter.narrative.en}
        </p>

        {/* 4 Interactive Bullet Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(activeChapter.bulletPoints[locale] || activeChapter.bulletPoints.en).map((point, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700 leading-relaxed hover:border-slate-300 transition-colors"
            >
              <div className="p-1 rounded-full bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="font-medium">{point}</span>
            </div>
          ))}
        </div>

        {/* Highlight Key Fact Callout */}
        <div
          className="p-4 rounded-2xl flex items-center gap-3 border shadow-2xs"
          style={{ background: activeChapter.bgLight, borderColor: activeChapter.accentColor + '40' }}
        >
          <div
            className="p-2 rounded-xl text-white shrink-0"
            style={{ background: activeChapter.accentColor }}
          >
            <Star className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
              Core Spiritual Insight
            </span>
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {activeChapter.highlightFact[locale] || activeChapter.highlightFact.en}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 Quick Milestone Stat Badges ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-0.5">
          <span className="text-lg sm:text-xl font-black text-amber-700 block">12 Years</span>
          <span className="text-[11px] font-bold text-slate-500">1 Divine Day = 1 Year</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-0.5">
          <span className="text-lg sm:text-xl font-black text-navy-800 block">4 Sacred Sites</span>
          <span className="text-[11px] font-bold text-slate-500">Nashik, Ujjain, Haridwar, Prayag</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-0.5">
          <span className="text-lg sm:text-xl font-black text-emerald-800 block">30M+ Pilgrims</span>
          <span className="text-[11px] font-bold text-slate-500">Largest Human Gathering</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-0.5">
          <span className="text-lg sm:text-xl font-black text-saffron-600 block" style={{ color: '#E87722' }}>
            13 Holy Akhadas
          </span>
          <span className="text-[11px] font-bold text-slate-500">Ancient Ascetic Orders</span>
        </div>
      </div>
    </section>
  );
}
