'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Smartphone, ArrowLeft, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('auth');
  const router = useRouter();

  // Country-code selector state — defaults to India (+91)
  const [countryCode, setCountryCode] = useState('+91');
  const [localPhone, setLocalPhone] = useState('');
  // Full E.164 number sent to backend
  const phone = `${countryCode}${localPhone.replace(/\s/g, '')}`;
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [providerName, setProviderName] = useState('demo_mode');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    // Validate the local part has at least 7 digits (covers all international formats)
    const digitsOnly = localPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setErrorMessage('Please enter a valid mobile number (at least 7 digits after country code).');
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        credentials: 'include',
      });

      if (res.status === 429) {
        const json = await res.json();
        setErrorMessage(json.detail || t('rateLimitError'));
        return;
      }

      if (!res.ok) {
        const json = await res.json();
        setErrorMessage(json.detail || 'Failed to send OTP code.');
        return;
      }

      const data = await res.json();
      setProviderName(data.provider || 'demo_mode');
      setDemoOtpHint(data.demoOtp || '1234');
      setTimeLeft(data.expiresInSeconds || 300);
      setStep('otp');
    } catch {
      // Offline / Fallback
      setDemoOtpHint('1234');
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otp) return;

    if (timeLeft <= 0) {
      setErrorMessage(t('expiredError'));
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, otp }),  // phone is full E.164
        credentials: 'include',
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMessage(json.detail || 'Invalid OTP code.');
        return;
      }

      // Store leader phone fallback for UI
      localStorage.setItem('yatriva_leader_phone', phone);
      router.push(`/${locale}/my-groups`);
    } catch {
      if (otp === '1234') {
        localStorage.setItem('yatriva_leader_phone', phone);
        router.push(`/${locale}/my-groups`);
      } else {
        setErrorMessage('Invalid OTP code. For demo, use 1234.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="card p-6 bg-white rounded-2xl shadow-xl border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto" style={{ color: '#E87722', background: 'rgba(232,119,34,0.1)' }}>
            <Smartphone className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-navy-800" style={{ color: '#1B2B4B' }}>
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SMS Provider Info Badge */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-semibold">SMS Provider Status:</span>
          <span className="font-bold text-navy-800 capitalize" style={{ color: '#1B2B4B' }}>
            {providerName === 'demo_mode' ? 'Demo Mode Active' : providerName}
          </span>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('phoneLabel')} *
              </label>
              {/* Country code + local number — side-by-side */}
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Country code"
                  className="shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700 min-h-[44px] font-semibold"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+66">🇹🇭 +66</option>
                  <option value="+977">🇳🇵 +977</option>
                  <option value="+94">🇱🇰 +94</option>
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+92">🇵🇰 +92</option>
                </select>
                <input
                  type="tel"
                  required
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value)}
                  placeholder={countryCode === '+91' ? '98765 43210' : 'Local number'}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700 min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 min-h-[44px]"
              style={{ background: '#1B2B4B' }}
            >
              {loading ? 'Sending OTP...' : t('sendOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>OTP sent to {phone}</span>
              <button
                type="button"
                onClick={() => { setStep('phone'); setErrorMessage(''); }}
                className="font-bold underline text-amber-700"
              >
                Change Phone
              </button>
            </div>

            {/* Expiry Countdown Timer */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>Code Expiry:</span>
              </span>
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-navy-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {demoOtpHint && (
              <p className="text-[11px] text-emerald-700 font-mono bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Demo OTP Code: {demoOtpHint}</span>
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('otpLabel')} *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-slate-800 focus:bg-white focus:ring-2 focus:ring-navy-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otp || timeLeft <= 0}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 min-h-[44px]"
              style={{ background: '#E87722' }}
            >
              {loading ? 'Verifying...' : t('verifyOtp')}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href={`/${locale}/register`}
            className="text-xs font-bold text-navy-800 hover:underline"
            style={{ color: '#1B2B4B' }}
          >
            Continue Without Account (Immediate Card Download) →
          </Link>
        </div>
      </div>
    </div>
  );
}
