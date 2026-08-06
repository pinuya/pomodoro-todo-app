import { FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useRouteLoaderData, type MetaFunction } from "react-router";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import PomodoroTimer from "~/components/Pomodoro";
import type { loader as rootLoader } from "~/root";
import "~/styles/custom-scrollbar.css";

export const meta: MetaFunction = () => [
  { title: "Pomodoro - ToDo Site" },
  {
    name: "description",
    content:
      "Cronômetro Pomodoro online com tarefas, durações personalizáveis, som e notificações.",
  },
];

export default function Index() {
  const { t } = useTranslation();
  const year = useRouteLoaderData<typeof rootLoader>("root")?.year;

  const steps = [
    t("about.step1"),
    t("about.step2"),
    t("about.step3"),
    t("about.step4"),
    t("about.step5"),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-40 border-b-2 border-400/40 bg-400/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-800 sm:gap-3"
          >
            <img
              src="/favicon.ico"
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-hidden="true"
            />
            <span className="font-archivo text-lg font-semibold text-800 sm:text-xl">
              {t("nav.title")}
            </span>
          </Link>

          <LanguageSwitcher />
        </div>
      </nav>

      <main className="flex-grow">
        <section className="flex justify-center px-4 py-8 sm:py-12">
          <PomodoroTimer />
        </section>

        <section className="border-t-2 border-400/30 bg-100 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 font-archivo text-2xl font-semibold leading-snug text-800 sm:text-3xl">
              {t("about.heading")}
            </h1>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-900">
                {t("about.whatTitle")}
              </h2>
              <div className="h-1 w-8 rounded-full bg-350" />
              <p className="leading-relaxed text-700">
                {t("about.whatBody")}{" "}
                <span className="text-500">{t("about.source")}</span>
              </p>
            </div>

            <div className="mt-10 space-y-3">
              <h2 className="text-xl font-semibold text-900">
                {t("about.howTitle")}
              </h2>
              <div className="h-1 w-8 rounded-full bg-350" />
              <ol className="list-inside list-decimal space-y-2 leading-relaxed text-700">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-400/30 bg-100 px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
          <p className="text-sm text-700">{t("footer.rights", { year })}</p>
          <a
            href="https://github.com/pinuya"
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t("footer.github")}
            className="rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
          >
            <FaGithub className="h-6 w-6 text-500 transition-colors hover:text-800" />
          </a>
        </div>
      </footer>
    </div>
  );
}
