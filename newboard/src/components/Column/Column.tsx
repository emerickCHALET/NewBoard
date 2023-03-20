import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Draggable, Droppable } from "react-beautiful-dnd";

import Card, { NewCard } from "../Card";
import { useClickOutside } from "../../hooks";

import { Card as CardInterface } from "../../types";

import {
  Container,
  Header,
  CardList,
  Title,
  Button,
  Input,
  EditTitleButton
} from "./styles";

/**
 * Props of column object
 */
interface ColumnProps {
  id: string;
  title: string;
  cards: CardInterface[];
  addCard: (card: CardInterface, columnId: string) => void;
  updateCard: (card: CardInterface, columnId: string) => void;
  editColumn: (id: string, title: string) => void;
  currentIndex: number;
}

/**
 * Props of New Column
 */
interface NewColumnProps {
  onSuccess: (id: string, title: string) => void;
  onDismiss: () => void;
}

/**
 * Container of a new Column
 * @param onSuccess
 * @param onDismiss
 * @constructor
 */
export const NewColumn: React.FC<NewColumnProps> = ({
  onSuccess,
  onDismiss
}) => {
  const [currentTitle, setCurrentTitle] = useState("");

  const ref = useClickOutside(() => {
    onDismiss();
  })

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSuccess(uuidv4(), currentTitle);
    }
    if (e.key === "Escape") {
      setCurrentTitle("");
      onDismiss();
    }
  };

  return (
    <Container>
      <Header>
        <Title>{currentTitle}</Title>
        <Input
          autoFocus
          isEditing
          ref={ref as any}
          rows={1}
          spellCheck={false}
          value={currentTitle}
          onChange={({ target }) => setCurrentTitle(target.value)}
          onKeyDown={onKeyDown}
        />
      </Header>
    </Container>
  );
};

let cardListRef: HTMLDivElement | null = null;

/**
 * Container of a Column
 * @param id
 * @param title
 * @param cards
 * @param addCard
 * @param updateCard
 * @param editColumn
 * @param currentIndex
 * @constructor
 */
const Column: React.FC<ColumnProps> = ({
  id,
  title,
  cards,
  addCard,
  updateCard,
  editColumn,
  currentIndex
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const cardListRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      cardListRef = node;
    }
  }, []);

  const ref = useClickOutside(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  })

  useEffect(() => {
    if (isEditing) {
      ref?.current?.focus?.();
      //ref?.current?.select?.();
    } else {
      ref?.current?.blur?.();
    }
  }, [isEditing]);

  useEffect(() => {
    if (cardListRef) {
      cardListRef.scrollTop = cardListRef.scrollHeight;
    }
  }, [isAddingCard]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      editColumn(id, currentTitle);
    }
    if (e.key === "Escape") {
      setCurrentTitle(title);
      setIsEditing(false);
    }
  };

  const editCardTitle = (cardId: string, title: string) => {
    updateCard({ id: cardId, title }, id);
  };

  const onNewCardDissmiss = () => {
    setIsAddingCard(false);
  };

  const onNewCardSuccess = (cardId: string, title: string) => {
    addCard({ id: cardId, title }, id);
    setIsAddingCard(false);
  };

  return (
    <Draggable draggableId={id} index={currentIndex}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Header>
            <Title>{currentTitle}</Title>
            {!isEditing && (
              <>
                <EditTitleButton
                  onClick={() => {
                    setIsEditing(true);
                  }}
                />
              </>
            )}
            <Input
              isEditing={isEditing}
              ref={ref as any}
              rows={1}
              spellCheck={false}
              value={currentTitle}
              onChange={({ target }) => setCurrentTitle(target.value)}
              onKeyDown={onKeyDown}
            />
          </Header>
          <Droppable droppableId={id} type="card">
            {(provided, snapshot) => (
              <CardList
                ref={(realRef) => {
                  provided.innerRef(realRef);
                  cardListRefCallback(realRef);
                }}
                {...provided.droppableProps}
              >
                {cards.map((card, index) => (
                  <Card
                    currentIndex={index}
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    editCard={editCardTitle}
                  />
                ))}
                {isAddingCard && (
                  <NewCard
                    onSuccess={onNewCardSuccess}
                    onDismiss={onNewCardDissmiss}
                  />
                )}
                {provided.placeholder}
              </CardList>
            )}
          </Droppable>
          {!isAddingCard && (
            <Button onClick={() => setIsAddingCard(true)}>
              Ajouter une carte
            </Button>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
