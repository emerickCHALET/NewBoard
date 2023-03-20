/**
 * Properties of Card object
 */
export interface Card {
  id: string;
  title: string;
}

/**
 * Properties of Column object
 */
export interface Column {
  id: string;
  title: string;
  cards: Card[];
}
