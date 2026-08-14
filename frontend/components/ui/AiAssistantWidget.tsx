'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Sparkles, X, Send, Bot, User, AlertTriangle, ShieldCheck, RefreshCw, PhoneCall, ChevronRight, HelpCircle, WifiOff
} from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  grounded?: boolean;
  sources?: string[];
  isSafetyHandoff?: boolean;
  timestamp: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

let msgCounter = 0;
function createMsgId(prefix: string): string {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
}

const SUGGESTED_PROMPTS = {
  en: [
    'When are the Amrit Snan dates 2027?',
    'Where is Ramkund Ghat located?',
    'How do I travel from Nashik to Trimbakeshwar?',
    'Where should I park my car on Snan days?',
    'What facilities exist for senior citizens?',
  ],
  hi: [
    'अमृत स्नान की मुख्य तिथियां क्या हैं?',
    'रामकुंड घाट कहां स्थित है?',
    'नाशिक से त्र्यंबकेश्वर यात्रा की जानकारी दें',
    'स्नान के दिन गाड़ी कहां पार्क करें?',
  ],
  mr: [
    'अमृत स्नान तिथी कधी आहेत?',
    'रामकुंड घाट कुठे आहे?',
    'नाशिक ते त्र्यंबकेश्वर प्रवास कसा करावा?',
    'पार्किंग सुविधा कोठे उपलब्ध आहे?',
  ],
};

