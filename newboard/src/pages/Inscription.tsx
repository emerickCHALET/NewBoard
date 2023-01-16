import React from 'react';
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import axios from 'axios';
import {urlApi} from "../App";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router";
import SideBar from "../components/SideBar";

/**
 * Register a new User
 * @param values - all the values necessary for register the user
 */
async function postRegister(values: { lastname: string; firstname: string; email: string; password: string }): Promise<boolean> {
    let payload = { firstname: values.firstname, lastname: values.lastname, email: values.email, password: values.password };
    let result = false;
    await axios
        .post(urlApi + 'users',payload)
        .then((response) => {
            if(response.status === 200){
                toast.success("Inscription réussite !", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                result = true
            }
        })
        .catch(function (error) {
            if(error.response) {
                toast.error(error.response.data.message,{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
    return result;
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
    const navigate = useNavigate();
    const handleSubmit = async (values: { lastname: string; firstname: string; email: string; password: string }) => {
        const result = await postRegister(values);
        if (result) {
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
