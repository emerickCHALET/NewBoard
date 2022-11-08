import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';


const Login = () => {

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email invalide")
            .required("L'email est obligatoire"),
        password: Yup.string()
            .required("Le mot de passe est obligatoire")
    });

    const initialValues = {
        email: "",
        password: "",
    };

    const handleSubmit = (values: { email: string; password: string; }) => {
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
                        <button type="submit" className="form-button">Login</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default Login;
