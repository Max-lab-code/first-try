import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Jeder Eintrag ist eine Markdown-Datei in src/content/eintraege/.
// Oben stehen die Eckdaten, darunter der kurze Text, der neugierig macht.
const eintraege = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eintraege' }),
  schema: ({ image }) => z.object({
    titel: z.string(),
    art: z.enum(['film', 'buch', 'platte', 'ausstellung']),
    von: z.string().optional(),
    jahr: z.number().optional(),
    teaser: z.string(),
    link: z.string().url().optional(),
    // Bild liegt neben der Markdown-Datei, z. B. bild: ./stoner.jpg
    bild: image().optional(),
    bildnachweis: z.string().optional(),
    // false schaltet die automatische Suche in den Datenbanken ab
    datenbank: z.boolean().optional(),
    hinzugefuegt: z.coerce.date(),
  }),
});

export const collections = { eintraege };
