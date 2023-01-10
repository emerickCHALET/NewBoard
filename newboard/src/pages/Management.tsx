import React, {ChangeEvent, useState, useEffect} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import Papa from "papaparse";
import { Table } from 'react-bootstrap';


const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

async function postRegister(values: { lastname: string; firstname: string; email: string; password: string, class: string }): Promise<any> {
    let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, password: values.password, class: values.class };
    await axios
        .post(urlApi + 'users',payload)
        .then((response) => {
            if(response.status === 200){
                toast.success("Elève ajouter avec succès !", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        })
        .catch(function (error) {
            if(error.response) {
                toast.error(error.response.data.message,{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
}
const Management = () => {

    //Ajout en masse via CSV
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [file, setFile] = useState<File>();
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        const config = {
            headers:{
                header1: file.type,
                header2: file.size
            }
        };

        Papa.parse(file, { // Utilisez la méthode parse de PapaParse pour lire le fichier CSV
            encoding: 'UTF-8', // Spécifiez que le fichier doit être encodé en UTF-8
            header: true,
            complete: async (results) => { // La fonction complete sera appelée une fois que le fichier a été lu
                console.log(results.data)
                await axios
                    .post('http://localhost:3001/api/usersByFile', results.data, config)
                    .then((response) => {
                        if (response.status === 200) {
                            toast.success("Etudiants créer!", {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            console.log(response)
                        }
                    })
                    .catch(function (error) {
                        if (error.response) {
                            toast.error(error.response.data.message, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    })
            }
        });
    };

    //Ajout d'un élève
    const [showSecond, setShowSecond] = useState(false);
    const handleCloseSecond = () => setShowSecond(false);
    const handleShowSecond = () => setShowSecond(true);

    const validationSchema = Yup.object().shape({
        lastname: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),
        firstname: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),
        email: Yup.string()
            .email("Email invalide")
            .required("L'email est obligatoire"),
        password: Yup.string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .required("Le mot de passe est obligatoire"),
        class: Yup.string()
            .min(2, "La classe doit contenir au moins 2 caractères")
            .required("La classe est obligatoire")
    });

    const initialValues = {
        lastname: "",
        firstname:"",
        email: "",
        password: "",
        class: ""
    };
    const handleSubmit = async (values: { lastname: string; firstname: string; email: string; password: string, class: string }) => {
        await postRegister(values);
        handleCloseSecond();
    };

    //Affichage Table
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        axios
            .get(urlApi + 'users',config)
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Utilisateurs récupérés", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setData(response.data.data);
                    console.log(response.data.data);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
    }, []);

    return (
        <div className="wrap">
            <SideBar/>
            <div className="managementOptions">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ajout en masse d'élèves</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className={"field-area"}
                              onSubmit={handleUploadClick}>
                            <input
                                id={"csvFile"}
                                type={"file"}
                                accept={".csv"}
                                onChange={handleFileChange}
                                className="form-control"/>
                            <br/>
                            <input className="form-control btn btn-primary" type="submit" value="Valider" />
                        </form>
                    </Modal.Body>
                </Modal>
                <Button className={"workspace-item workspace-item-add managementOptions-Btn"} variant="primary" onClick={() => {
                    handleShow()
                }}>
                    Ajouter via CSV
                </Button>
                <br/>
                <Modal show={showSecond} onHide={handleCloseSecond}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un élève</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleSubmit(values)}
                        >
                            <Form className="field-area">
                                <fieldset className={"field-area"}>
                                    <label htmlFor="lastname">Nom:</label>
                                    <Field name="lastname" className="form-control" type="text"/>
                                    <ErrorMessage
                                        name="lastname"
                                        component="small"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <fieldset className={"field-area"}>
                                    <label htmlFor="firstname">Prénom:</label>
                                    <Field name="firstname" className="form-control" type="text"/>
                                    <ErrorMessage
                                        name="firstname"
                                        component="small"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <fieldset className={"field-area"}>
                                    <label htmlFor={"email"}>Email :</label>
                                    <Field name="email" className="form-control" type="email"/>
                                    <ErrorMessage
                                        name="email"
                                        component="small"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <fieldset className={"field-area"}>
                                    <label htmlFor={"password"}>Mot de passe :</label>
                                    <Field name="password" className="form-control" type="password"/>
                                    <ErrorMessage
                                        name="password"
                                        component="small"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <fieldset className={"field-area"}>
                                    <label htmlFor={"class"}>Classe :</label>
                                    <Field name="class" className="form-control" type="class"/>
                                    <ErrorMessage
                                        name="class"
                                        component="small"
                                        className="text-danger"
                                    />
                                </fieldset>
                                <Modal.Footer>
                                    <Button variant="primary" className="form-control" type={"submit"}>
                                        Créer
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Formik>
                    </Modal.Body>
                </Modal>
                <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                    handleShowSecond()
                }}>
                    Ajouter
                </Button>
            </div>
            <div className={"tableUsers"}>
                <Table responsive variant="light">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Classe</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item: { id: React.Key | null | undefined; lastname: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; firstname: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; class: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: number) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.lastname}</td>
                            <td>{item.firstname}</td>
                            <td>{item.class}</td>
                            <td>{item.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <Footer/>
        </div>
    )
}

export default Management
