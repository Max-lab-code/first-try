export const arten = {
  film: 'Film',
  buch: 'Buch',
  platte: 'Platte',
  ausstellung: 'Ausstellung',
} as const;

export type Art = keyof typeof arten;
