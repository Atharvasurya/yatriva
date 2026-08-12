import type { Metadata } from 'next';
import HomePageContent from './_components/HomePageContent';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', hi: '/hi', mr: '/mr' },
    },
  };
}

// Server component: just renders the client component which is wrapped
// in NextIntlClientProvider by the locale layout above.
export default async function HomePage({ params }: Props) {
  // params resolved to satisfy Next.js dynamic segment requirement
  await params;
  return <HomePageContent />;
}
