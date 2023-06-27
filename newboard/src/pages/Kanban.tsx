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
} from "../components/utils/listUtils";
import Column, { NewColumn } from "../components/column";
import AddColumnButton from "../components/addColumnButton";
import { Card, Column as ColumnInterface } from "../components/types";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import {urlApiSocket} from "../App";
import {useLocation, useNavigate, useParams} from "react-router";
import Users from "../classes/Users";
import * as io from "socket.io-client";
import * as AiIcons from "react-icons/ai";
import ApiService from "../services/ApiService";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Facepile from "../components/Facepile";

/**
 * Props of new column
 */
interface AddNewColumnProps {
    columns: ColumnInterface[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnInterface[]>>;
}

/**
 * Kanban Page Contructor
 */
const Kanban = () => {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);
    const apiService = new ApiService();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation()
    // Initialize boardId here because the app crashes when we click on menu button, location.state.boardId would be null ??
    let roomId = 0
    const {boardId} = useParams<{ boardId: string}>()

    if(location.state != null){
        roomId = location.state.roomId
    }

    /**
     * Request who add assign a user to a board
     * @param userId
     */
    async function postBoardUser(userId: number): Promise<boolean> {
        let payload = {userID: userId, boardID: boardId};
        let result = false;

        const response = await apiService.post("boardUsers",payload, token!, navigate)
        if (response && response.status === 200) {
            result = true
        }

        return result;
    }

    /**
     * forceSelectOnlyOption is used to avoid a bug when our select only has 1 option and would take initial values instead of the only option available
     * @param options
     * @param values
     */
    const forceSelectOnlyOption = (options: Users[], values: FormikValues): void => {
        if (options.length === 1) {
            values.userId = options[0].id;
        }
        handleSubmit(values)
    };

    const [users, setUsers] = useState<Users[]>([])

    const className = localStorage.getItem("userClass")

    /**
     * Request who get Users who can be assigned to a board
     */
    const getUsers = async () => {
        const response = await apiService.get("boardByClassIdAndBoardId/" + className + "/" + boardId, token!, navigate)
        if (response && response.status === 200) {
            setUsers(response.data.data);
        }
    }

    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleSubmit = async (values: FormikValues) => {
        const result = await postBoardUser(values.userId);
        if (result) {
            handleClose()
            window.location.reload()
        }
    };

    const initialValues = {
        userId: 0
    };

    /**
     * Request who get the content of a board where the page is initialized
     */
    const getBoard = async () => {
        if(token !== null){
            const response = await apiService.get("boards/" + boardId, token!, navigate)
            if (response && response.status === 200) {
                if (response.data.data.content != null) {
                    setColumns(JSON.parse(response.data.data.content))
                    setBoardName(response.data.data.name)
                }
                setIsLoading(false)
            }
        }
    }

    const socket = io.connect(urlApiSocket);

    let [boardName,setBoardName] = useState<string>("")
    let [columns, setColumns] = useState<ColumnInterface[]>([]);

    /**
     * Send via socket io a changement of the content of the board to the others users
     */
    const SendKanbanToSocket = async () => {
        let json = await JSON.stringify(columns)
        socket.emit('kanban', json, boardId);
    }

    /**
     * Function who add a column to the kanban
     * @param columns
     * @param setColumns
     */
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

    /**
     * Function who update column properties
     * @param id
     * @param title
     */
    const updateColumn = (id: string, title: string) => {
        setColumns(updateColumnById(columns, { id, title }));
        sendKanban = false;
        isSentToSocket(false);
    };

    /**
     * Function who update card properties
     * @param newCard
     * @param columnId
     */
    const updateCard = (newCard: Card, columnId: string) => {
        setColumns(updateCardById(columns, columnId, newCard));
        sendKanban = false;
        isSentToSocket(false);
    };

    /**
     * Function who add card
     * @param newCard
     * @param columnId
     */
    const addCard = (newCard: Card, columnId: string) => {
        setColumns(addCardToColumn(columns, columnId, newCard));
        sendKanban = false;
        isSentToSocket(false);
    };

    /**
     * Function who change the properties after a drag of a card
     * @param result
     */
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

    /**
     * Function who change the properties after a drag of a column
     * @param result
     */
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

    const [usersBoard, setUsersBoard] = useState<Users[]>([])
    /**
     * Request who get Users who can be assigned to a board
     */
    const getUsersFromBoard = async () => {
        const response = await apiService.get("userByBoardId/" + boardId, token!, navigate)
        if (response && response.status === 200) {
            setUsersBoard(response.data.data);
        }
    }

    useEffect( () => {
        if(!sendKanban){
            SendKanbanToSocket()
            isSentToSocket(true)
            sendKanban = true
        }
    },[sendKanban])

    useEffect(() => {
        if (token !== null){
            getUsers()
            getBoard()
            getUsersFromBoard()
        }
    }, [token])

    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('joinRoomBoard', boardId);
    }, []);

    socket.on('messageKanban', (data) => {
        setColumns(JSON.parse(data))
    });

    /**
     * Loading animation
     */
    if (isLoading) {
        return <div className="wrap">
            <SideBar/>
            <div className={"workspacePresentation"}>
                <div className={"workspace-container"}>
                    <img alt={"loading"} className={'iconLoading'} src={"../loading.gif"}/>
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
                        onSubmit={(values) => forceSelectOnlyOption(users, values)}
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
            <Navbar bg="transparent" expand="lg" className={"navbar-blur"}>
                <Container fluid>
                    <Container>
                        <Navbar.Brand className={"kanban-Name"}>{boardName}</Navbar.Brand>
                    </Container>
                    <Navbar.Toggle />
                    <Navbar.Collapse >
                        <Button variant={"light"} className={"ml-auto btn btn-outline-primary btn-block d-flex justify-content-center align-items-center"} onClick={() => {handleShow()}}>
                            <AiIcons.AiOutlineUserAdd />
                            Partager
                        </Button>
                    </Navbar.Collapse>
                    <Navbar.Collapse>
                        <Facepile users={usersBoard}/>
                    </Navbar.Collapse>
                    <Navbar.Collapse className={"m-lg-2"}>
                        <Button variant={"light"} className={"ml-auto btn btn-outline-primary btn-block d-flex justify-content-center align-items-center"} onClick={() => {
                            navigate(`/chat/${roomId}`)
                        }}><AiIcons.AiFillWechat /> Chat</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br/>
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
