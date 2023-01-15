import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {
    DragDropContext,
    DropResult,
    Droppable,
    DraggableLocation
} from "react-beautiful-dnd";
import "../styles.css"
import {
    reorderList,
    switchCards,
    updateColumnById,
    addCardToColumn,
    updateCardById
} from "../utils/listUtils";
import Column, { NewColumn } from "../components/Column";
import AddColumnButton from "../components/AddColumnButton";

import { Card, Column as ColumnInterface } from "../types";

interface AddNewColumnProps {
    columns: ColumnInterface[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnInterface[]>>;
}

const AddNewColumn: React.FC<AddNewColumnProps> = ({ columns, setColumns }) => {
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const cancelColumnAddition = () => {
        setIsAddingColumn(false);
    };

    const addColumn = (id: string, title: string) => {
        setColumns([...columns, { id, title, cards: [] }]);
        setIsAddingColumn(false);
    };

    if (isAddingColumn) {
        return <NewColumn onSuccess={addColumn} onDismiss={cancelColumnAddition} />;
    }

    return <AddColumnButton onClick={() => setIsAddingColumn(true)} />;
};
const Kanban = () => {

    const [columns, setColumns] = useState<ColumnInterface[]>([
        { id: "1", title: "Teste", cards: [] },
        { id: "2", title: "Teste", cards: [] }
    ]);

    const updateColumn = (id: string, title: string) => {
        setColumns(updateColumnById(columns, { id, title }));
    };

    const updateCard = (newCard: Card, columnId: string) => {
        setColumns(updateCardById(columns, columnId, newCard));
    };

    const addCard = (newCard: Card, columnId: string) => {
        setColumns(addCardToColumn(columns, columnId, newCard));
    };

    const onCardDrag = (result: DropResult) => {
        const sourceColumnIndex = columns.findIndex(
            (column) => column.id === result.source.droppableId
        );
        const sourceCardIndex = result.source.index;

        const destinationColumnIndex = columns.findIndex(
            (column) => column.id === result.destination?.droppableId
        );
        const destinationCardIndex = (result.destination as DraggableLocation)
            .index;

        setColumns(() =>
            switchCards(
                columns,
                sourceColumnIndex,
                sourceCardIndex,
                destinationColumnIndex,
                destinationCardIndex
            )
        );
    };

    const onColumnDrag = (result: DropResult) => {
        setColumns(
            reorderList<ColumnInterface>(
                columns,
                result.source.index,
                (result.destination as DraggableLocation).index
            )
        );
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        if (result.type === "card") {
            onCardDrag(result);
            return;
        }

        if (result.type === "column") {
            onColumnDrag(result);
            return;
        }
    };

    return (

        <div className="wrap">
            <SideBar/>
            <div className="App">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId={`parent`}
                        direction="horizontal"
                        type="column"
                    >
                        {(provided, snapshot) => (
                            <div
                                className="list"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {columns.map((column, index) => (
                                    <Column
                                        currentIndex={index}
                                        key={column.id}
                                        id={column.id}
                                        title={column.title}
                                        cards={column.cards}
                                        addCard={addCard}
                                        updateCard={updateCard}
                                        editColumn={updateColumn}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div>
                        <AddNewColumn columns={columns} setColumns={setColumns} />
                    </div>
                </DragDropContext>
            </div>
            <Footer/>
        </div>
    );
}

export default Kanban
