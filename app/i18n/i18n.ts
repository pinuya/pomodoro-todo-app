import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, resources, type Locale } from "./resources";

export function createI18n(locale: Locale): I18nInstance {
  const instance = createInstance();

  instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: ["pt", "en"],
    resources: resources as unknown as Record<string, never>,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return instance;
}
