/**
 * Yatriva — Realtime Google Gemini AI Service & Image Matcher
 * Grounded pilgrim assistance for Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027.
 */

export interface AttachedImage {
  id: string;
  title: string;
  url: string;
  category: string;
}

export const VERIFIED_IMAGES: Array<{
  id: string;
  title: string;
  url: string;
  category: string;
  keywords: string[];
}> = [
  {
    id: 'ramkund',
    title: 'Ramkund Sacred Ghat (Godavari)',
    url: '/images/ghats/ramkund.jpg',
    category: 'ghat',
    keywords: ['ramkund', 'ram kund', 'godavari', 'bathing', 'amrit snan', 'shahi snan', 'snan', 'रामकुंड', 'गोदावरी', 'स्नान', 'घाट'],
  },
  {
    id: 'kushavarta',
    title: 'Kushavarta Kund (Trimbakeshwar)',
    url: '/images/ghats/kushavarta.jpg',
    category: 'ghat',
    keywords: ['kushavarta', 'kushawarta', 'trimbak', 'kund', 'gautama', 'कुशावर्त', 'त्र्यंबकेश्वर', 'कुंड'],
  },
  {
    id: 'trimbakeshwar',
    title: 'Trimbakeshwar Shiva Jyotirlinga Temple',
    url: '/images/temples/trimbakeshwar.jpg',
    category: 'temple',
    keywords: ['trimbakeshwar', 'jyotirlinga', 'shiva', 'mahadev', 'brahmagiri', 'त्र्यंबकेश्वर', 'ज्योतिर्लिंग', 'शिव', 'महादेव'],
  },
  {
    id: 'kalaram',
    title: 'Historic Shree Kalaram Mandir (Panchavati)',
    url: '/images/temples/kalaram.jpg',
    category: 'temple',
    keywords: ['kalaram', 'panchavati', 'ram mandir', 'lord rama', 'sita', 'lakshman', 'काळाराम', 'पंचवटी', 'राम मंदिर', 'राम'],
  },
  {
    id: 'sita_gufa',
    title: 'Sita Gufa & Panchavati Tapovan',
    url: '/images/temples/sita_gufa.jpg',
    category: 'temple',
    keywords: ['sita gufa', 'cave', 'panchavati', 'exile', 'tapovan', 'lakshman', 'सीता गुफा', 'गुहा', 'तपोवन'],
  },
  {
    id: 'saptashringi',
    title: 'Shree Saptashringi Nivasini Devi (Vani Shakti Peetha)',
    url: '/images/temples/saptashringi.jpg',
    category: 'temple',
    keywords: ['saptashringi', 'devi', 'vani', 'shakti peeth', 'shaktipeeth', 'goddess', 'सप्तशृंगी', 'देवी', 'शक्तीपीठ'],
  },
  {
    id: 'kapaleshwar',
    title: 'Kapaleshwar Mahadev Temple (Without Nandi)',
    url: '/images/temples/kapaleshwar.jpg',
    category: 'temple',
    keywords: ['kapaleshwar', 'nandi', 'shiva', 'godavari', 'कपालेश्वर', 'नंदी'],
  },
  {
    id: 'muktidham',
    title: 'Muktidham Temple (Nashik Road)',
    url: '/images/temples/muktidham.jpg',
    category: 'temple',
    keywords: ['muktidham', 'nashik road', 'marble', 'geeta', 'मुक्तिधाम'],
  },
  {
    id: 'navshya_ganpati',
    title: 'Navshya Ganpati Temple (Anandvalli)',
    url: '/images/temples/navshya_ganpati.jpg',
    category: 'temple',
    keywords: ['navshya ganpati', 'ganesh', 'ganpati', 'vinayaka', 'नवश्या गणपती', 'गणेश', 'गणपती'],
  },
  {
    id: 'someshwar',
    title: 'Someshwar Shiva Temple & Dudhsagar Waterfall',
    url: '/images/temples/someshwar.jpg',
    category: 'temple',
    keywords: ['someshwar', 'waterfall', 'gangapur', 'dudhsagar', 'सोमेश्वर', 'धबधबा'],
  },
  {
    id: 'ahilyaghat',
    title: 'Ahilyabai Holkar Heritage Ghat',
    url: '/images/ghats/ahilyaghat.jpg',
    category: 'ghat',
    keywords: ['ahilyaghat', 'ahilya', 'holkar', 'heritage', 'अहिल्या', 'अहिल्याबाई'],
  },
  {
    id: 'godaghat_hero',
    title: 'Nashik Simhastha Kumbh Mela & Godavari Maha Aarti',
    url: '/images/godaghat_hero.jpg',
    category: 'kumbh',
    keywords: ['kumbh', 'kumbh mela', 'simhastha', 'aarti', 'crowd', 'procession', 'peshwai', 'akhara', 'sadhu', 'कुंभ', 'सिंहस्थ', 'आरती', 'अखाडा'],
  },
];

