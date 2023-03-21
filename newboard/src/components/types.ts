/**
 * Properties of card object
 */
export interface Card {
  id: string;
  title: string;
}

/**
 * Properties of column object
 */
export interface Column {
  id: string;
  title: string;
  cards: Card[];
}
