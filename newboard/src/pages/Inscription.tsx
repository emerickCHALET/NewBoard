import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';

const InscriptionPage = () => {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "trop petit")
            .max(25, "trop long!")
            .required("Ce champ est obligatoire"),
        email: Yup.string()
            .email("email invalide")
            .required("l'email est obligatoire")
    });

    const initialValues = {
        name: "",
        email: "",
    };

    const handleSubmit = (values: { name: string; email: string; }) => {
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
                <div className="inscription-wrap">
                    <Form className="form-inscription">
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
                        <button className={"form-button"} type="submit">Inscription</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default InscriptionPage;