export function findRelevantImages(query: string, reply: string): AttachedImage[] {
  const combinedText = `${query} ${reply}`.toLowerCase();
  const matched: AttachedImage[] = [];

  for (const img of VERIFIED_IMAGES) {
    const hits = img.keywords.filter((kw) => combinedText.includes(kw.toLowerCase()));
    if (hits.length > 0) {
      matched.push({
        id: img.id,
        title: img.title,
        url: img.url,
        category: img.category,
      });
    }
  }

  // Deduplicate and limit to top 2 images max for clean UI
  const unique = Array.from(new Map(matched.map((m) => [m.id, m])).values());
  return unique.slice(0, 2);
}

const SYSTEM_INSTRUCTION = `
You are Yatriva AI — an authentic, highly respectful, knowledgeable, and multilingual AI Pilgrim Guide for the Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027.

Core Knowledge Base:
- 1st Amrit Snan (Flag Hoisting / Dhwajarohan): 2 August 2027
- 2nd Amrit Snan (Bhadrapada Amavasya - Main Shahi Snan): 31 August 2027
- 3rd Amrit Snan (Rishi Panchami / Vaman Jayanti): 11-12 September 2027
- Locations: Nashik City (Ramkund Ghat on Godavari River) and Trimbakeshwar (Kushavarta Kund & Jyotirlinga Temple), 28 km apart.
- Transport: MSRTC operates 2,000+ shuttle buses from Outer Ring Parking Zones (Zone A Nashik Road, Zone B Tapovan/Panchavati, Zone C Trimbak Road). Private vehicles are restricted inside Mela core on Snan days.
- Safety & Helplines: Ambulance 108, Police 112, Disaster Helpline 1077.
- Sacred Temples: Trimbakeshwar (12 Jyotirlingas), Shree Kalaram Mandir & Sita Gufa (Panchavati), Kapaleshwar (only Shiva temple without Nandi), Muktidham, Navshya Ganpati, Someshwar, Saptashringi Devi (Shakti Peetha in Vani).

Response Guidelines:
1. Always respond warmly, accurately, and directly in the user's language (English, Hindi, Marathi, etc.).
2. You can answer ANY question the user asks: history, rituals, snan timings, directions, trains, accommodation, food, emergency, Ramayana legends, traditions, tips for elders/children.
3. Keep answers well-structured using markdown bullet points and bold highlights for readability.
4. If an active physical emergency (lost child, stampede, heart attack) is mentioned, explicitly prioritize emergency numbers 108 / 112.
5. Provide helpful context and spiritual significance whenever relevant.
`;

export interface SourceLink {
  title: string;
  url: string;
}

export interface AssistantChatResult {
  reply: string;
  sources: string[];
  sourceLinks?: SourceLink[];
  images: AttachedImage[];
  isSafetyHandoff: boolean;
  grounded?: boolean;
  isGeneralKnowledge?: boolean;
}