// Client-side fallback knowledge database for offline / disconnected operation
const LOCAL_FALLBACK_KNOWLEDGE = [
  {
    keywords: ['snan', "date", "shahi", "amrit", "schedule", "स्नान", "तारीख", "शाही", "अमृत"],
    title: 'Amrit Snan Dates 2027',
    reply: {
      en: '1st Amrit Snan: 2 August 2027\n2nd Amrit Snan: 31 August 2027\n3rd Amrit Snan: 11-12 September 2027.\nNote: Dates are based on the traditional lunar almanac.',
      hi: '1st अमृत स्नान: 2 अगस्त 2027\n2nd अमृत स्नान: 31 अगस्त 2027\n3rd अमृत स्नान: 11-12 सितंबर 2027।',
      mr: '1st अमृत स्नान: 2 ऑगस्ट 2027\n2nd अमृत स्नान: 31 ऑगस्ट 2027\n3rd अमृत स्नान: 11-12 सप्टेंबर 2027.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
  {
    keywords: ['ramkund', 'ghat', 'godavari', 'रामकुंड', 'घाट', 'गोदावरी'],
    title: 'Ramkund Ghat',
    reply: {
      en: 'Ramkund Ghat is on the Godavari river in Nashik. It is the most sacred bathing site where Lord Rama performed Pind Daan.',
      hi: 'रामकुंड घाट नाशिक में गोदावरी नदी पर स्थित सबसे पवित्र स्नान स्थल है।',
      mr: 'रामकुंड घाट नाशिकमधील गोदावरी नदीवरील सर्वात पवित्र स्नान घाट आहे.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
  {
    keywords: ['trimbak', 'jyotirlinga', 'kushavarta', 'त्र्यंबकेश्वर', 'कुशावर्त'],
    title: 'Trimbakeshwar & Kushavarta',
    reply: {
      en: 'Trimbakeshwar Shiva Temple is 28 km from Nashik. Kushavarta Kund is the holy origin site of Godavari river.',
      hi: 'त्र्यंबकेश्वर शिव मंदिर नाशिक से 28 किमी दूर स्थित 12 ज्योतिर्लिंगों में से एक है।',
      mr: 'त्र्यंबकेश्वर हे १२ ज्योतिर्लिंगांपैकी एक असून नाशिकपासून २८ किमी अंतरावर आहे.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
  {
    keywords: ['parking', 'car', "vehicle", "पार्किंग", "गाडी"],
    title: 'Parking Zones',
    reply: {
      en: 'Vehicles are restricted in Mela core. Park at Ring Parking Zone A (Nashik Road) or Zone B (Panchavati) and take free shuttle buses.',
      hi: 'निजी गाड़ियां रिंग पार्किंग जोन A (नाशिक रोड) या जोन B (पंचवटी) पर पार्क करें।',
      mr: 'खाजगी वाहने रिंग पार्किंग झोन A किंवा झोन B मध्ये पार्क करा.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
];

/** Maximum time (ms) to wait for the backend before falling back to offline KB. */
const FETCH_TIMEOUT_MS = 5000;

export default function AiAssistantWidget() {
  const t = useTranslations('assistant');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const { isOnline } = useNetworkStatus();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text:
        locale === 'hi'
          ? 'जय श्री राम! मैं आपका यात्रिवा एआई कुंभ सहायक हूँ। नाशिक कुंभ मेला 2027 के घाट, स्नान तिथियों, या परिवहन के बारे में कुछ भी पूछें।'
          : locale === 'mr'
          ? 'जय श्री राम! मी आपला यात्रिवा एआय कुंभ सहाय्यक आहे. नाशिक कुंभ मेळा 2027 मधील घाट, स्नान तिथी किंवा प्रवासाबद्दल काहीही विचारा.'
          : 'Jai Shree Ram! I am your Yatriva AI Pilgrim Assistant. Ask me anything about Ghats, Amrit Snan dates, parking, or transit for Nashik Kumbh Mela 2027.',
      grounded: true,
      sources: ['Yatriva AI Engine'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: createMsgId('user'),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // If browser is offline, skip the network request entirely
    if (!isOnline) {
      setIsOfflineMode(true);
      respondFromLocalKB(query);
      return;
    }

    try {
      // AbortController-based timeout guard — prevents hanging on Slow 3G
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, locale }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API server returned error');

      const data = await res.json();
      setIsOfflineMode(false);

      const botMsg: ChatMessage = {
        id: createMsgId('bot'),
        sender: 'bot',
        text: data.reply,
        grounded: data.grounded,
        sources: data.sources || [],
        isSafetyHandoff: data.isSafetyHandoff,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Backend offline fallback logic
      setIsOfflineMode(true);
      respondFromLocalKB(query);
    }
  };

  /** Respond from client-side knowledge base (offline or after fetch failure). */
  const respondFromLocalKB = (query: string) => {
    const queryLower = query.toLowerCase();

    // Check safety keywords
    const safetyKeywords = ['child', 'lost', 'faint', 'bleed', 'injury', 'stampede', 'गुम', 'हरवला', 'मदत'];
    const isSafety = safetyKeywords.some((k) => queryLower.includes(k));

    let replyText = '';
    let sourcesList = ['Offline Cached Knowledge'];
    let safetyHandoff = false;

    if (isSafety) {
      safetyHandoff = true;
      replyText =
        locale === 'hi'
          ? '**सुरक्षा सहायता संदेश**: आपातकालीन स्थिति या गुमशुदा व्यक्ति के लिए तुरंत रामकुंड/त्र्यंबकेश्वर पुलिस बूथ पर जाएं या 108/112 पर कॉल करें।'
          : locale === 'mr'
          ? '**सुरक्षा मदत संदेश**: आणीबाणी प्रसंगी तात्काळ रामकुंड/त्र्यंबकेश्वर पोलीस केंद्रास भेट द्या किंवा 108/112 वर संपर्क साधा.'
          : '**Safety Handoff Notice**: For active emergencies or lost persons, report directly to the nearest Police Assistance Booth or dial 108 / 112.';
    } else {
      const matched = LOCAL_FALLBACK_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => queryLower.includes(kw))
      );

      if (matched) {
        replyText = matched.reply[locale] || matched.reply.en;
        sourcesList = matched.sources;
      } else {
        replyText =
          locale === 'hi'
            ? 'क्षमा करें, मुझे ऑफ़लाइन ज्ञान कोष में इस प्रश्न का उत्तर नहीं मिला। कृपया इंटरनेट कनेक्शन जांचें।'
            : locale === 'mr'
            ? 'क्षमस्व, मला ऑफलाइन माहिती संचामध्ये या प्रश्नाचे उत्तर आढळले नाही.'
            : 'I could not find exact details in offline dataset. Please verify internet connection for live server queries.';
      }
    }

    const botMsg: ChatMessage = {
      id: createMsgId('bot'),
      sender: 'bot',
      text: replyText,
      grounded: !safetyHandoff,
      sources: sourcesList,
      isSafetyHandoff: safetyHandoff,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const prompts = SUGGESTED_PROMPTS[locale] || SUGGESTED_PROMPTS.en;

  return (
    <ErrorBoundary fallbackTitle="AI Assistant Error">
      {/* ── Floating Circular Action Button ───────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t('title')}
        title={t('title')}
        className={`fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 items-center justify-center h-14 w-14 rounded-full text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
          isOpen ? 'hidden' : 'flex'
        }`}
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
          boxShadow: '0 8px 25px rgba(79, 70, 229, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-amber-300 transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-indigo-900 animate-ping" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-indigo-900" />
        </div>
      </button>

      {/* ── Chat Modal Drawer ──────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-lg h-[92vh] sm:h-[650px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            {/* ── Header Bar ──────────────────────────────────────────────── */}
            <div
              className="p-4 text-white flex items-center justify-between shrink-0"
              style={{ background: '#4338CA' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center border border-white/20"
                  style={{ background: 'rgba(232, 119, 34, 0.2)' }}
                >
                  <Bot className="h-6 w-6 text-saffron-400" style={{ color: '#E87722' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm tracking-tight text-white">{t('title')}</h3>
                    {isOnline ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        RAG Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                        <WifiOff className="h-2.5 w-2.5" /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/75 leading-tight">{t('subtitle')}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: createMsgId('welcome'),
                        sender: 'bot',
                        text:
                          locale === 'hi'
                            ? 'नमस्कार! मैं यात्रिवा एआई कुंभ सहायक हूँ। आप क्या पूछना चाहते हैं?'
                            : locale === 'mr'
                            ? 'नमस्कार! मी यात्रिवा एआय सहाय्यक आहे. तुम्हाला काय विचारायचे आहे?'
                            : 'Hello! I am your Yatriva AI Assistant. How can I help your pilgrimage today?',
                        grounded: true,
                        sources: ['Yatriva AI Engine'],
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  title={t('clear')}
                  className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ── Offline Banner Alert — proactive when offline, reactive after failed request ── */}
            {(!isOnline || isOfflineMode) && (
              <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center gap-1.5">
                  <WifiOff className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium text-[11px]">{t('offlineNotice')}</span>
                </div>
              </div>
            )}

            {/* ── Messages Stream ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div
                      className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{ background: '#1B2B4B' }}
                    >
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-navy-700 text-white rounded-tr-xs'
                        : msg.isSafetyHandoff
                        ? 'bg-red-50 border-2 border-red-300 text-red-900 rounded-tl-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                    style={msg.sender === 'user' ? { background: '#1B2B4B' } : undefined}
                  >
                    {/* Safety Banner Inside Bot Message */}
                    {msg.isSafetyHandoff && (
                      <div className="mb-2.5 pb-2 border-b border-red-200 flex items-center gap-2 text-red-700 font-bold text-[11px]">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 animate-bounce" />
                        <span>{t('safetyTag')}</span>
                      </div>
                    )}

                    {/* Content text */}
                    <div className="whitespace-pre-line font-normal">{msg.text}</div>

                    {/* Quick Call Action for Safety Handoff */}
                    {msg.isSafetyHandoff && (
                      <div className="mt-3 pt-2 flex flex-wrap gap-2 border-t border-red-200">
                        <a
                          href="tel:108"
                          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                        >
                          <PhoneCall className="h-3 w-3" />
                          <span>Call Ambulance 108</span>
                        </a>
                        <a
                          href="tel:112"
                          className="inline-flex items-center gap-1.5 bg-navy-800 hover:bg-navy-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                          style={{ background: '#1B2B4B' }}
                        >
                          <PhoneCall className="h-3 w-3" />
                          <span>Call Police 112</span>
                        </a>
                      </div>
                    )}

                    {/* Grounded Source Tag */}
                    {msg.sender === 'bot' && !msg.isSafetyHandoff && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-600">{t('groundedTag')}:</span>
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-saffron-500 text-white shrink-0 flex items-center justify-center font-bold text-xs shadow-sm" style={{ background: '#E87722' }}>
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3 bg-white border border-slate-200 rounded-2xl w-fit animate-pulse">
                  <Bot className="h-4 w-4 text-saffron-500 animate-spin" style={{ color: '#E87722' }} />
                  <span>Yatriva AI is synthesizing grounded response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Suggested Questions Chips ──────────────────────────────── */}
            {messages.length < 5 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-saffron-500" style={{ color: '#E87722' }} />
                  <span>{t('suggestedTitle')}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] text-navy-800 bg-slate-100 hover:bg-saffron-50 hover:text-saffron-700 hover:border-saffron-300 border border-slate-200 rounded-full px-3 py-1 transition-colors text-left flex items-center gap-1"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input Box ──────────────────────────────────────────────── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-10 w-10 rounded-xl text-white flex items-center justify-center disabled:opacity-50 transition-all shrink-0 shadow-md"
                style={{ background: '#E87722' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
