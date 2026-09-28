# Fundstücke

Website für kuratierte Filme, Bücher, Platten und Ausstellungen, die man sonst nicht findet.

## Einen neuen Eintrag hinzufügen

Lege im Ordner `src/content/eintraege/` eine neue Datei an, zum Beispiel `mein-film.md`.
Der Dateiname wird zur Adresse der Seite. Am einfachsten kopierst du einen vorhandenen Eintrag und passt ihn an:

```markdown
---
titel: Petite Maman
art: film            # film, buch, platte oder ausstellung
von: Céline Sciamma  # Regie, Autorin, Band oder Ort
jahr: 2021           # optional
teaser: Ein Satz, der neugierig macht.
link: https://...    # optional
bild: ./mein-film.jpg  # optional, Bild liegt im selben Ordner
bildnachweis: Verleih XY  # optional, wer das Bild gemacht hat
hinzugefuegt: 2026-09-28
---

Hier steht der längere Text, der auf der Seite des Eintrags erscheint.
```

Bei Büchern, Platten und Filmen sucht die Seite beim Veröffentlichen automatisch nach Titel und „von“
in freien Datenbanken (Open Library, MusicBrainz, TMDB) und holt Cover oder Poster sowie fehlende Angaben
wie Jahr und Regie. Findet sie den falschen Treffer, hilft es, `von` und `jahr` genauer anzugeben.
Mit `datenbank: false` schaltest du die Suche für einen Eintrag ab. Ein eigenes `bild` hat immer Vorrang.

Für Filme braucht die Seite einen TMDB-Schlüssel. Er wird auf GitHub unter
Settings → Secrets and variables → Actions als Secret mit dem Namen `TMDB_TOKEN` eingetragen
(dort den „API Read Access Token“ von TMDB verwenden).

Ohne Bild zeigt die Kachel ein gestaltetes Motiv passend zur Art. Nimm nur Bilder, die du verwenden darfst,
zum Beispiel eigene Fotos oder Pressebilder von Verleihen, Verlagen, Labels und Museen.

Sobald die Änderung auf `main` landet, wird die Seite automatisch neu veröffentlicht.

## Lokal ansehen

```sh
npm install
npm run dev
```

Dann im Browser http://localhost:4321/first-try/ öffnen.
