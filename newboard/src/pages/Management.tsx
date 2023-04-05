import React, {ChangeEvent, useState, useEffect} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import Papa from "papaparse";
import { Table } from 'react-bootstrap';
import * as AiIcons from "react-icons/ai";
import {useNavigate} from "react-router";
import ApiService from "../services/ApiService";

/**
 * const who created a headers with the token for authenticated a request to API
 */
const token = localStorage.getItem('token');
/**
 * const who get the establishmentId of a admin login
 */
const establishmentId = parseInt(localStorage.getItem('establishmentId')!);

const Management = () => {
    const navigate = useNavigate();
    const apiService = new ApiService();

    /**
     * Register a new User
     * @param values necessary for register a new user
     */
    async function postRegister(values: { lastname: string; firstname: string; email: string; password: string, class: string }): Promise<any> {
        let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, password: values.password, class: values.class, establishmentId: establishmentId };

        const response = await apiService.post("users",payload,undefined, navigate)
        if (response && response.status === 200) {
            toast.success("Elève ajouter avec succès !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }

    /**
     * Register a new classroom who is assigned to the establishment ID of the admin connected
     * @param values necessary for register a new classroom
     */
    async function postClassroom(values: { ClassroomName: string; }): Promise<any> {
        let payload = { ClassroomName: values.ClassroomName , EstablishmentId: establishmentId};

        const response = await apiService.post("classroom",payload,token!, navigate)
        if (response && response.status === 200) {
            toast.success("Classe crée avec succès !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }

    /**
     * Update details of a student who exist already
     * @param values necessary for update a student
     */
    async function putUser(values: {id:string; lastname: string; firstname: string; email: string; class: string }): Promise<any> {
        let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, class: values.class };

        const response = await apiService.put('studentUpdateByAdmin/' + values.id,payload,token!, navigate)
        if (response && response.status === 200) {
            toast.success("Elève mis a jour avec succès !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }

    /**
     *
     * @param values contains the id of the student to delete
     * @constructor
     */
    async function DeleteStudent(values: { idStudent: string}): Promise<void> {

        const response = await apiService.delete('users/' + values.idStudent,token!, navigate)
        if (response && response.status === 200) {
            toast.success("Etudiant supprimé !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }

    /**
     *
     * @param values contains the id of the classroom to delete
     * @constructor
     */
    async function DeleteClassroom(values: { idClassroom: string}): Promise<void> {

        const response = await apiService.delete('classroom/' + values.idClassroom,token!, navigate)
        if (response && response.status === 200) {
            toast.success("Classe supprimée !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }

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
                header3 : establishmentId
            }
        };

        Papa.parse(file, { // Utilisez la méthode parse de PapaParse pour lire le fichier CSV
            encoding: 'UTF-8', // Spécifiez que le fichier doit être encodé en UTF-8
            header: true,
            complete: async (results) => { // La fonction complete sera appelée une fois que le fichier a été lu

                const response = await apiService.post('usersByFile',results.data,token!, navigate)
                if (response && response.status === 200) {
                    toast.success("Etudiants créer!", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        });
    };

    //Ajout d'un élève
    const [classrooms, setClassrooms] = useState<any[]>([]);

    const getClassroomsByEstablishmentId = async () => {
        const response = await apiService.get('classroomsByEstablishmentId/' + establishmentId, token!, navigate)
        if (response && response.status === 200) {
            setClassrooms(response.data.data)
        }
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
        window.location.reload()
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
        await postClassroom(values);
        handleCloseThird();
        window.location.reload()
    };

    //Modification d'un élève

    const [showFourth, setShowFourth] = useState(false);
    const [initialValuesFourth, setinitialValuesFourth] = useState({id:"" ,lastname: "", firstname:"", email:"", class:""})
    const handleCloseFourth = () => setShowFourth(false);
    const handleShowFourth = (item: { id: React.Key | null | undefined; lastname: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; firstname: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; class: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }) => {
        setinitialValuesFourth({id: item.id!.toString() ,lastname: item.lastname!.toString(), firstname:item.firstname!.toString(), email:item.email!.toString(), class:item.class!.toString()})
        setShowFourth(true);

    };

    const validationSchemaFourth = Yup.object().shape({
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
        class: Yup.string()
            .required("La classe est obligatoire")
    });

    const handleSubmitFourth = async (values: {id:string; lastname: string; firstname: string; email: string; class: string }) => {
        await putUser(values);
        handleCloseFourth();
        window.location.reload()
    };

    //Affichage Table Users
    const [data, setData] = useState<any>([]);

    useEffect( () => {
        const getUsersByEstablishmentId = async () => {
            const response = await apiService.get('usersByEstablishmentId/' + establishmentId, token!)
            if (response && response.status === 200) {
                setData(response.data.data);
            }
        };
        getUsersByEstablishmentId()
    }, []);

    //Affichage Table Classroom
    const [dataClassroom, setDataClassroom] = useState<any>([]);

    useEffect(() => {
        const getClassroomsByEstablishmentId = async () => {
            const response = await apiService.get('classroomsByEstablishmentId/' + establishmentId, token!)
            if (response && response.status === 200) {
                setDataClassroom(response.data.data);
            }
        };
        getClassroomsByEstablishmentId()
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
                                            <option key={classroom.id} value={classroom.id}>
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
                        <Modal.Title>Ajouter une classe</Modal.Title>
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
                <br/>
                <Modal show={showFourth} onHide={handleCloseFourth}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modifier un élève</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesFourth}
                            validationSchema={validationSchemaFourth}
                            onSubmit={(values) => handleSubmitFourth(values)}
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
                                            <option key={classroom.id} value={classroom.id}>
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
                                <Modal.Footer>
                                    <Button variant="primary" className="form-control" type={"submit"}>
                                        Modifier
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
            <h1 className={"management-title"}>Liste des élèves</h1>
            <div className={"tableUsers"}>
                <Table responsive variant="light">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Classe</th>
                        <th>Email</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
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
                            <td><Button variant="primary" onClick={(e:any) => handleShowFourth(item)}><AiIcons.AiOutlineUserDelete /></Button></td>
                            <td><Button variant="danger" onClick={(e:any) => DeleteStudent({idStudent: item.id!.toString()})}><AiIcons.AiOutlineUserDelete /></Button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <br/>
            <h1 className={"management-title"}>Liste des classes</h1>
            <div className={"tableUsers"}>
                <Table responsive variant="light">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Classe</th>
                        <th>Supprimer</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataClassroom.map((items: { id: React.Key | null | undefined; ClassroomName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined;}, index: number) => (
                        <tr key={items.id}>
                            <td>{index + 1}</td>
                            <td>{items.ClassroomName}</td>
                            <td><Button variant="danger" onClick={(e:any) => DeleteClassroom({idClassroom: items.id!.toString()})}><AiIcons.AiOutlineUserDelete /></Button></td>
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
