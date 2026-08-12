'use client';

import Script from 'next/script';

/**
 * Privacy-respecting Analytics component.
 *
 * Supports Plausible or Umami analytics without invasive tracking or cookies.
 * Activated when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_ANALYTICS_HOST` is configured.
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_ANALYTICS_HOST || 'https://plausible.io';

  if (!domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src={`${host}/js/script.js`}
      strategy="afterInteractive"
    />
  );
}
