import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yatriva.vercel.app';
  const locales = ['en', 'hi', 'mr'];
  const routes = [
    '',
    '/about',
    '/ghats',
    '/temples',
    '/transport',
    '/parking',
    '/culture',
    '/emergency',
    '/lost-and-found',
    '/contact',
    '/privacy',
    '/assistant',
    '/accessibility',
    '/crowd-safety',
    '/water-safety',
    '/traffic-advisory',
    '/weather-health',
    '/safety-pass',
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      const isTopPriority = route === '' || route === '/about';
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: isTopPriority ? 'daily' : 'weekly',
        priority: isTopPriority ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            hi: `${baseUrl}/hi${route}`,
            mr: `${baseUrl}/mr${route}`,
          },
        },
      });
    }
  }

  return entries;
}
