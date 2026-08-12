import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yatriva — Nashik Kumbh Mela 2027',
  description: 'Independent visitor guide for Nashik-Trimbakeshwar Simhastha Kumbh Mela 2027.',
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
