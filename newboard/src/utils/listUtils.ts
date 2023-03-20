import { Card, Column } from "../types";

/**
 * Function who update the column by her Id
 * @param columns
 * @param updatedColumn
 */
export function updateColumnById(
  columns: Column[],
  updatedColumn: Omit<Column, "cards">
) {
  return columns.map((column) =>
    column.id === updatedColumn.id
      ? { ...column, title: updatedColumn.title }
      : column
  );
}

/**
 * Function who add a card to a column
 * @param columns
 * @param columnId
 * @param newCard
 */
export function addCardToColumn(
  columns: Column[],
  columnId: string,
  newCard: Card
) {
  return columns.map((column) =>
    column.id === columnId
      ? {
          ...column,
          cards: [...column.cards, newCard]
        }
      : column
  );
}

/**
 * Function who update a card dy her id
 * @param columns
 * @param columnId
 * @param newCard
 */
export function updateCardById(
  columns: Column[],
  columnId: string,
  newCard: Card
) {
  return columns.map((column) =>
    column.id === columnId
      ? {
          ...column,
          cards: column.cards.map((card) =>
            card.id === newCard.id ? newCard : card
          )
        }
      : column
  );
}

/**
 * Function who reoerder the list of cards
 * @param list
 * @param startIndex
 * @param endIndex
 */
export function reorderList<T>(
  list: T[],
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * Function who switch cards of a column
 * @param columns
 * @param sourceColumnIndex
 * @param sourceCardIndex
 * @param destinationColumnIndex
 * @param destinationCardIndex
 */
export const switchCards = (
  columns: Column[],
  sourceColumnIndex: number,
  sourceCardIndex: number,
  destinationColumnIndex: number,
  destinationCardIndex: number
) => {
  const card = { ...columns[sourceColumnIndex].cards[sourceCardIndex] };

  if (sourceColumnIndex === destinationColumnIndex) {
    return columns.map((column, index) =>
      index === sourceColumnIndex
        ? {
            ...column,
            cards: reorderList<Card>(
              column.cards,
              sourceCardIndex,
              destinationCardIndex
            )
          }
        : column
    );
  }

  return columns.map((column, index) => {
    if (index === sourceColumnIndex) {
      return {
        ...column,
        cards: column.cards.filter(
          (_, cardIndex) => cardIndex !== sourceCardIndex
        )
      };
    }
    if (index === destinationColumnIndex) {
      const temp = [...column.cards];
      temp.splice(destinationCardIndex, 0, card);

      return {
        ...column,
        cards: temp
      };
    }
    return column;
  });
};
