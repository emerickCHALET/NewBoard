import React from 'react';
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import axios from 'axios';
import {urlApi} from "../App";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router";
import SideBar from "../components/SideBar";
import Api from "../services/ApiService";
import ApiService from "../services/ApiService";

const InscriptionPage = () => {

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
            .required("Le mot de passe est obligatoire")
    });

    const initialValues = {
        lastname: "",
        firstname: "",
        email: "",
        password: "",
    };
    const navigate = useNavigate();
    const handleSubmit = async (values: { lastname: string; firstname: string; email: string; password: string }) => {
        const apiService = new ApiService();
        const response = await apiService.post('users', {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            password: values.password },
            undefined)
        if(response != null){
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate('/login');
        }
    };

    return (
        <div className="wrap">
            <SideBar/>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}>
                <div className="container-wrap">
                    <Form className="form-wrap">
                        <fieldset className={"field-area"}>
                            <label htmlFor="lastname">Nom</label>
                            <Field id="lastname" name="lastname" className="form-control" type="text"/>
                            <ErrorMessage
                                name="lastname"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>


                        <fieldset className={"field-area"}>
                            <label htmlFor="firstname">Prénom:</label>
                            <Field id="firstname" name="firstname" className="form-control" type="text"/>
                            <ErrorMessage
                                name="firstname"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <fieldset className={"field-area"}>
                            <label htmlFor={"email"}>Email</label>
                            <Field name="email" id="email" className="form-control" type="email"/>
                            <ErrorMessage
                                name="email"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <fieldset className={"field-area"}>
                            <label htmlFor={"password"}>Password</label>
                            <Field name="password" id="password" className="form-control" type="password"/>
                            <ErrorMessage
                                name="password"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <button className={"form-button"} type="submit">Inscription</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default InscriptionPage;
