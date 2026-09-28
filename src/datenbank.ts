import type { CollectionEntry } from 'astro:content';

// Holt beim Bauen der Seite Bild und Eckdaten aus freien Datenbanken:
// Bücher von Open Library, Platten von MusicBrainz (Cover vom Cover Art Archive),
// Filme von TMDB (braucht den Schlüssel TMDB_TOKEN).
// Gesucht wird nach Titel und "von". Klappt etwas nicht, bleibt der Eintrag wie er ist.

export interface Anreicherung {
  bildUrl?: string;
  von?: string;
  jahr?: number;
  quelle?: 'Open Library' | 'MusicBrainz' | 'TMDB';
}

const USER_AGENT = 'Fundstuecke/0.1 (https://github.com/Max-lab-code/first-try)';
const cache = new Map<string, Promise<Anreicherung>>();

export function anreichern(eintrag: CollectionEntry<'eintraege'>): Promise<Anreicherung> {
  if (!cache.has(eintrag.id)) {
    cache.set(
      eintrag.id,
      abrufen(eintrag)
        .then((ergebnis) => {
          if (ergebnis.quelle) {
            console.log(`[datenbank] ${eintrag.id}: ${ergebnis.quelle}, ${ergebnis.bildUrl ? 'mit' : 'ohne'} Bild`);
          }
          return ergebnis;
        })
        .catch((fehler) => {
          console.warn(`[datenbank] ${eintrag.id}: ${fehler}`);
          return {};
        }),
    );
  }
  return cache.get(eintrag.id)!;
}

async function abrufen(eintrag: CollectionEntry<'eintraege'>): Promise<Anreicherung> {
  const d = eintrag.data;
  if (d.bild || d.datenbank === false) return {};
  switch (d.art) {
    case 'buch':
      return buch(d.titel, d.von);
    case 'platte':
      return platte(d.titel, d.von);
    case 'film':
      return film(d.titel, d.jahr);
    default:
      return {};
  }
}

async function json(url: string, headers: Record<string, string> = {}) {
  const antwort = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers }, signal: AbortSignal.timeout(15000) });
  if (!antwort.ok) throw new Error(`${antwort.status} bei ${url}`);
  return antwort.json();
}

async function bildGibtEs(url: string) {
  const antwort = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(15000) });
  return antwort.ok;
}

async function buch(titel: string, von?: string): Promise<Anreicherung> {
  const params = new URLSearchParams({ title: titel, limit: '1', fields: 'author_name,first_publish_year,cover_i' });
  if (von) params.set('author', von);
  const daten = await json(`https://openlibrary.org/search.json?${params}`);
  const treffer = daten.docs?.[0];
  if (!treffer) return {};
  return {
    bildUrl: treffer.cover_i ? `https://covers.openlibrary.org/b/id/${treffer.cover_i}-L.jpg` : undefined,
    von: treffer.author_name?.[0],
    jahr: treffer.first_publish_year,
    quelle: 'Open Library',
  };
}

let letzteMusicBrainzAnfrage = Promise.resolve();

async function platte(titel: string, von?: string): Promise<Anreicherung> {
  // MusicBrainz erlaubt nur eine Anfrage pro Sekunde.
  const warten = letzteMusicBrainzAnfrage;
  letzteMusicBrainzAnfrage = warten.then(() => new Promise((r) => setTimeout(r, 1100)));
  await warten;

  const suche = [`releasegroup:"${titel}"`, von && `artist:"${von}"`].filter(Boolean).join(' AND ');
  const daten = await json(
    `https://musicbrainz.org/ws/2/release-group/?${new URLSearchParams({ query: suche, limit: '1', fmt: 'json' })}`,
  );
  const treffer = daten['release-groups']?.[0];
  if (!treffer) return {};
  const bildUrl = `https://coverartarchive.org/release-group/${treffer.id}/front-500`;
  const jahr = parseInt(treffer['first-release-date'], 10);
  return {
    bildUrl: (await bildGibtEs(bildUrl)) ? bildUrl : undefined,
    von: treffer['artist-credit']?.[0]?.name,
    jahr: Number.isNaN(jahr) ? undefined : jahr,
    quelle: 'MusicBrainz',
  };
}

async function film(titel: string, jahr?: number): Promise<Anreicherung> {
  const token = import.meta.env.TMDB_TOKEN ?? process.env.TMDB_TOKEN;
  if (!token) return {};
  const auth = { Authorization: `Bearer ${token}` };
  const params = new URLSearchParams({ query: titel, language: 'de-DE' });
  if (jahr) params.set('year', String(jahr));
  const suche = await json(`https://api.themoviedb.org/3/search/movie?${params}`, auth);
  const treffer = suche.results?.[0];
  if (!treffer) return {};
  const credits = await json(`https://api.themoviedb.org/3/movie/${treffer.id}/credits`, auth);
  const regie = credits.crew?.find((c: { job: string }) => c.job === 'Director')?.name;
  return {
    bildUrl: treffer.poster_path ? `https://image.tmdb.org/t/p/w780${treffer.poster_path}` : undefined,
    von: regie,
    jahr: treffer.release_date ? parseInt(treffer.release_date, 10) : undefined,
    quelle: 'TMDB',
  };
}
