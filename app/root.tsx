import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { createI18n } from "~/i18n/i18n";
import { getLocaleFromRequest } from "~/i18n/locale";
import { DEFAULT_LOCALE, type Locale } from "~/i18n/resources";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Outfit:wght@100..900&display=swap",
  },
];

export function loader({ request }: LoaderFunctionArgs) {
  return {
    locale: getLocaleFromRequest(request),
    year: new Date().getFullYear(),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const locale: Locale = data?.locale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-300 font-outfit text-800">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  const [i18n] = useState(() => createI18n(locale));

  useEffect(() => {
    const sync = (next: string) => {
      document.documentElement.lang = next;
    };
    i18n.on("languageChanged", sync);
    return () => {
      i18n.off("languageChanged", sync);
    };
  }, [i18n]);

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}
