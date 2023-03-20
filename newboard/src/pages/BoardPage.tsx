import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {useLocation, useNavigate, useParams} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik, FormikProps, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import Board from "../Classes/Board";
import Student from "../Classes/Student";
import * as AiIcons from "react-icons/ai";
import {selectOptions} from "@testing-library/user-event/dist/select-options";

const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

function BoardPage(){
    let userId = localStorage.getItem("userId")
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const location = useLocation();

    // Initialize workspaceId here because the app crashes when we click on menu button, location.state.workspaceId would be null ??
    const {workspaceId} = useParams<{ workspaceId: string}>()

    let roomId = 0
    if(location.state != null){
        roomId = location.state.roomId
    }

    async function postBoard(values: { name: string; }): Promise<boolean> {
        let payload = {name: values.name, workspaceID: workspaceId, roomId: 0};
        payload.roomId = await postRoom(payload)
        let result = false;
        await axios
            .post(urlApi + 'boards',payload, config)
            .then((response) => {
                if(response.status === 200){
                    let payload2 = { userID: localStorage.getItem('userId'), boardID: response.data.data.id};
                    axios
                        .post(urlApi + 'boardUsers', payload2, config)
                        .then((response) => {
                            if(response.status === 200) {
                                toast.success("Board crée avec succès !", {
                                    position: toast.POSITION.TOP_RIGHT,
                                });
                                result = true
                            }
                        })
                        .catch(function (error) {
                            if(error.response) {
                                toast.error(error.response.data.message,{
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                if(error.response.data.disconnect === true){
                                    localStorage.clear()
                                    navigate('/login');
                                }
                            }
                        })
                }
            })
            .catch(function (error) {
                if(error.response) {
                    toast.error(error.response.data.message,{
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
    async function postRoom(values: { name: string; }): Promise<number>{
        let payload = {name: values.name}
        let result = 0
        await axios
            .post(urlApi + 'rooms', payload,  config)
            .then((response) => {
                if (response.status === 200) {
                    result = response.data.data.id
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
        return result
    }


    async function postWorkspaceUser(values: FormikValues): Promise<boolean> {
        console.log(value)
        let payload = {userID: values.userId, workspaceID: workspaceId};
        let result = false;
        await axios
            .post(urlApi + 'workspacesUser', payload, config)
            .then((response) => {
                if (response.status === 200) {
                    if (response.status === 200) {
                        toast.success("WorkspaceUser crée avec succès !", {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        result = true
                    }
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
    
    const [show, setShow] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowAddUser = () => setShowAddUser(true);
    const handleCloseAddUser = () => setShowAddUser(false)
    const [value, setValue] = useState("default");
    const [room, setRoom] = useState(0);

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const handleSubmit = async (values: { name: string; }) => {
        await postBoard(values);
        handleClose()
        window.location.reload()

    };

    const handleSubmitAddUsers = async (values: FormikValues) => {
        const result = await postWorkspaceUser(values);
        console.log(values)
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

    const [boards, setBoards] = useState<Board[]>([])

    const getBoard = () => {
        axios
            .get(urlApi + "boardByWorkspaceIdAndUserId/" + workspaceId + "/" + userId, config)
            .then((response) => {
                if (response.status === 200) {
                    setBoards(response.data.data)
                    setIsLoading(false);
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

    const [users, setUsers] = useState<Student[]>([])

    const className = localStorage.getItem("userClass")
    const getUsers = () => {
        console.log(className)
        axios
            .get(urlApi + "userByClassIdAndWorkspaceId/"+ className + "/" + workspaceId, config)
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
                }
            })
    }

    useEffect(() => {
        getBoard()
        getUsers()
    }, [])

    const navigate = useNavigate();

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

    const forceSelectOnlyOption = (options: Student[], values: FormikValues): void => {
        console.log(options)
        if (options.length == 1) {
            values.userId = options[0].id;
            console.log(values)
        }
        handleSubmitAddUsers(values)
    };

    return (

        <div className="wrap">
            <SideBar/>

            {/* See how to get the modal out and create a component */}

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
                        {({ isSubmitting, errors }) => (
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
                        )}
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
                navigate("/chat", {state: {roomId}})
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
            <Footer/>
        </div>
    )


}

export default BoardPage;