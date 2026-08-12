/**
 * cultureData.ts — Authoritative Culture & Heritage Explainer Articles
 *
 * Serves as Yatriva's credibility layer for spiritual history,
 * sacred geography, and monastic traditions of Simhastha Kumbh Mela.
 */

export interface CultureTopic {
  slug: string;
  title: { en: string; hi: string; mr: string };
  subtitle: { en: string; hi: string; mr: string };
  category: 'river' | 'ramayana' | 'snan' | 'jyotirlinga' | 'monastic';
  icon: string;
  readTimeMinutes: number;
  content: { en: string; hi: string; mr: string };
  relatedPlaceSlugs?: string[];
}

export const CULTURE_TOPICS: CultureTopic[] = [
  {
    slug: 'godavari',
    title: {
      en: 'The Sacred Godavari — Dakshin Ganga',
      hi: 'पवित्र गोदावरी — दक्षिण गंगा',
      mr: 'पवित्र गोदावरी — दक्षिण गंगा',
    },
    subtitle: {
      en: 'Origin at Brahmagiri and the Spiritual Merit of Kumbh Snan',
      hi: 'ब्रह्मगिरि से उद्गम और कुंभ स्नान का आध्यात्मिक पुण्य',
      mr: 'ब्रह्मगिरीवरील उगम आणि कुंभ स्नानाचे आध्यात्मिक महत्त्व',
    },
    category: 'river',
    icon: 'Waves',
    readTimeMinutes: 4,
    relatedPlaceSlugs: ['ramkund', 'kushavarta'],
    content: {
      en: `The Godavari, often revered as the 'Dakshin Ganga' (Ganga of the South), is the second longest river in India and the sacred lifeline of the Simhastha Kumbh Mela. According to Hindu Puranic tradition, Sage Gautama performed intense penance on the Brahmagiri hill in Trimbakeshwar to bring Goddess Ganga down to earth to purify the land and redeem sages from sin.

During Jupiter's entry into the astrological sign of Leo (Simha Rashi), which occurs once every 12 years, celestial nectar (Amrit) is believed to sanctify the waters of the Godavari. Taking a holy dip (Amrit Snan) at Ramkund or Kushavarta Kund during this auspicious alignment is believed to bestow moksha (liberation) and cleanse generations of karmic debt.`,
      hi: `गोदावरी नदी को 'दक्षिण गंगा' के रूप में पूजा जाता है। यह भारत की दूसरी सबसे लंबी नदी है और सिंहस्थ कुंभ मेले की पवित्र जीवन रेखा है। पौराणिक मान्यताओं के अनुसार, महर्षि गौतम ने त्र्यंबकेश्वर में ब्रह्मगिरि पर्वत पर उग्र तपस्या करके देवी गंगा को धरती पर अवतरित किया था।

जब गुरु ग्रह सिंह राशि में प्रवेश करता है (सिंहस्थ), जो हर 12 वर्ष में एक बार होता है, तब गोदावरी के जल में अमृत की बूंदें समाहित हो जाती हैं। रामकुंड या कुशावर्त कुंड में कुंभ स्नान करने से मोक्ष की प्राप्ति होती है और समस्त पापों का नाश होता है।`,
      mr: `गोदावरी नदीला 'दक्षिण गंगा' म्हणून संबोधले जाते. ही भारतातील दुसरी सर्वात लांब नदी असून सिंहस्थ कुंभ मेळ्याची मुख्य धार्मिक जीवनरेषा आहे. पौराणिक कथेनुसार, महर्षी गौतमांनी त्र्यंबकेश्वर येथील ब्रह्मगिरी पर्वतावर कठोर तपश्चर्या करून गंगा नदीला भूतलावर आणले.

दर १२ वर्षांनी जेव्हा गुरू ग्रह सिंह राशीत प्रवेश करतो (सिंहस्थ), तेव्हा गोदावरीच्या जळात अमृताचा अंश सामावतो अशी श्रद्धा आहे. या काळात रामकुंड किंवा कुशावर्त कुंडात स्नान केल्याने मुक्ती व मोक्ष मिळतो.`,
    },
  },
  {
    slug: 'panchavati',
    title: {
      en: 'Panchavati — Land of Ramayana Exile',
      hi: 'पंचवटी — रामायण वनवास की तपोभूमि',
      mr: 'पंचवटी — रामायण वनवासाची तपोभूमी',
    },
    subtitle: {
      en: 'The Grove of Five Banyan Trees, Sita Gufa, and Kalaram Temple',
      hi: 'पाँच वट वृक्षों की भूमि, सीता गुफा और काळाराम मंदिर',
      mr: 'पाच वडांची भूमी, सीता गुंफा आणि काळाराम मंदिर',
    },
    category: 'ramayana',
    icon: 'Landmark',
    readTimeMinutes: 5,
    relatedPlaceSlugs: ['kalaram', 'ramkund'],
    content: {
      en: `Panchavati derives its name from five sacred Banyan (Vata) trees that stood on the northern bank of the Godavari in Nashik. In the Ramayana, during Lord Rama's 14-year exile, he built a simple hermitage here along with Goddess Sita and Lakshmana upon the advice of Sage Agastya.

Significant episodes of the Aranya Kanda unfolded at Panchavati, including Lakshmana cutting Surpanakha's nose and the abduction of Sita by Ravana. Key pilgrimage sites within Panchavati include:
• Sita Gufa: The underground cave shelter where Sita worshipped Lord Shiva.
• Kalaram Temple: A grand 18th-century black stone mandir dedicated to Lord Rama.
• Tapovan: The serene penance grove located downstream near the confluence of Kapila and Godavari rivers.`,
      hi: `पंचवटी का नाम गोदावरी के उत्तरी तट पर स्थित पाँच पवित्र वट वृक्षों से पड़ा है। रामायण में, भगवान राम के 14 वर्ष के वनवास के दौरान, महर्षि अगस्त्य की सलाह पर उन्होंने यहाँ सीता और लक्ष्मण के साथ अपनी कुटिया बनाई थी।

रामायण के अरण्य कांड की प्रमुख घटनाएँ पंचवटी में घटीं, जिनमें लक्ष्मण द्वारा शूर्पणखा की नासिका काटना और रावण द्वारा सीता का अपहरण शामिल है। प्रमुख दर्शनीय स्थल:
• सीता गुफा: प्राचीन भूमिगत गुफा जहाँ सीताजी ने शिव पूजा की थी।
• काळाराम मंदिर: काले पत्थरों से निर्मित 18वीं शताब्दी का भव्य राम मंदिर।
• तपोवन: कपिला और गोदावरी नदी के संगम के पास ऋषियों की तपोभूमि।`,
      mr: `पंचवटी हे नाव गोदावरीच्या उत्तर तीरावर असलेल्या पाच पवित्र वटवृक्षांवरून पडले आहे. रामायणात, प्रभू श्रीरामांनी १४ वर्षांच्या वनवासात महर्षी अगस्तींच्या सल्ल्यानुसार येथे सीतामाता व लक्ष्मणासह पर्णकुटी उभारली होती.

अरण्यकांडातील महत्त्वाच्या घटना पंचवटीत घडल्या. प्रमुख धार्मिक ठिकाणे:
• सीता गुंफा: भूगर्भातील प्राचीन गुंफा जिथे सीतामातेने शिवपूजा केली.
• काळाराम मंदिर: काळ्या दगडात बांधलेले ऐतिहासिक १८ व्या शतकातील राम मंदिर.
• तपोवन: कपिला व गोदावरी नद्यांच्या संगमाजवळील ऋषींची तपोभूमी.`,
    },
  },
  {
    slug: 'ramkund',
    title: {
      en: 'Ramkund — Sacred Bathing Tank & Asthi Visarjan',
      hi: 'रामकुंड — पवित्र स्नान कुंड एवं अस्थि विसर्जन',
      mr: 'रामकुंड — पवित्र स्नान कुंड व अस्थी विसर्जन',
    },
    subtitle: {
      en: 'Primary Amrit Snan Site and Rites for Ancestors',
      hi: 'मुख्य अमृत स्नान स्थल एवं पितृ तर्पण केंद्र',
      mr: 'मुख्य अमृत स्नान स्थळ व पितृतर्पण केंद्र',
    },
    category: 'snan',
    icon: 'Waves',
    readTimeMinutes: 4,
    relatedPlaceSlugs: ['ramkund', 'gorakhkund'],
    content: {
      en: `Ramkund is the central bathing tank on the Godavari river in Nashik. Built in 1696 by Chhatrapati Shahu Maharaj's commander Chintamanrao Raste, Ramkund marks the exact spot where Lord Rama took his daily bath during exile and performed the final ancestral rites (Pind Daan) for his father, King Dasharatha.

Uniquely, bone ashes (Asthi) immersed in Ramkund's waters dissolve rapidly due to natural mineral currents. During the Kumbh Mela, Ramkund is the principal Amrit Snan venue where millions of pilgrims and sadhus gather to take sacred dips. Nearby kunds include Laxmankund, Dhanushkund, and Sita Kund.`,
      hi: `रामकुंड नाशिक में गोदावरी नदी पर स्थित मुख्य स्नान कुंड है। इसका निर्माण 1696 में छत्रपति शाहू महाराज के सरदार चिंतामणराव रास्ते द्वारा कराया गया था। मान्यता है कि भगवान राम ने यहाँ दैनिक स्नान किया था और अपने पिता राजा दशरथ का श्राद्ध तर्पण किया था।

रामकुंड की विशेष बात यह है कि इसमें विसर्जित की गई अस्थियाँ कुछ ही घंटों में जल में विलीन हो जाती हैं। कुंभ मेले के दौरान, रामकुंड प्राथमिक अमृत स्नान स्थल बनता है जहाँ लाखों श्रद्धालु और साधु-संत पवित्र डुबकी लगाते हैं।`,
      mr: `रामकुंड नाशिकमधील गोदावरी नदीवरील सर्वात पवित्र स्नान कुंड आहे. १६९६ मध्ये छत्रपती शाहू महाराजांचे सरदार चिंतामणराव रास्ते यांनी याचे पुनर्निर्माण केले. प्रभू श्रीरामाने येथे स्नान करून पिता दशरथाचे श्राद्ध तर्पण केले होते.

रामकुंडात विसर्जित केलेल्या अस्थी पाण्यात तात्काळ विरघळतात अशी निसर्गसिद्ध वैशिष्ट्यपूर्ण मान्यता आहे. कुंभ मेळ्यात रामकुंड हेच मुख्य अमृत स्नानाचे केंद्र असते.`,
    },
  },
  {
    slug: 'trimbakeshwar',
    title: {
      en: 'Trimbakeshwar — The Three-Faced Jyotirlinga',
      hi: 'त्र्यंबकेश्वर — त्रिमुख ज्योतिर्लिंग',
      mr: 'त्र्यंबकेश्वर — त्रिमुख ज्योतिर्लिंग',
    },
    subtitle: {
      en: 'One of the Twelve Sacred Shrines of Shiva and Source of Godavari',
      hi: 'शिव के बारह ज्योतिर्लिंगों में से एक और गोदावरी का उद्गम',
      mr: 'शिवाच्या बारा ज्योतिर्लिंगांपैकी एक आणि गोदावरीचे उगमस्थान',
    },
    category: 'jyotirlinga',
    icon: 'Landmark',
    readTimeMinutes: 5,
    relatedPlaceSlugs: ['trimbakeshwar', 'kushavarta'],
    content: {
      en: `Trimbakeshwar Shiva Temple, situated 28 km southwest of Nashik at the foothills of Mt. Brahmagiri, is one of the 12 sacred Jyotirlinga shrines. Unlike all other Jyotirlingas which feature Shiva alone, the Lingam at Trimbakeshwar has three faces embodying the holy Trinity: Brahma, Vishnu, and Mahesh (Shiva).

The temple complex is constructed from solid black basalt stone by Peshwa Balaji Baji Rao in the 18th century. Adjacent to the temple lies Kushavarta Kund, a sacred tank where Sage Gautama trapped the river Ganga with Darbha grass (Kusha), marking the formal origin of the Godavari.`,
      hi: `त्र्यंबकेश्वर शिव मंदिर नाशिक से 28 किमी दूर ब्रह्मगिरि पर्वत की तलहटी में स्थित है। यह शिव के 12 पवित्र ज्योतिर्लिंगों में से एक है। अन्य ज्योतिर्लिंगों के विपरीत, त्र्यंबकेश्वर का शिवलिंग त्रिमुखीय है जो त्रिदेव: ब्रह्मा, विष्णु और महेश को दर्शाता है।

इस मंदिर का निर्माण 18वीं शताब्दी में पेशवा बालाजी बाजीराव द्वारा काले बेसाल्ट पत्थरों से कराया गया था। मंदिर के पास कुशावर्त कुंड स्थित है, जहाँ महर्षि गौतम ने कुशा घास से गंगा नदी को बांधा था, जो गोदावरी का औपचारिक उद्गम स्थान है।`,
      mr: `त्र्यंबकेश्वर शिव मंदिर नाशिकपासून २८ किमी अंतरावर ब्रह्मगिरी पर्वताच्या पायथ्याशी वसलेले आहे. हे १२ ज्योतिर्लिंगांपैकी एक आहे. इतर ज्योतिर्लिंगांच्या मानाने येथील शिवलिंगाला ब्रह्मा, विष्णू आणि महेश (शिव) या त्रिदेव रूपातील तीन मुखे आहेत.

पेणचे पेशवे बाळाजी बाजीराव यांनी १८ व्या शतकात काळ्या दगडात या मंदिराचे निर्माण केले. मंदिराशेजारी कुशावर्त कुंड आहे जिथून गोदावरीचा औपचारिक उगम मानला जातो.`,
    },
  },
  {
    slug: 'akharas',
    title: {
      en: 'The Akharas & Shahi Snan Tradition',
      hi: 'अखाड़े एवं शाही स्नान की परंपरा',
      mr: 'अखाडे व शाही स्नानाची परंपरा',
    },
    subtitle: {
      en: 'Ancient Monastic Orders, Peshwai Processions, and Holy Order of Bathing',
      hi: 'प्राचीन साधू सम्प्रदाय, पेशवाई जुलूस और पवित्र स्नान क्रम',
      mr: 'प्राचीन साधू संप्रदाय, पेशवाई मिरवणुका आणि शाही स्नान क्रम',
    },
    category: 'monastic',
    icon: 'Flag',
    readTimeMinutes: 6,
    relatedPlaceSlugs: ['ramkund', 'kushavarta'],
    content: {
      en: `The Akharas are ancient monastic orders of Hindu ascetics founded by Adi Shankaracharya in the 8th century to defend and preserve Vedic Sanatana Dharma. They are broadly divided into three main sects:
• Shaiva Akharas: Followers of Lord Shiva (e.g. Juna Akhara, Niranjani Akhara, Mahanirvani Akhara).
• Vaishnava Anis: Followers of Lord Vishnu & Rama (Nirmohi Ani, Nirvani Ani, Digambar Ani).
• Udasin Akharas: Followers of Sri Chand (son of Guru Nanak).

During the Simhastha Kumbh Mela, Akharas march in magnificent grand processions known as Peshwai, accompanied by caparisoned elephants, horses, brass bands, and thousands of Naga Sadhus. On Amrit Snan days, the Akharas lead the Royal Processions (Shahi Snan) to Ramkund in Nashik (for Vaishnava Akharas) and Kushavarta in Trimbakeshwar (for Shaiva Akharas).`,
      hi: `अखाड़े 8वीं शताब्दी में आदि शंकराचार्य द्वारा स्थापित हिंदू साधुओं के प्राचीन संप्रदाय हैं। इन्हें मुख्य रूप से तीन श्रेणियों में विभाजित किया गया है:
• शैव अखाड़े: भगवान शिव के अनुयायी (जैसे जूना अखाड़ा, निरंजनी अखाड़ा, महानिर्वाणी अखाड़ा)।
• वैष्णव अणि अखाड़े: भगवान विष्णु और राम के अनुयायी (निर्मोही अणि, निर्वाणी अणि, दिगंबर अणि)।
• उदासीन अखाड़े: श्री चंद जी के अनुयायी।

सिंहस्थ कुंभ मेले के दौरान अखाड़े 'पेशवाई' नामक भव्य जुलूस निकालते हैं। अमृत स्नान के दिनों में अखाड़े शाही स्नान जुलूस का नेतृत्व करते हैं — नाशिक के रामकुंड में वैष्णव अखाड़े और त्र्यंबकेश्वर में शैव अखाड़े स्नान करते हैं।`,
      mr: `अखाडे हे आठव्या शतकात आद्य शंकराचार्यांनी स्थापन केलेले हिंदू साधूंचे प्राचीन संप्रदाय आहेत.
• शैव अखाडे: भगवान शिवाचे उपासक (जुना अखाडा, निरंजनी अखाडा, महानिर्वाणी अखाडा).
• वैष्णव अणि अखाडे: भगवान विष्णू व रामाचे उपासक (निर्मोही, निर्वाणी, दिगंबर अणि).
• उदासीन अखाडे: श्रीचंदजींचे अनुयायी.

सिंहस्थ कुंभमेळ्यात अखाड्यांच्या 'पेशवाई' मिरवणुका अत्यंत प्रेक्षणीय असतात. शाही स्नानाच्या दिवशी त्र्यंबकेश्वर येथे शैव अखाडे व नाशिकमध्ये वैष्णव अखाडे स्नानाचे नेतृत्व करतात.`,
    },
  },
];
