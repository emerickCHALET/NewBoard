import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useClickOutside } from "../hooks";
import { Container, Title, Input, EditTitleButton } from "./styles";

/**
 * interface who contains props of a card
 */
interface CardProps {
  id: string;
  title: string;
  editCard: (id: string, title: string) => void;
  currentIndex: number;
}

/**
 * interface of props about a new card
 */
interface NewCardProps {
  onSuccess: (id: string, title: string) => void;
  onDismiss: () => void;
}

/**
 * Container of a new card
 * @param onSuccess
 * @param onDismiss
 */
export const NewCard: React.FC<NewCardProps> = ({ onSuccess, onDismiss }) => {
  const [currentTitle, setCurrentTitle] = useState("");

  const ref = useClickOutside(() => {
    onDismiss();
  })


  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentTitle) {
        onSuccess(uuidv4(), currentTitle);
      }
    }
    if (e.key === "Escape") {
      setCurrentTitle("");
      if (typeof onDismiss === "function") {
        onDismiss();
      }
    }
  };

  return (
    <Container>
      <Input
        autoFocus
        ref={ref as any}
        rows={1}
        value={currentTitle}
        spellCheck={false}
        onChange={({ target }) => setCurrentTitle(target.value)}
        onKeyDown={onKeyDown}
      />
    </Container>
  );
};

/**
 * Container of a card
 * @param title
 * @param id
 * @param editCard
 * @param currentIndex
 */
const Card: React.FC<CardProps> = ({ title, id, editCard, currentIndex }) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const ref = useClickOutside(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  })

  useEffect(() => {
    if (isEditing) {
      ref?.current?.focus?.();
      //ref?.current?.select?.();
    }
  }, [isEditing]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentTitle) {
        setIsEditing(false);
        editCard(id, currentTitle);
      }
    }
    if (e.key === "Escape") {
      setCurrentTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={id} index={currentIndex}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {!isEditing && (
            <>
              <EditTitleButton
                onClick={() => {
                  setIsEditing(true);
                }}
              />
              <Title>{title}</Title>
            </>
          )}
          {isEditing && (
            <Input
              ref={ref as any}
              rows={1}
              value={currentTitle}
              spellCheck={false}
              onChange={({ target }) => setCurrentTitle(target.value)}
              onKeyDown={onKeyDown}
            />
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default Card;
