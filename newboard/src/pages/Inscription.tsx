import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';

const InscriptionPage = () => {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
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
        name: "",
        email: "",
        password: "",
    };

    const handleSubmit = (values: { name: string; email: string; password: string}) => {
        alert(JSON.stringify(values, null, 2));
        console.log(values)
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
                            <label htmlFor="name">Name:</label>
                            <Field name="name" className="form-control" type="text"/>
                            <ErrorMessage
                                name="name"
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
