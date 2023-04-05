import React, {useEffect, useState} from 'react';
import Footer from "../components/Footer";
import '../index.css';
import Workspace from "../classes/Workspace";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import {Formik, ErrorMessage, Form, Field} from 'formik';
import * as Yup from "yup";
import SideBar from "../components/SideBar";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import ApiService from "../services/ApiService";


const token = localStorage.getItem('token');
const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};
const Workspaces = () => {
    const apiService = new ApiService();
    let userId = localStorage.getItem("userId")

    /**
     * when we create a new workspace, first we create a chat room, so we can associate its id to the workspace,
     * then, we create the workspace with the roomId we just created,
     * and then we create a workspaceUser to associate the user to the workspace
     * @param values
     */
    async function postWorkspace(values: { name: string; }): Promise<number> {
        let payload = {name: values.name, roomId: 0};
        let result = 0
        payload.roomId = await postRoom(payload)
        const response = await apiService.post('workspaces', payload, token!)
        if (response && response.status === 200) {
            result = response.data.data.id
            let payload2 = {userID: userId, workspaceID: response.data.data.id};
            const response2 = await apiService.post('workspacesUser', payload2, token!)
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

        const response = await apiService.post('rooms',payload,token!)
        if (response && response.status === 200){
            result = response.data.data.id
        }
        
        return result
    }

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = async (values: { name: string; }) => {
        await postWorkspace(values);
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

    /**
     * we get all workspaces that user has access to
     */
    useEffect(() => {
        async function getWorkspaces(){
            const response = await apiService.get('workspacesByUserId/' + userId, token!, navigate)
            if (response){
                const responseContent = JSON.parse(JSON.stringify(response.data.data)) as Workspace[]
                setWorkspaces(responseContent)
                setIsLoading(false)
            }
        }
        getWorkspaces();
    }, [])

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
export default Workspaces;

