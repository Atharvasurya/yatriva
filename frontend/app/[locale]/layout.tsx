import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import SidebarNav from '@/components/layout/SidebarNav';
import Footer from '@/components/layout/Footer';
import DisclaimerBanner from '@/components/ui/DisclaimerBanner';
import AiAssistantWidget from '@/components/ui/AiAssistantWidget';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import OfflineBanner from '@/components/ui/OfflineBanner';
import Analytics from '@/components/analytics/Analytics';

// Static message imports — Turbopack-safe; avoids the next-intl plugin requirement
// (next-intl's createNextIntlPlugin is webpack-only and incompatible with Turbopack in Next.js 16)
import enMessages from '@/messages/en.json';
import hiMessages from '@/messages/hi.json';
import mrMessages from '@/messages/mr.json';

const MESSAGE_MAP = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
} as const;

type LocaleKey = keyof typeof MESSAGE_MAP;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const msgs = MESSAGE_MAP[(locale as LocaleKey) ?? 'en'] ?? enMessages;

  return {
    title: {
      template: '%s | Yatriva',
      default: msgs.meta.siteTitle,
    },
    description: msgs.meta.siteDescription,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Yatriva',
    },
    openGraph: {
      type: 'website',
      siteName: 'Yatriva',
      title: msgs.meta.siteTitle,
      description: msgs.meta.siteDescription,
    },
    robots: { index: true, follow: true },
    alternates: {
      languages: { en: '/en', hi: '/hi', mr: '/mr' },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#1B2B4B',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Static message lookup — Turbopack-compatible
  const messages = MESSAGE_MAP[(locale as LocaleKey)] ?? enMessages;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily:
            locale === 'en'
              ? 'var(--font-inter), sans-serif'
              : 'var(--font-devanagari), var(--font-inter), sans-serif',
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Accessibility: skip to content */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <DisclaimerBanner />
          <Header />
          <OfflineBanner />

          {/* Global Background Image Layer with Light Opacity */}
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.045]"
            style={{
              backgroundImage: `url('/images/bgmain.png')`,
              backgroundAttachment: 'fixed',
            }}
            aria-hidden="true"
          />

          <div className="relative z-1 flex min-h-[calc(100dvh-56px)]">
            <SidebarNav />
            <div className="flex flex-col flex-1 min-w-0">
              <main
                id="main-content"
                className="flex-1"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
              >
                {children}
              </main>
              <Footer />
            </div>
          </div>

          <AiAssistantWidget />
          <ScrollToTopButton />
          <BottomNav />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
