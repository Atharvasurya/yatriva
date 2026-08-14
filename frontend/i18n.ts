import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';
import enMessages from './messages/en.json';
import hiMessages from './messages/hi.json';
import mrMessages from './messages/mr.json';

const MESSAGES = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: MESSAGES[locale as keyof typeof MESSAGES] || enMessages,
  };
});
