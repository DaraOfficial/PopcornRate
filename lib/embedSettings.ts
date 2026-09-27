'use client';

export interface EmbedSettings {
  enabled: boolean;
  movieTemplate: string;
  tvTemplate: string;
}

export const EXAMPLE_MOVIE_EMBED_TEMPLATE =
  'https://stellar.rip/en/watch/embed/movie/{id}?theme=ff3333&title=true&poster=true&autoPlay=false&startAt=0';

export const EXAMPLE_TV_EMBED_TEMPLATE =
  'https://stellar.rip/en/watch/embed/tv/{id}-{season}-{episode}?theme=ff3333&title=true&poster=true&autoPlay=false&startAt=0&nextButton=true&autoNext=true';

const STORAGE_KEY = 'popcorn-embed-settings';
export const EMBED_SETTINGS_EVENT = 'popcorn:embed-settings-updated';

const DEFAULT_SETTINGS: EmbedSettings = {
  enabled: false,
  movieTemplate: '',
  tvTemplate: '',
};

export function getEmbedSettings(): EmbedSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed?.enabled),
      movieTemplate: typeof parsed?.movieTemplate === 'string' ? parsed.movieTemplate : '',
      tvTemplate: typeof parsed?.tvTemplate === 'string' ? parsed.tvTemplate : '',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveEmbedSettings(next: EmbedSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EMBED_SETTINGS_EVENT, { detail: next }));
  } catch {
    // ignore storage errors
  }
}

/**
 * Resolves a user-provided embed link template into a playable embed URL.
 * Supports {id}, {tmdb}, {tmdb_id}, {season}, {s}, {episode}, {e}, {ep} placeholders,
 * as well as direct base URLs.
 */
export function buildEmbedUrl(
  settings: EmbedSettings,
  options: {
    type: 'movie' | 'tv';
    id: string | number;
    season?: number;
    episode?: number;
  }
): string | null {
  if (!settings.enabled) return null;

  const { type, id, season = 1, episode = 1 } = options;
  const rawTemplate =
    type === 'movie'
      ? settings.movieTemplate.trim() || settings.tvTemplate.trim()
      : settings.tvTemplate.trim() || settings.movieTemplate.trim();

  if (!rawTemplate) return null;

  let url = rawTemplate;

  // If user pasted a movie template into TV or vice-versa, adapt stellar-style /movie/{id} <-> /tv/{id}-{season}-{episode}
  if (type === 'tv' && !settings.tvTemplate.trim() && url.includes('/movie/{id}')) {
    url = url.replace('/movie/{id}', '/tv/{id}-{season}-{episode}');
  } else if (type === 'movie' && !settings.movieTemplate.trim() && url.includes('/tv/{id}-{season}-{episode}')) {
    url = url.replace('/tv/{id}-{season}-{episode}', '/movie/{id}');
  }

  const hasIdToken = /\{(id|tmdb|tmdb_id)\}/i.test(url);

  url = url
    .replace(/\{(id|tmdb|tmdb_id)\}/gi, String(id))
    .replace(/\{(season|s)\}/gi, String(season))
    .replace(/\{(episode|ep|e)\}/gi, String(episode));

  // If the user pasted a base URL without {id} placeholder, append id/season/episode intelligently
  if (!hasIdToken) {
    try {
      const parsed = new URL(url);
      const cleanPath = parsed.pathname.replace(/\/+$/, '');
      if (type === 'movie') {
        parsed.pathname = `${cleanPath}/${id}`;
      } else {
        parsed.pathname = `${cleanPath}/${id}-${season}-${episode}`;
      }
      url = parsed.toString();
    } catch {
      // Return as-is if not a standard URL
    }
  }

  return url;
}
