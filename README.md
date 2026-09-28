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
hinzugefuegt: 2026-09-28
---

Hier steht der längere Text, der auf der Seite des Eintrags erscheint.
```

Sobald die Änderung auf `main` landet, wird die Seite automatisch neu veröffentlicht.

## Lokal ansehen

```sh
npm install
npm run dev
```

Dann im Browser http://localhost:4321/first-try/ öffnen.
