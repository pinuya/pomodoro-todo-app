import { DEFAULT_LOCALE, isLocale, type Locale } from "./resources";

export const LOCALE_COOKIE = "lang";

function readCookie(cookieHeader: string, name: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = part.split("=");
    if (rawKey.trim() === name) {
      return decodeURIComponent(rawValue.join("=").trim());
    }
  }
  return null;
}

export function getLocaleFromRequest(request: Request): Locale {
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader) {
    const fromCookie = readCookie(cookieHeader, LOCALE_COOKIE);
    if (isLocale(fromCookie)) return fromCookie;
  }

  const acceptLanguage = request.headers.get("Accept-Language");
  if (acceptLanguage) {
    for (const entry of acceptLanguage.split(",")) {
      const tag = entry.split(";")[0].trim().toLowerCase();
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return DEFAULT_LOCALE;
}

export function persistLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${oneYear};samesite=lax`;
}
