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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yatriva.vercel.app';

  const localizedTitle =
    locale === 'mr'
      ? 'यात्रिवा — नाशिक कुंभमेळा २०२७ | अथर्व सूर्यवंशी'
      : locale === 'hi'
      ? 'यात्रिवा — नासिक कुंभ मेला २०२७ | अथर्व सूर्यवंशी'
      : 'Yatriva — Nashik Kumbh Mela 2027 | Atharva Suryawanshi';

  const localizedDesc =
    locale === 'mr'
      ? 'नाशिक-त्र्यंबकेश्वर सिंहस्थ कुंभमेळा २०२७ साठी अथर्व सूर्यवंशी यांनी विकसित केलेले स्वतंत्र डिजिटल व्यासपीठ व मार्गदर्शक. दिव्य मराठी विशेष वृत्त.'
      : locale === 'hi'
      ? 'नासिक-त्र्यंबकेश्वर सिंहस्थ कुंभ मेला २०२७ के लिए अथर्व सूर्यवंशी द्वारा विकसित स्वतंत्र डिजिटल गाइड। दिव्य मराठी विशेष कवरेज।'
      : 'Independent pilgrim visitor guide for Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027 created by Atharva Suryawanshi. Featured in Divya Marathi (Dainik Bhaskar).';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: '%s | Yatriva — Atharva Suryawanshi',
      default: localizedTitle,
    },
    description: localizedDesc,
    keywords: [
      'Yatriva',
      'Atharva Suryawanshi',
      'Atharv Suryavanshi',
      'Yatriva Atharva Suryawanshi',
      'Atharva Suryawanshi Yatriva',
      'Nashik Kumbh Mela 2027',
      'Nashik Kumbh Mela Atharva Suryawanshi',
      'Nashik Simhastha Kumbh Mela 2027',
      'Trimbakeshwar Kumbh Mela',
      'Divya Marathi Yatriva',
      'Divya Marathi Atharva Suryawanshi',
      'यात्रिवा',
      'अथर्व सूर्यवंशी',
      'कुंभमेळा २०२७ नाशिक',
      'सिंहस्थ कुंभमेळा नाशिक',
      'दिव्य मराठी यात्रिवा',
    ],
    authors: [
      {
        name: 'Atharva Ravindra Suryawanshi',
        url: 'https://github.com/Atharvasurya',
      },
    ],
    creator: 'Atharva Suryawanshi',
    publisher: 'Atharva Suryawanshi',
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Yatriva',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/newlogo.png', type: 'image/png' },
      ],
      apple: [{ url: '/icons/icon-192.png', sizes: '192x192' }],
    },
    openGraph: {
      type: 'website',
      siteName: 'Yatriva — By Atharva Suryawanshi',
      title: localizedTitle,
      description: localizedDesc,
      url: `${siteUrl}/${locale}`,
      locale: locale === 'mr' ? 'mr_IN' : locale === 'hi' ? 'hi_IN' : 'en_IN',
      images: [
        {
          url: '/images/godaghat_hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Yatriva — Nashik Kumbh Mela 2027 by Atharva Suryawanshi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: localizedDesc,
      images: ['/images/godaghat_hero.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        hi: `${siteUrl}/hi`,
        mr: `${siteUrl}/mr`,
      },
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yatriva.vercel.app';
  const mediaUrl =
    'https://divyamarathi.bhaskar.com/dvm-originals/news/nashik-kumbh-mela-2027-atharv-suryavanshi-yatriva-digital-platform-138873995.html';

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Yatriva',
        alternateName: [
          'Yatriva — Atharva Suryawanshi',
          'Yatriva Kumbh Mela Guide',
          'Yatriva Digital Platform',
          'यात्रिवा',
          'यात्रिवा कुंभमेळा २०२७',
          'अथर्व सूर्यवंशी यात्रिवा',
        ],
        description:
          'Independent visitor guide and digital platform for Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027 developed by Atharva Suryawanshi. Featured in Divya Marathi.',
        inLanguage: ['en', 'hi', 'mr'],
        publisher: {
          '@id': `${siteUrl}/#person-atharva`,
        },
        creator: {
          '@id': `${siteUrl}/#person-atharva`,
        },
        subjectOf: {
          '@type': 'NewsArticle',
          '@id': mediaUrl,
          headline:
            'नाशिक कुंभमेळा २०२७: अथर्व सूर्यवंशी यांचे यात्रिवा डिजिटल प्लॅटफॉर्म (Divya Marathi)',
          alternativeHeadline:
            'Nashik Kumbh Mela 2027: Atharv Suryavanshi develops Yatriva Digital Platform',
          url: mediaUrl,
          publisher: {
            '@type': 'NewsMediaOrganization',
            name: 'Divya Marathi (Dainik Bhaskar)',
            url: 'https://divyamarathi.bhaskar.com',
          },
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person-atharva`,
        name: 'Atharva Ravindra Suryawanshi',
        alternateName: [
          'Atharva Suryawanshi',
          'Atharv Suryavanshi',
          'अथर्व सूर्यवंशी',
          'अथर्व रवींद्र सूर्यवंशी',
        ],
        jobTitle: 'Founder & Lead Developer of Yatriva',
        description:
          'Software engineer and creator of Yatriva — the independent digital visitor guide for Nashik Simhastha Kumbh Mela 2027. Covered by Divya Marathi (Dainik Bhaskar Group).',
        url: `${siteUrl}/${locale}/about`,
        sameAs: [
          mediaUrl,
          'https://github.com/Atharvasurya',
        ],
      },
      {
        '@type': 'NewsArticle',
        '@id': `${mediaUrl}#article`,
        url: mediaUrl,
        headline:
          'नाशिक कुंभमेळा २०२७: अथर्व सूर्यवंशी यांनी विकसित केले यात्रिवा डिजिटल व्यासपीठ',
        alternativeHeadline:
          'Nashik Kumbh Mela 2027: Atharv Suryavanshi develops Yatriva digital platform',
        description:
          'Divya Marathi coverage detailing how Atharva Suryawanshi developed Yatriva, an offline-first digital visitor platform designed for millions of pilgrims attending Nashik Simhastha Kumbh Mela 2027.',
        about: [
          {
            '@type': 'Person',
            name: 'Atharva Suryawanshi',
          },
          {
            '@type': 'SoftwareApplication',
            name: 'Yatriva',
          },
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Divya Marathi (Dainik Bhaskar Group)',
          url: 'https://divyamarathi.bhaskar.com',
        },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoDevanagari.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/newlogo.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph),
          }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
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

          {/* Global Background Image Layer */}
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.05]"
            style={{
              backgroundImage: `url('/images/bgmain.webp')`,
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
