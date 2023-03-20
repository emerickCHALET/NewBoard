import Modal from "react-bootstrap/Modal";
import {Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import Student from "../Classes/Student";
import * as Yup from "yup";


const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

const FormAddUsers = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [value, setValue] = useState("default");


    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const handleSubmit = async (values: { name: string;}) => {
        //const result = await postWorkspace(values);
        /*if(result){
            handleClose()
            window.location.reload()
        }*/
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


    const [users, setUsers] = useState<Student[]>([])

    //We get all users now, must get users by classroom later
    const getUsers = () => {
        axios
            .get(urlApi + 'users', config)
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Users récupérés", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
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
        getUsers()
    }, [])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un utilisateur à l'espace de travail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    <Form>
                        <select defaultValue={value} onChange={handleChange}>
                            <option value="default" disabled hidden>
                                Choisissez une classe
                            </option>
                            {users.map((user) => { return <option key={user.firstName.toString()} className={"workspace-item"} value={user.firstName} > {user.firstName} </option>; })}
                        </select>
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
    );
}

export default FormAddUsers;
