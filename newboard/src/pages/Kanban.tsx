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
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {urlApi, urlApiSocket} from "../App";
import {toast} from "react-toastify";
import {useLocation, useNavigate, useParams} from "react-router";
import Student from "../Classes/Student";
import io from 'socket.io-client';
import column from "../components/Column";
import * as AiIcons from "react-icons/ai";


interface AddNewColumnProps {
    columns: ColumnInterface[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnInterface[]>>;
}

const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};


const Kanban = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation()
    // Initialize boardId here because the app crashes when we click on menu button, location.state.boardId would be null ??
    let roomId = 0
    const {boardId} = useParams<{ boardId: string}>()

    if(location.state != null){
        roomId = location.state.roomId
    }

    async function postBoardUser(userId: number): Promise<boolean> {
        let payload = {userID: userId, boardID: boardId};
        let result = false;
        await axios
            .post(urlApi + 'boardUsers', payload, config)
            .then((response) => {
                if (response.status === 200) {
                    result = true
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if(error.response.data.disconnect === true){
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })
        return result;
    }

    const [users, setUsers] = useState<Student[]>([])

    const className = localStorage.getItem("userClass")
    const getUsers = () => {
        axios
            .get(urlApi + "boardByClassIdAndBoardId/"+ className + "/" + boardId, config)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data)
                    setUsers(response.data.data);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nReconnexion requise", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if(error.response.data.disconnect === true){
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })
    }

    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleSubmit = async (values: {userId: number}) => {
        const result = await postBoardUser(values.userId);
        if (result) {
            handleClose()
            window.location.reload()
        }
    };

    const initialValues = {
        userId: 0
    };

    // Kanban
    const getBoard = () => {
        axios
            .get(urlApi + "boards/"+ boardId, config)
            .then((response) => {
                if (response.status === 200) {
                    if(response.data.data.content != null){
                        setColumns(JSON.parse(response.data.data.content))
                    }
                    setIsLoading(false)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nReconnexion requise", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if(error.response.data.disconnect === true){
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })
    }

    const socket = io(urlApiSocket);

    let [columns, setColumns] = useState<ColumnInterface[]>([]);

    const SendKanbanToSocket = () => {
        let json = JSON.stringify(columns)
        socket.emit("kanban message", json, boardId, { exceptSelf: true });
    }

    const AddNewColumn: React.FC<AddNewColumnProps> = ({ columns, setColumns }) => {
        const [isAddingColumn, setIsAddingColumn] = useState(false);

        const cancelColumnAddition = () => {
            setIsAddingColumn(false);
        };

        const addColumn = (id: string, title: string) => {
            setColumns([...columns, { id, title, cards: [] }]);
            setIsAddingColumn(true);
            sendKanban = false;
            isSentToSocket(false);
        };

        if (isAddingColumn) {
            return <NewColumn onSuccess={addColumn} onDismiss={cancelColumnAddition} />;
        }
        return <AddColumnButton onClick={() => setIsAddingColumn(true)} />;
    };

    const updateColumn = (id: string, title: string) => {
        setColumns(updateColumnById(columns, { id, title }));
        sendKanban = false;
        isSentToSocket(false);
    };

    const updateCard = (newCard: Card, columnId: string) => {
        setColumns(updateCardById(columns, columnId, newCard));
        sendKanban = false;
        isSentToSocket(false);
    };

    const addCard = (newCard: Card, columnId: string) => {
        setColumns(addCardToColumn(columns, columnId, newCard));
        sendKanban = false;
        isSentToSocket(false);
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
        sendKanban = false;
        isSentToSocket(false);
    };

    const onColumnDrag = (result: DropResult) => {
        setColumns(
            reorderList<ColumnInterface>(
                columns,
                result.source.index,
                (result.destination as DraggableLocation).index
            )
        );
        sendKanban = false;
        isSentToSocket(false);
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

    let [sendKanban, isSentToSocket] = useState<boolean>(true);

    useEffect( () => {
        if(!sendKanban){
            SendKanbanToSocket()
            isSentToSocket(true)
            sendKanban = true
        }
    },[sendKanban])

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        getBoard()
    },[])

    const navigate = useNavigate();
    useEffect(() => {
        socket.on('connection', (msg: string) => {
        });
    }, []);

    socket.on('kanban message', (message: string) => {
        getBoard()
    });

    if (isLoading) {
        return <div className="wrap">
            <SideBar/>
            <div className={"workspacePresentation"}>
                <div className={"workspace-container"}>
                    <img className={'iconLoading'} src={"./loading.gif"}/>
                </div>
            </div>
            <Footer/>
        </div>;
    }

    return (

        <div className="wrap">
            <SideBar/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un élève au board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        <Form>
                            <fieldset className={"field-area"}>
                                <label htmlFor="name">User:</label>
                                <Field as="select" name="userId" className="form-control" type="userId">
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.email}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="name"
                                    component="small"
                                    className="text-danger"
                                />
                            </fieldset>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Fermer
                                </Button>
                                <Button variant="primary" type={"submit"}>
                                    Ajouter
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
            <br/>
            <div className={"addUser-item-div"}>
                <Button type={"button"} className={"btn-light btn-outline-primary"}  onClick={() => {
                    handleShow()
                }}>
                    <AiIcons.AiOutlineUserAdd /> Partager
                </Button>
            </div>
            <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                navigate("/chat", {state: {roomId}})
            }}>
                Chat
            </Button>
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
