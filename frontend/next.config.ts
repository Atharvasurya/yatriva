import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
// @ts-expect-error next-pwa lacks type definitions for NextConfig wrapper
import withPWAInit from 'next-pwa';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline.html',
  },
  runtimeCaching: [
    // ── Map tiles — StaleWhileRevalidate (load instantly, refresh in background) ──
    {
      urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'openstreetmap-tiles',
        expiration: {
          maxEntries: 1500,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // ── Place / transport / culture data API — StaleWhileRevalidate ──
    // Cache-first with background refresh so pages load offline instantly
    {
      urlPattern: /\/api\/(places|ghats|temples|transport|culture|parking|emergency)\b/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'pilgrim-data-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // ── AI Chat API — NetworkFirst with aggressive timeout ──
    // Falls back to cache (rare), but mainly we handle this client-side
    {
      urlPattern: /\/api\/chat\b/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ai-chat-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 5,
      },
    },
    // ── Other API routes — NetworkFirst ──
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 3,
      },
    },
    // ── Google Fonts / CDN — CacheFirst ──
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // ── Static assets (images, fonts, SVGs) — CacheFirst ──
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // ── Next.js pages / HTML — StaleWhileRevalidate (offline-first shell) ──
    {
      urlPattern: /^https?:\/\/[^/]+\/(?:en|hi|mr)(?:\/|$)/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'page-shell',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(withPWA(nextConfig));

