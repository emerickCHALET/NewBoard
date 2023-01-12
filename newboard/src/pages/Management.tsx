import React, {ChangeEvent, useState, useEffect} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {urlApi, urlLocal} from "../App";
import {toast} from "react-toastify";
import Papa from "papaparse";
import { Table } from 'react-bootstrap';

/**
 * const who created a headers with the token for authenticated a request to API
 */
const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};
/**
 * const who get the establishmentId of a admin login
 */
const establishmentId = parseInt(localStorage.getItem('establishmentId')!);

/**
 * Register a new User
 * @param values necessary for register a new user
 */
async function postRegister(values: { lastname: string; firstname: string; email: string; password: string, class: string }): Promise<any> {
    let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, password: values.password, class: values.class, establishmentId: establishmentId };
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

/**
 * Register a new classroom who is assigned to the establishment ID of the admin connected
 * @param values necessary for register a new classroom
 */
async function postClassrom(values: { ClassroomName: string; }): Promise<any> {
    let payload = { ClassroomName: values.ClassroomName , EstablishmentId: establishmentId};
    console.log(payload)
    await axios
        .post(urlApi + 'classroom',payload,config)
        .then((response) => {
            if(response.status === 200){
                toast.success("Classe crée avec succès !", {
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
                header2: file.size,
                header3: establishmentId
            }
        };

        Papa.parse(file, { // Utilisez la méthode parse de PapaParse pour lire le fichier CSV
            encoding: 'UTF-8', // Spécifiez que le fichier doit être encodé en UTF-8
            header: true,
            complete: async (results) => { // La fonction complete sera appelée une fois que le fichier a été lu
                console.log(results.data)
                await axios
                    .post(urlLocal + 'usersByFile', results.data, config)
                    .then((response) => {
                        if (response.status === 200) {
                            toast.success("Etudiants créer!", {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
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
    const [classrooms, setClassrooms] = useState<any[]>([]);

    const getClassroomsByEstablishmentId = () => {
        axios
            .get(urlApi + 'classroomsByEstablishmentId/' + establishmentId, config)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data)
                    setClassrooms(response.data.data)
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
        getClassroomsByEstablishmentId()
    }, [])

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

    //Ajout d'une classe
    const [showThird, setShowThird] = useState(false);
    const handleCloseThird = () => setShowThird(false);
    const handleShowThird = () => setShowThird(true);

    const validationSchemaThird = Yup.object().shape({
        ClassroomName: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),
    });

    const initialValuesThird = {
        ClassroomName: ""
    };
    const handleSubmitThird = async (values: { ClassroomName: string;}) => {
        await postClassrom(values);
        handleCloseThird();
    };

    //Affichage Table
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        axios
            .get(urlApi + 'usersByEstablishmentId/' + establishmentId, config)
            .then((response) => {
                if (response.status === 200) {
                    setData(response.data.data);
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
                                    <label htmlFor={"class"}>Classe :</label>
                                    <Field as="select" name="class" className="form-control" type="class">
                                        {classrooms.map(classroom => (
                                            <option key={classroom.id} value={classroom.ClassroomName}>
                                                {classroom.ClassroomName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="class"
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
                                <Modal.Footer>
                                    <Button variant="primary" className="form-control" type={"submit"}>
                                        Créer
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Formik>
                    </Modal.Body>
                </Modal>
                <Button className={"workspace-item workspace-item-add managementOptions-Btn"} variant="primary" onClick={() => {
                    handleShowSecond()
                }}>
                    Ajouter un élève
                </Button>
                <br/>
                <Modal show={showThird} onHide={handleCloseThird}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un élève</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesThird}
                            validationSchema={validationSchemaThird}
                            onSubmit={(values) => handleSubmitThird(values)}
                        >
                            <Form className="field-area">
                                <fieldset className={"field-area"}>
                                    <label htmlFor="ClassroomName">Nom de la classe :</label>
                                    <Field name="ClassroomName" className="form-control" type="text"/>
                                    <ErrorMessage
                                        name="ClassroomName"
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
                <Button className={"workspace-item workspace-item-add managementOptions-Btn"} variant="primary" onClick={() => {
                    handleShowThird()
                }}>
                    Ajouter une classe
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
