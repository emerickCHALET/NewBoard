import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {useLocation, useNavigate, useParams} from "react-router";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import Boards from "../classes/Board";
import Users from "../classes/Users";
import * as AiIcons from "react-icons/ai";
import ApiService from "../services/ApiService";

function Board(){
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);

    const apiService = new ApiService();
    let userId = localStorage.getItem("userId")
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const location = useLocation();

    // Initialize workspaceId here because the app crashes when we click on menu button, location.state.workspaceId would be null ??
    const {workspaceId} = useParams<{ workspaceId: string}>()

    let roomId = 0
    if(location.state != null){
        roomId = location.state.roomId
    }

    /**
     * when we create a new board, first we create a chat room, so we can associate its id to the board,
     * then, we create the board with the roomId we just created,
     * and then we create a boardUser to associate the user to the board
     * @param values
     */
    async function postBoard(values: { name: string; }): Promise<number> {
        let payload = {name: values.name, workspaceID: workspaceId, roomId: 0};
        let result = 0
        payload.roomId = await postRoom(payload)
        const response = await apiService.post('boards', payload, token!)
        if (response && response.status === 200) {
            result = response.data.data.id
            let payload2 = { userID: localStorage.getItem('userId'), boardID: response.data.data.id};
            const response2 = await apiService.post('boardUsers', payload2, token!)
            if (response2 && response2.status === 200) {
                result = response.data.data.id
                window.location.reload()
            }
        }
        return result
    }

    async function postRoom(values: { name: string; }): Promise<number>{
        let payload = {name: values.name}
        let result = 0

        const response = await apiService.post('rooms',payload,token!,navigate)
        if (response && response.status === 200){
            result = response.data.data.id
        }

        return result
    }


    async function postWorkspaceUser(values: FormikValues): Promise<boolean> {
        let payload = {userID: values.userId, workspaceID: workspaceId};
        let result = false;

        const response = await apiService.post('workspacesUser',payload,token!,navigate)
        if (response && response.status === 200){
            toast.success("WorkspaceUser crée avec succès !", {
                position: toast.POSITION.TOP_RIGHT,
            });
            result = true
        }

        return result;
    }

    const [show, setShow] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowAddUser = () => setShowAddUser(true);
    const handleCloseAddUser = () => setShowAddUser(false)

    const handleSubmit = async (values: { name: string; }) => {
        await postBoard(values);
    };

    const handleSubmitAddUsers = async (values: FormikValues) => {
        const result = await postWorkspaceUser(values);
        if (result) {
            window.location.reload()
        }
    };

    const initialValues = {
        name: "",
        classroom: "selection"
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),

    });

    const [boards, setBoards] = useState<Boards[]>([])

    const getBoard = async () => {
        const response = await apiService.get('boardByWorkspaceIdAndUserId/' + workspaceId + "/" + userId, token!, navigate)
        if (response && response.status === 200) {
            setBoards(response.data.data)
            setIsLoading(false);
        }
    }

    const [users, setUsers] = useState<Users[]>([])

    const className = localStorage.getItem("userClass")
    const getUsers = async () => {
        const response = await apiService.get("userByClassIdAndWorkspaceId/" + className + "/" + workspaceId, token!, navigate)
        if (response && response.status === 200) {
            setUsers(response.data.data);
        }
    }

    useEffect(() => {
        if(token !== null){
            getBoard()
            getUsers()
        }
    }, [token])

    const navigate = useNavigate();

    if (isLoading) {
        return <div className="wrap">
            <SideBar/>
            <div className={"workspacePresentation"}>
                <div className={"workspace-container"}>
                    <img alt={"loading"} className={'iconLoading'} src={"./loading.gif"}/>
                </div>
            </div>
            <Footer/>
        </div>;
    }

    /**
     * forceSelectOnlyOption is used to avoid a bug when our select only has 1 option and would take initial values instead of the only option available
     * @param options
     * @param values
     */
    const forceSelectOnlyOption = (options: Users[], values: FormikValues): void => {
        if (options.length == 1) {
            values.userId = options[0].id;
        }
        handleSubmitAddUsers(values)
    };

    return (

        <div className="wrap">
            <SideBar/>
            <div className={"Content-Board-Page"} style={{height : '100%'}}>
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Créer un tableau</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleSubmit(values)}
                        >
                            <Form>
                                <fieldset className={"field-area"}>
                                    <label htmlFor="name">Name:</label>
                                    <Field name="name" className="form-control" type="text"/>
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
                                        Créer
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Formik>
                    </Modal.Body>

                </Modal>
                <Modal show={showAddUser} onHide={handleCloseAddUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un élève au Workspace</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={{userId: 'null'}}
                            onSubmit={(values) => forceSelectOnlyOption(users, values)}
                            validateOnBlur={false}
                            validateOnChange={false}
                        >
                            <Form>
                                <fieldset className={"field-area"}>
                                    <label htmlFor="name">User:</label>
                                    <Field as="select" name="userId" className="form-control" type="userId">
                                        <option value="" disabled>Choisissez un Elève</option>
                                        {users.map((user, index) => (
                                            <option key={index} value={user.id}>
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
                                    <Button variant="secondary" onClick={handleCloseAddUser}>
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
                <div className={"addUser-item-div"}>
                    <Button type={"button"} className={"btn-light btn-outline-primary"}  onClick={() => {
                        handleShowAddUser()
                    }}>
                        <AiIcons.AiOutlineUserAdd /> Partager
                    </Button>
                </div>
                <h2>Tableaux</h2>
                <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                    navigate(`/chat/${roomId}`)
                }}>
                    Chat
                </Button>
                <div className={"workspace-container"}>
                    <div className={"workspace-list"}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */}
                        <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                            handleShow()
                        }}>
                            +
                        </Button>
                        {boards.map((board) => {
                            return <div key={board.name.toString()} className={"workspace-item"} onClick={() => {
                                const boardId = board.id.toString()
                                navigate(`/kanban/${boardId}`,
                                    {state: {
                                            roomId: board.roomId
                                        }})
                            }}> {board.name} </div>;
                        })}
                    </div>
                </div>
            </div>
            </div>
            <Footer/>
        </div>
    )


}

export default Board;
