import { Music, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PROVIDER_NAMES, parsePlaylistUrl } from "~/utils/player";

interface MusicPlayerProps {
  url: string;
  onChange: (url: string) => void;
}

export default function MusicPlayer({ url, onChange }: MusicPlayerProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  const embed = useMemo(() => (url ? parsePlaylistUrl(url) : null), [url]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;

    if (!parsePlaylistUrl(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setDraft("");
    onChange(value);
  };

  const remove = () => {
    setInvalid(false);
    setDraft("");
    onChange("");
  };

  return (
    <section className="w-full" aria-labelledby="player-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2
          id="player-heading"
          className="flex items-center gap-2 text-lg font-bold text-800"
        >
          <Music className="h-5 w-5 text-600" aria-hidden="true" />
          {t("player.title")}
        </h2>
        {embed ? (
          <span className="rounded-full bg-300/70 px-2.5 py-1 text-xs font-bold text-700">
            {PROVIDER_NAMES[embed.provider]}
          </span>
        ) : null}
      </div>

      <form
        onSubmit={submit}
        className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-400/40 bg-100 p-2 transition-colors focus-within:border-600"
      >
        <input
          type="url"
          inputMode="url"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (invalid) setInvalid(false);
          }}
          placeholder={t("player.placeholder")}
          aria-label={t("player.placeholder")}
          aria-invalid={invalid}
          className="min-w-0 flex-1 border-0 bg-transparent px-2 text-800 outline-none placeholder:text-600/70 focus:ring-0"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="whitespace-nowrap rounded-xl bg-600 px-4 py-2 text-sm font-bold text-white shadow transition-all hover:bg-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-600 focus-visible:ring-offset-2"
        >
          {embed ? t("player.change") : t("player.add")}
        </button>
      </form>

      {invalid ? (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-800"
        >
          {t("player.invalid")}
        </p>
      ) : null}

      {embed ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border-2 border-400/30 bg-200">
            <iframe
              key={embed.embedUrl}
              src={embed.embedUrl}
              title={t("player.frameTitle", {
                provider: PROVIDER_NAMES[embed.provider],
              })}
              height={embed.height}
              className="w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; clipboard-write; picture-in-picture; fullscreen"
            />
          </div>

          {embed.provider === "spotify" ? (
            <p className="text-xs leading-relaxed text-700">
              {t("player.spotifyNote")}
            </p>
          ) : null}

          <button
            type="button"
            onClick={remove}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-700 transition-colors hover:bg-danger/15 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {t("player.remove")}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-400/50 px-6 py-10 text-center">
          <p className="font-semibold text-800">{t("player.empty")}</p>
          <p className="mt-1 text-sm text-700">{t("player.emptyHint")}</p>
        </div>
      )}
    </section>
  );
}
