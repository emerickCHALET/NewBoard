import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import axios from 'axios';
import {urlApi} from "../App";

async function postRegister(values: { lastname: string; firstname: string; email: string; password: string }) {

    let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, password: values.password };
    await axios
        .post(urlApi + 'users',payload)
        .then((response) => {
            if(response.status === 200){
                console.log('Account created')
            }
        })
        .catch(function (error) {
            if(error.response) {
                console.log(error.response.data.message)
            }
        })
}

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
        firstname:"",
        email: "",
        password: "",
    };

    const handleSubmit = (values: { lastname: string; firstname: string; email: string; password: string}) => {
        postRegister(values);
    };

    return (
        <div className="wrap">
            <NavbarHome/>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                <div className="container-wrap">
                    <Form className="form-wrap">
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
                            <label htmlFor={"email"}>Email</label>
                            <Field name="email" className="form-control" type="email"/>
                            <ErrorMessage
                                name="email"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <fieldset className={"field-area"}>
                            <label htmlFor={"password"}>Password</label>
                            <Field name="password" className="form-control" type="password"/>
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
