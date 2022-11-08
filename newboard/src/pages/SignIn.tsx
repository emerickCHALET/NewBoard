import React from 'react';
import {
    Formik,
    Form,
    ErrorMessage,
    Field,
} from 'formik';
import Footer from "../components/Footer";
import * as Yup from 'yup';
import NavbarHome from "../components/NavbarHome";

const SignInPage = () => {

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

    return(
        <div>
            <NavbarHome />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
            <Form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field name="name" className="form-control" type="text" />
                    <ErrorMessage
                        name="name"
                        component="small"
                        className="text-danger"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <Field name="email" className="form-control" type="email" />
                    <ErrorMessage
                        name="email"
                        component="small"
                        className="text-danger"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary"> Submit </button>
                </div>
            </Form>
        </Formik>
            <Footer/>
        </div>
    )};

export default SignInPage;
