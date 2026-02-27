import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default,
    timeZone: "Africa/Cairo",
    now: new Date(),
  };
});
