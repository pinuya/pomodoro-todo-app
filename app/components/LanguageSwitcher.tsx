import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { persistLocale } from "~/i18n/locale";
import { SUPPORTED_LOCALES, isLocale, type Locale } from "~/i18n/resources";

const LABELS: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
};

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = isLocale(i18n.language) ? i18n.language : "pt";

  const change = (locale: Locale) => {
    if (locale === current) return;
    persistLocale(locale);
    void i18n.changeLanguage(locale);
  };

  return (
    <div
      className="flex items-center gap-1 rounded-full border-2 border-400/40 bg-100/70 p-1"
      role="group"
      aria-label={t("nav.language")}
    >
      <Languages
        className="ml-1.5 h-4 w-4 text-700"
        aria-hidden="true"
        focusable="false"
      />
      {SUPPORTED_LOCALES.map((locale) => {
        const isActive = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => change(locale)}
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-600 ${
              isActive
                ? "bg-600 text-white shadow-sm"
                : "text-700 hover:bg-300/70"
            }`}
          >
            {LABELS[locale]}
          </button>
        );
      })}
    </div>
  );
}
