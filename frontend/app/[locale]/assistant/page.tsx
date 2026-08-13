'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Bot, ShieldCheck, HelpCircle, Send, PhoneCall, AlertTriangle, ArrowLeft, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

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

/** Maximum time (ms) to wait for the backend before falling back to offline KB. */
const FETCH_TIMEOUT_MS = 5000;

let msgCounter = 0;
function createMsgId(prefix: string): string {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
}

// Client-side fallback knowledge database for offline / disconnected operation
const LOCAL_FALLBACK_KNOWLEDGE = [
  {
    keywords: ['snan', 'date', 'shahi', 'amrit', 'schedule', 'स्नान', 'तारीख', 'शाही', 'अमृत'],
    reply: {
      en: '1st Amrit Snan: 2 August 2027\n2nd Amrit Snan: 31 August 2027\n3rd Amrit Snan: 11-12 September 2027.\nRamkund Ghat on Godavari river is the primary bathing site in Nashik.',
      hi: '1st अमृत स्नान: 2 अगस्त 2027\n2nd अमृत स्नान: 31 अगस्त 2027\n3rd अमृत स्नान: 11-12 सितंबर 2027।',
      mr: '1st अमृत स्नान: 2 ऑगस्ट 2027\n2nd अमृत स्नान: 31 ऑगस्ट 2027\n3rd अमृत स्नान: 11-12 सप्टेंबर 2027.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
  {
    keywords: ['ramkund', 'ghat', 'godavari', 'रामकुंड', 'घाट', 'गोदावरी'],
    reply: {
      en: 'Ramkund Ghat is on the Godavari river in Nashik. It is the most sacred bathing site where Lord Rama performed Pind Daan.',
      hi: 'रामकुंड घाट नाशिक में गोदावरी नदी पर स्थित सबसे पवित्र स्नान स्थल है।',
      mr: 'रामकुंड घाट नाशिकमधील गोदावरी नदीवरील सर्वात पवित्र स्नान घाट आहे.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
  {
    keywords: ['parking', 'car', 'vehicle', 'पार्किंग', 'गाडी'],
    reply: {
      en: 'Vehicles are restricted in Mela core. Park at Ring Parking Zone A (Nashik Road) or Zone B (Panchavati) and take free shuttle buses.',
      hi: 'निजी गाड़ियां रिंग पार्किंग जोन A (नाशिक रोड) या जोन B (पंचवटी) पर पार्क करें।',
      mr: 'खाजगी वाहने रिंग पार्किंग झोन A किंवा झोन B मध्ये पार्क करा.',
    },
    sources: ['Cached Yatriva Knowledge'],
  },
];

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

export default function AssistantPage() {
  const t = useTranslations('assistant');
  const locale = useLocale() as 'en' | 'hi' | 'mr';
  const { isOnline } = useNetworkStatus();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-page',
      sender: 'bot',
      text:
        locale === 'hi'
          ? 'जय श्री राम! मैं आपका यात्रिवा एआई कुंभ सहायक हूँ। नाशिक कुंभ मेला 2027 के घाट, स्नान तिथियों, या परिवहन के बारे में कुछ भी पूछें।'
          : locale === 'mr'
          ? 'जय श्री राम! मी आपला यात्रिवा एआय कुंभ सहाय्यक आहे. नाशिक कुंभ मेळा 2027 मधील घाट, स्नान तिथी किंवा प्रवासाबद्दल काहीही विचारा.'
          : 'Jai Shree Ram! I am your Yatriva AI Pilgrim Assistant. Ask me anything about Ghats, Amrit Snan dates, parking, or transit for Nashik Kumbh Mela 2027.',
      grounded: true,
      sources: ['Yatriva AI Vector Knowledge Base'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

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
      // Backend offline fallback
      setIsOfflineMode(true);
      respondFromLocalKB(query);
    }
  };

  /** Respond from client-side knowledge base (offline or after fetch failure). */
  const respondFromLocalKB = (query: string) => {
    const queryLower = query.toLowerCase();
    const isSafety = ['child', 'lost', 'faint', 'stampede', 'गुम', 'हरवला'].some((k) => queryLower.includes(k));

    let reply = '';
    let sourcesList = ['Cached Yatriva Knowledge Base'];
    let safetyHandoff = false;

    if (isSafety) {
      safetyHandoff = true;
      reply =
        locale === 'hi'
          ? '**सुरक्षा सहायता संदेश**: आपातकालीन स्थिति के लिए तुरंत पुलिस सहायता बूथ पर जाएं या 108/112 पर संपर्क करें।'
          : locale === 'mr'
          ? '**सुरक्षा मदत संदेश**: आणीबाणी प्रसंगी तात्काळ पोलीस मदत केंद्रास भेट द्या किंवा 108/112 वर संपर्क साधा.'
          : '**Safety Handoff Notice**: For active emergencies or lost persons, report directly to the nearest Police Assistance Booth or dial 108 / 112.';
    } else {
      const matched = LOCAL_FALLBACK_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => queryLower.includes(kw))
      );

      if (matched) {
        reply = matched.reply[locale] || matched.reply.en;
        sourcesList = matched.sources;
      } else {
        reply =
          locale === 'hi'
            ? 'क्षमा करें, मुझे ऑफ़लाइन ज्ञान कोष में इस प्रश्न का उत्तर नहीं मिला। कृपया इंटरनेट कनेक्शन जांचें।'
            : locale === 'mr'
            ? 'क्षमस्व, मला ऑफलाइन माहिती संचामध्ये या प्रश्नाचे उत्तर आढळले नाही.'
            : 'I could not find exact details in offline dataset. Please verify internet connection for live server queries.';
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        id: createMsgId('bot'),
        sender: 'bot',
        text: reply,
        grounded: !safetyHandoff,
        sources: sourcesList,
        isSafetyHandoff: safetyHandoff,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLoading(false);
  };

  const prompts = SUGGESTED_PROMPTS[locale] || SUGGESTED_PROMPTS.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{isOnline ? 'Grounded RAG Guardrails Active' : 'Offline Mode — Cached Knowledge'}</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card overflow-hidden bg-white shadow-xl rounded-[var(--radius-card)] border border-slate-200 flex flex-col h-[750px]">
        {/* Banner Bar */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-deep) 0%, var(--color-primary) 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center border border-white/20" style={{ background: 'rgba(232,119,34,0.20)' }}>
              <Bot className="h-7 w-7 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{t('title')}</h1>
              <p className="text-xs text-white/80">{t('subtitle')}</p>
            </div>
          </div>

          <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
        </div>

        {/* Offline Notice Banner — proactive */}
        {(!isOnline || isOfflineMode) && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 font-medium">
              <WifiOff className="h-4 w-4 text-amber-700 shrink-0" />
              <span>{isOnline ? 'Offline Mode Active — Operating using cached local pilgrim knowledge base.' : 'You are offline — AI responses are served from cached local knowledge.'}</span>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[var(--color-surface-alt)]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-xs" style={{ background: 'var(--color-primary)' }}>
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'text-white rounded-tr-xs'
                    : msg.isSafetyHandoff
                    ? 'bg-red-50 border-2 border-red-300 text-red-950 rounded-tl-xs'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                }`}
                style={msg.sender === 'user' ? { background: 'var(--color-primary)' } : undefined}
              >
                {msg.isSafetyHandoff && (
                  <div className="mb-2 pb-2 border-b border-red-200 flex items-center gap-2 text-red-800 font-bold text-xs">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{t('safetyTag')}</span>
                  </div>
                )}

                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {msg.isSafetyHandoff && (
                  <div className="mt-3 pt-2 flex flex-wrap gap-2 border-t border-red-200">
                    <a
                      href="tel:108"
                      className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold px-3.5 py-2.5 rounded-lg text-xs min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <PhoneCall className="h-4 w-4" /> Call Ambulance 108
                    </a>
                    <a
                      href="tel:112"
                      className="inline-flex items-center gap-1.5 text-white font-bold px-3.5 py-2.5 rounded-lg text-xs min-h-[44px] hover:brightness-110 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      <PhoneCall className="h-4 w-4" /> Call Police 112
                    </a>
                  </div>
                )}

                {msg.sender === 'bot' && !msg.isSafetyHandoff && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{t('groundedTag')}:</span>
                    {msg.sources.map((src, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-slate-700 text-xs py-3 px-4 bg-white border border-slate-200 rounded-2xl w-fit shadow-xs animate-pulse">
              <Bot className="h-4 w-4 text-amber-600 animate-spin" />
              <span>Fetching grounded answer from Yatriva vector dataset...</span>
            </div>
          )}
        </div>

        {/* Prompts Section */}
        <div className="px-4 py-3 bg-white border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" style={{ color: '#AD4E11' }} />
            <span>{t('suggestedTitle')}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-xs text-slate-800 bg-[var(--color-surface-alt)] hover:bg-amber-50 hover:text-amber-900 border border-slate-200 rounded-full px-3.5 py-2 transition-all min-h-[44px] flex items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-[var(--color-surface-alt)] border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="min-h-[44px] min-w-[44px] px-5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            style={{ background: 'var(--color-accent-dark)' }}
          >
            <Send className="h-4 w-4" />
            <span>{t('send')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
