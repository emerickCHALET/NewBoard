import React, {useState} from 'react';
import Footer from "../components/Footer";
import '../index.css';
import Workspace from "../Classes/Workspace";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import {Formik, ErrorMessage, Form, Field} from 'formik';
import * as Yup from "yup";
import SideBar from "../components/SideBar";


const myWorkspace = new Workspace("PHP");
const myWorkspace2 = new Workspace("JavaScript");
const myWorkspace3 = new Workspace("Flutter");
const myWorkspace4 = new Workspace("React Native");
const myWorkspace5 = new Workspace("iOS");
const myWorkspace6 = new Workspace("Sécurité");


let list: Array<Workspace> = [myWorkspace, myWorkspace2, myWorkspace3, myWorkspace4, myWorkspace5, myWorkspace6];


const WorkspacesPage = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleSubmit = (values: { name: string;}) => {
        setShow(false);
        list.push(new Workspace(values.name))
    };

    const initialValues = {
        name: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),
    });

    return (

        <div className="wrap">
            <SideBar/>

            {/* à voir pour sortir le modal de ce fichier et en faire un component */}

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
                <h2>Espaces de travail</h2>
                <div className={"workspace-container"}>
                    <div className={"workspace-list"}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */}
                        <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => { handleShow() }}>
                            +
                        </Button>
                        {list.map((workspace) => { return <div key={workspace.name.toString()} className={"workspace-item"}> {workspace.name} </div>; })}
                    </div>
                </div>
            <Footer/>
        </div>
    )
}

export default WorkspacesPage;

