export type PlayerProvider =
  | "youtube"
  | "spotify"
  | "soundcloud"
  | "deezer"
  | "appleMusic";

export interface Embed {
  provider: PlayerProvider;
  /** URL for the provider's official iframe player. */
  embedUrl: string;
  /** Player height in px — each provider has its own natural size. */
  height: number;
}

export const PROVIDER_NAMES: Record<PlayerProvider, string> = {
  youtube: "YouTube",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
  appleMusic: "Apple Music",
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{1,64}$/;
const SPOTIFY_ID = /^[A-Za-z0-9]{1,64}$/;
const DIGITS = /^[0-9]{1,32}$/;

function stripWww(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function parseUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Accept "open.spotify.com/..." pasted without a scheme.
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);
    // Anything that isn't plain http(s) (javascript:, data:, ...) is rejected.
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

function youtube(url: URL): Embed | null {
  const host = stripWww(url.hostname);
  const isYouTube =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com";
  const isShortLink = host === "youtu.be";
  if (!isYouTube && !isShortLink) return null;

  const list = url.searchParams.get("list");
  if (list && YOUTUBE_ID.test(list)) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`,
      height: 260,
    };
  }

  // Fall back to a single video, so a plain track link still plays.
  const videoId = isShortLink
    ? url.pathname.slice(1)
    : url.searchParams.get("v") ?? "";
  if (videoId && YOUTUBE_ID.test(videoId)) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      height: 260,
    };
  }
  return null;
}

function spotify(url: URL): Embed | null {
  if (stripWww(url.hostname) !== "open.spotify.com") return null;

  // Localised links look like /intl-pt/playlist/<id>.
  const segments = url.pathname.split("/").filter(Boolean);
  const start = segments[0]?.startsWith("intl-") ? 1 : 0;
  const kind = segments[start];
  const id = segments[start + 1];

  const allowed = ["playlist", "album", "track", "artist", "show", "episode"];
  if (!kind || !allowed.includes(kind) || !id || !SPOTIFY_ID.test(id)) {
    return null;
  }

  const compact = kind === "track" || kind === "episode";
  return {
    provider: "spotify",
    embedUrl: `https://open.spotify.com/embed/${kind}/${id}`,
    height: compact ? 152 : 352,
  };
}

function soundcloud(url: URL): Embed | null {
  const host = stripWww(url.hostname);
  if (host !== "soundcloud.com" && host !== "m.soundcloud.com") return null;
  if (url.pathname.length <= 1) return null;

  // Rebuilt from host + path only — the pasted query string is discarded so
  // nothing from user input reaches the widget's parameters.
  const canonical = `https://soundcloud.com${url.pathname}`;
  const params = new URLSearchParams({
    url: canonical,
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_reposts: "false",
    visual: "false",
    color: "#6B7F6E",
  });

  return {
    provider: "soundcloud",
    embedUrl: `https://w.soundcloud.com/player/?${params.toString()}`,
    height: 166,
  };
}

function deezer(url: URL): Embed | null {
  if (stripWww(url.hostname) !== "deezer.com") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  // Optional locale prefix: /pt/playlist/<id>
  const start =
    segments[0] && !["playlist", "album", "track"].includes(segments[0]) ? 1 : 0;
  const kind = segments[start];
  const id = segments[start + 1];

  if (!kind || !["playlist", "album", "track"].includes(kind)) return null;
  if (!id || !DIGITS.test(id)) return null;

  return {
    provider: "deezer",
    embedUrl: `https://widget.deezer.com/widget/auto/${kind}/${id}`,
    height: 300,
  };
}

function appleMusic(url: URL): Embed | null {
  if (stripWww(url.hostname) !== "music.apple.com") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const kindIndex = segments.findIndex((s) =>
    ["playlist", "album"].includes(s)
  );
  if (kindIndex === -1) return null;

  // Rebuild from validated segments rather than reusing the raw pathname.
  const safe = segments
    .slice(0, kindIndex + 3)
    .filter((s) => /^[A-Za-z0-9._~-]+$/.test(s));
  if (safe.length < kindIndex + 2) return null;

  return {
    provider: "appleMusic",
    embedUrl: `https://embed.music.apple.com/${safe.join("/")}`,
    height: 320,
  };
}

/**
 * Turns a pasted link into an official embed. Returns null when the link isn't
 * from a supported service or doesn't contain a usable id.
 *
 * Embed URLs are always rebuilt from validated ids rather than passing the
 * pasted string through, so a crafted link can't steer the iframe elsewhere.
 */
export function parsePlaylistUrl(raw: string): Embed | null {
  const url = parseUrl(raw);
  if (!url) return null;

  return (
    youtube(url) ??
    spotify(url) ??
    soundcloud(url) ??
    deezer(url) ??
    appleMusic(url)
  );
}
