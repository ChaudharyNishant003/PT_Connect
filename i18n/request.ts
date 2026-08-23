import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const SUPPORTED_LOCALES = ["en", "hi"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const DEFAULT_LOCALE: Locale = "en";

export function resolveLocale(value: string | undefined): Locale {
  return value === "hi" ? "hi" : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
