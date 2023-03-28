import React, {useEffect} from 'react';
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
import ApiService from "../services/ApiService";
import LoginUser from "../classes/LoginUser";

const Login = () => {
    const navigate = useNavigate();
    const {loading} = useProtectedLogin()

    useEffect(() => {
        // vérifier si l'utilisateur est déjà connecté
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            navigate('/workspaces');
        }
    }, []);

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
        const apiService = new ApiService();
        const response = await apiService.post('login', {
                email: values.email,
                password: values.password},
            undefined)
        const responseContent = JSON.parse(JSON.stringify(response.data)) as LoginUser
        if(responseContent != null){
            localStorage.setItem('permissions_role', responseContent.data.role);
            localStorage.setItem('token', responseContent.token);
            localStorage.setItem('userId', responseContent.data.id.toString());
            localStorage.setItem('userClass', responseContent.data.classId.toString())
            localStorage.setItem('email', responseContent.data.email)
            localStorage.setItem('userFullName', responseContent.data.firstname + " " + responseContent.data.lastname)
            if (responseContent.data.role === "ROLE_ADMIN") {
                localStorage.setItem('establishmentId', responseContent.data.establishmentId.toString());
            }
            localStorage.setItem("isLoggedIn", "true");
            navigate('/workspaces');
        }
    };
    if (loading) {
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