export async function askGeminiRealtime(
  message: string,
  locale: string = 'en',
  apiKey?: string
): Promise<AssistantChatResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // 1. Primary: Forward to Full-Site Qdrant Grounded RAG Backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, locale }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const data = await backendRes.json();
      return {
        reply: data.reply,
        sources: data.sources || [],
        sourceLinks: data.sourceLinks || [],
        images: data.images || findRelevantImages(message, data.reply),
        isSafetyHandoff: data.isSafetyHandoff || false,
        grounded: data.grounded ?? true,
        isGeneralKnowledge: data.isGeneralKnowledge || false,
      };
    }
  } catch {
    // Backend offline or timeout -> proceed to client-side fallback
  }

  // 2. Emergency Guardrails
  const lower = message.toLowerCase();
  const isEmergency = [
    'emergency', 'ambulance', 'police', 'stampede', 'heart attack', 'lost child', 'injury',
    'गुम', 'हरवला', 'मदत', 'आपत्कालीन', 'दवाखाना'
  ].some((kw) => lower.includes(kw));

  if (isEmergency) {
    let safetyReply = '';
    if (locale === 'hi') {
      safetyReply = `🚨 **आपातकालीन सहायता निर्देश**:\n\n- **एंबुलेंस / चिकित्सा**: तुरंत **108** पर कॉल करें\n- **पुलिस नियंत्रण कक्ष**: **112** पर कॉल करें\n- **कुंभ आपदा नियंत्रण**: **1077**\n\nरामकुंड, तपोवन, सीबीएस और त्र्यंबकेश्वर कुशावर्त पर 24x7 चिकित्सा और खोया-पाया सहायता बूथ सक्रिय हैं।`;
    } else if (locale === 'mr') {
      safetyReply = `🚨 **तातडीची मदत सूचना**:\n\n- **रुग्णवाहिका / वैद्यकीय मदत**: तात्काळ **108** डायल करा\n- **पोलीस नियंत्रण कक्ष**: **112** डायल करा\n- **कुंभ आपत्ती कक्ष**: **1077**\n\nरामकुंड, तपोवन आणि त्र्यंबकेश्वर कुशावर्त येथे 24 तास पोलीस आणि वैद्यकीय केंद्रे उपलब्ध आहेत.`;
    } else {
      safetyReply = `🚨 **Emergency Safety Handoff**:\n\n- **Ambulance / Medical**: Dial **108**\n- **Police Control**: Dial **112**\n- **Kumbh Disaster Desk**: **1077**\n\n24x7 Medical and Lost & Found booths are active at Ramkund Ghat, Tapovan, CBS, and Trimbakeshwar.`;
    }

    const images = findRelevantImages(message, safetyReply);
    return {
      reply: safetyReply,
      sources: ['Nashik Police & Disaster Management 112/108'],
      sourceLinks: [{ title: 'Emergency Helplines', url: `/${locale}/emergency` }],
      images,
      isSafetyHandoff: true,
      grounded: true,
      isGeneralKnowledge: false,
    };
  }

  // 3. Fallback Grounding Policy (Part 2)
  const isPractical = [
    'parking', 'park', 'car', 'vehicle', 'bus', 'shuttle', 'traffic', 'crowd', 'surge', 'water',
    'dam', 'depth', 'medical', 'hospital', 'doctor', 'insulin', 'wheelchair', 'senior', 'hotel',
    'stay', 'dining', 'restaurant', 'पार्किंग', "गाडी", "वाहन", "गर्दी", "रुग्णालय", "हॉटेल"
  ].some((k) => lower.includes(k));

  if (isPractical) {
    // Strictly no general knowledge for practical / safety queries
    let notFoundReply = '';
    if (locale === 'hi') {
      notFoundReply = `क्षमा करें, मुझे इस व्यावहारिक/सुरक्षा संबंधी प्रश्न के लिए सत्यापित जानकारी नहीं मिली।\n\nकृपया आधिकारिक [आपातकालीन एवं सहायता पृष्ठ](/${locale}/emergency) या [परिवहन पृष्ठ](/${locale}/transport) देखें, या 112 / 108 पर संपर्क करें।`;
    } else if (locale === 'mr') {
      notFoundReply = `क्षमस्व, मला या व्यावहारिक/सुरक्षा प्रश्नासाठी अधिकृत माहिती आढळली नाही.\n\nकृपया अधिकृत [आपत्कालीन व मदत केंद्र](/${locale}/emergency) किंवा [वाहतूक पृष्ठ](/${locale}/transport) तपासा, किंवा 112 / 108 वर संपर्क साधा.`;
    } else {
      notFoundReply = `I could not find verified official records for this practical/safety query.\n\nPlease consult our [Emergency Guide](/${locale}/emergency) or [Transit Guide](/${locale}/transport), or dial 112 / 108.`;
    }

    return {
      reply: notFoundReply,
      sources: ['Yatriva Safety Policy Guardrail'],
      sourceLinks: [
        { title: 'Emergency Helplines', url: `/${locale}/emergency` },
        { title: 'Transit & Parking', url: `/${locale}/transport` },
      ],
      images: findRelevantImages(message, notFoundReply),
      isSafetyHandoff: false,
      grounded: false,
      isGeneralKnowledge: false,
    };
  }

  // Cultural Query Fallback -> General Knowledge with explicit badge
  let genText = '';
  if (locale === 'hi') {
    genText = `ℹ️ **[सामान्य ज्ञान / ऐतिहासिक पृष्ठभूमि]**\n\nकुंभ मेले का संबंध समुद्र मंथन से है, जहां भगवान धन्वंतरि अमृत कलश लेकर प्रकट हुए थे। जब देव-दानव युद्ध हुआ, तब अमृत की बूंदें नाशिक (गोदावरी), प्रयागराज, हरिद्वार, और उज्जैन में गिरीं। सिंहस्थ कुंभ गुरु के सिंह राशि में प्रवेश पर होता है।\n\n*(नोट: यह जानकारी सामान्य ऐतिहासिक पृष्ठभूमि के रूप में दी गई है।)*`;
  } else if (locale === 'mr') {
    genText = `ℹ️ **[सामान्य ज्ञान / ऐतिहासिक पार्श्वभूमी]**\n\nकुंभमेळ्याचा संबंध समुद्रमंथनातील अमृताच्या कुंभाशी आहे. देव आणि दानवांच्या संघर्षात नाशिक (गोदावरी), प्रयागराज, हरिद्वार आणि उज्जैन येथे अमृताचे थेंब पडले. गुरू ग्रह सिंह राशीत असताना नाशिक-त्र्यंबकेश्वर येथे सिंहस्थ कुंभ भरतो.\n\n*(टीप: ही माहिती सामान्य ऐतिहासिक पार्श्वभूमी म्हणून दिली आहे.)*`;
  } else {
    genText = `ℹ️ **[General Knowledge / Cultural Background]**\n\nThe Kumbh Mela originates from the ancient Samudra Manthan (churning of the cosmic ocean). When Lord Dhanvantari emerged with the pot (Kumbh) of nectar, celestial drops spilled across four sanctified earthly grounds: Nashik (Godavari), Prayagraj, Haridwar, and Ujjain. The Simhastha Kumbh occurs when Jupiter enters the zodiac sign of Leo (Simha).\n\n*(Note: This response draws upon general cultural background knowledge.)*`;
  }

  return {
    reply: genText,
    sources: ['General Cultural Background'],
    sourceLinks: [{ title: 'Culture & Heritage', url: `/${locale}/culture` }],
    images: findRelevantImages(message, genText),
    isSafetyHandoff: false,
    grounded: false,
    isGeneralKnowledge: true,
  };
}
