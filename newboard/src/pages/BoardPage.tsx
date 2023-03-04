import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {useLocation, useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import Board from "../Classes/Board";

const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

const BoardPage = () => {

    const location = useLocation();

//get workspace name from previous page
    let workspaceName = location.state.workspaceName;

//we get the classroom selected in the form from workspacePage, must be replaced by classroom assigned to workspace
    let classroomName = location.state.classroomName;

// get workspace ID from previous page
    let workspaceId = location.state.workspaceId;

    let roomId = location.state.roomId


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
                }
            })
            .catch(function (error) {
                if(error.response) {
                    toast.error(error.response.data.message,{
                        position: toast.POSITION.TOP_RIGHT
                    });
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
            });
        return result
    }

    async function postWorkspaceUser(values: FormikValues): Promise<boolean> {
        let payload = {userId: values.userId, workspaceID: workspaceId};
        let result = false;
        await axios
            .post(urlApi + 'workspacesUser', payload, config)
            .then((response) => {
                if (response.status === 200) {
                    if (response.status === 200) {
                        toast.success("Workspace crée avec succès !", {
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
                }
            })
        return result;
    }
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [value, setValue] = useState("default");
    const [room, setRoom] = useState(0);

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const handleSubmit = async (values: { name: string; }) => {
        const result = await postBoard(values);
        if (result) {
            handleClose()
            window.location.reload()
        }
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

    const [boards, setBoards] = useState<Board[]>([])

    const getBoard = () => {
        axios
            .get(urlApi + "boardByWorkspaceId/" + workspaceId, config)
            .then((response) => {
                if (response.status === 200) {
                    setBoards(response.data.data)
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

    /*const [users, setUsers] = useState<Student[]>([])

    const getUsers = () => {
        axios
            .get(urlApi + 'users', config)
            .then((response) => {
                if (response.status === 200) {
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
    }*/

    useEffect(() => {
        getBoard()
        //getUsers()
    }, [])

    const navigate = useNavigate();


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
                            navigate("/kanban")
                        }}> {board.name} </div>;
                    })}
                </div>
            </div>
            <Footer/>
        </div>
    )


}

export default BoardPage;