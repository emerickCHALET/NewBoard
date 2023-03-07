import React, {useEffect, useState} from 'react';
import Footer from "../components/Footer";
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import {useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import SideBar from "../components/SideBar";
import {Link} from "react-router-dom";
import useProtectedLogin from "../components/ProtectedLogin";

const Login = () => {
    const navigate = useNavigate();
    const { loading } = useProtectedLogin()

    useEffect(() => {
        // vérifier si l'utilisateur est déjà connecté
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            navigate('/workspaces');
        }
    }, []);

    /**
     * function who check the identifiers of a user and connect him if that's good
     * @param values necessary for Login a user
     */
    async function postLogin(values: { email: string; password: string; }){
        let result = false;
        let payload = { email: values.email, password: values.password };
        await axios
            .post(urlApi + 'login',payload)
            .then((response) => {
                if(response.status === 200){
                    toast.success("Bienvenue!", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    localStorage.setItem('permissions_role', response.data.data.role);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.data.id);
                    localStorage.setItem('userClass', response.data.data.class)
                    if(response.data.data.role === "ROLE_ADMIN"){
                        localStorage.setItem('establishmentId', response.data.data.establishmentId);
                    }
                    localStorage.setItem("isLoggedIn", "true");
                    result = true
                    navigate('/workspaces');
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

    async function postToken() {
        let result = false;
        const email = localStorage.getItem('email')
        await axios
            .post(urlApi + 'token', { email })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.data.token);
                    result = true
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message,{
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        return result;
    }

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

    const handleSubmit = async (values: { email: string; password: string; }) => {
        const loginResult = await postLogin(values);
        const tokenResult = await postToken();

        if (loginResult && tokenResult) {
            navigate('/workspaces');
        }

    };
    if (loading){
        return <div>Loading...</div>
    }
    return (
        <div className="wrap">
            <SideBar/>
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
                        <Link to={'/forgot'}>Mot de passe oublié ?</Link>
                        <button type="submit" className="form-button">Login</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default Login
