import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yatriva.vercel.app'),
  title: 'Yatriva — Nashik Kumbh Mela 2027 | Atharva Suryawanshi',
  description:
    'Independent pilgrim visitor guide and digital platform for Nashik Simhastha Kumbh Mela 2027 by Atharva Suryawanshi. Featured in Divya Marathi (Dainik Bhaskar).',
};

// Root layout — thin shell that handles the HTML document.
// Locale-specific layout at app/[locale]/layout.tsx sets lang, fonts, and NextIntlClientProvider.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
