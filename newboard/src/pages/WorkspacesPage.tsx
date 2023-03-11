import React, {useEffect, useState} from 'react';
import Footer from "../components/Footer";
import '../index.css';
import Workspace from "../Classes/Workspace";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import {Formik, ErrorMessage, Form, Field, FormikValues} from 'formik';
import * as Yup from "yup";
import SideBar from "../components/SideBar";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";


const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

async function postWorkspace(values: { name: string; }): Promise<boolean> {
    // voir pour récupérer l'id d'user
    let payload = {name: values.name, roomId: 0};
    let result = false;
    payload.roomId = await postRoom(payload)
    await axios
        .post(urlApi + 'workspaces', payload, config)
        .then((response) => {
            if (response.status === 200) {
                let payload2 = {userID: localStorage.getItem('userId'), workspaceID: response.data.data.id};
                axios
                    .post(urlApi + 'workspacesUser', payload2, config)
                    .then((response) => {
                        if (response.status === 200) {
                            result = true
                        }
                    })
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


const WorkspacesPage = () => {
    let userId = localStorage.getItem("userId")
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseAddUser = () => setShow(false);
    const handleShowAddUser = () => setShow(true);

    const [value, setValue] = useState("default");

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const handleSubmit = async (values: { name: string; }) => {
        await postWorkspace(values);
        handleClose()
        window.location.reload()
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

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])

    const getWorkspaces = () => {
        axios
            .get(urlApi + 'workspacesByUserId/' + userId, config)
            .then((response) => {
                if (response.status === 200) {
                    setWorkspaces(response.data.data)
                    setIsLoading(false);
                }
            })
            .catch(function (error) {
                if (error.response) {

                }
            })
    }

    useEffect(() => {
        getWorkspaces()
    }, [])

    const navigate = useNavigate();
//
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

            {/* See how to get the modal out and create a component */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un espace de travail</Modal.Title>
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
            <div className={"workspacePresentation"}>
                <h2>Espaces de travail</h2>
                <br/>
                <br/>
                <div className={"workspace-container"}>
                    <div className={"workspace-list"}>
                        <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => { handleShow() }}>
                            +
                        </Button>
                        {workspaces.map((workspace) => { return <div key={workspace.name.toString()} className={"workspace-item"} onClick={() => {
                            const workspaceId = workspace.id.toString()
                            navigate(`/board/${workspaceId}`,
                                {state: {
                                        workspaceName: workspace.name,
                                        roomId: workspace.roomId
                                    }}) }}> {workspace.name} </div>; })}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )


}
export default WorkspacesPage;

