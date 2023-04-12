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
import BoardUsers from "./BoardUsers";

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

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (values: { name: string; }) => {
        await postBoard(values);
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

    const [usersWorkspace, setUsersWorkspace] = useState<Users[]>([])
    const getUsersFromWorkspaceId = async () => {
        const response = await apiService.get("userByWorkspaceId/" + workspaceId, token!, navigate)
        if (response && response.status === 200) {
            setUsersWorkspace(response.data.data);
        }
    }


    useEffect(() => {
        if(token !== null){
            getBoard()
            getUsersFromWorkspaceId()
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

    return (

        <div className={"wrap"}>
            <SideBar/>
            <div className={"content-Board-Page"} >
            <div className={"board-access"}>
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

                <h2>Tableaux</h2>
                <br/>
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
            <div className={"board-users"}>
                <BoardUsers usersWorkspace={usersWorkspace}/>
            </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Board;
