import React, {useEffect, useState} from 'react';
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
import ApiService from "../services/ApiService";
const ResetPassword = () => {
    const apiService = new ApiService();

    async function putReset(values: { password: string }): Promise<boolean> {
        let data = {password: values.password};
        let params = new URLSearchParams(window.location.search);
        let tokenAccess = params.get('check');
        let route = '?check=';
        let result = false;

        const response = await apiService.put('reset' + route + tokenAccess,data,tokenAccess!)
        if (response && response.status === 200){
            toast.success("Mot de passe modifié !", {
                position: toast.POSITION.TOP_RIGHT,
            });
            result = true
        }

        return result;
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .required("Le mot de passe est obligatoire")
    });

    const initialValues = {
        password: "",
    };
    const navigate = useNavigate();
    const handleSubmit = async (values: { password: string }) => {
        const result = await putReset(values);
        if (result) {
            setIsLoading(true);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    };
    const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setSearchParams(searchParams);
        if (!searchParams.get('check')) {
            navigate('/')
        } else {
        }
    }, []);

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
                            <p>Veuillez saisir votre nouveau mot de passe</p>
                            <Field name="password" placeholder="Mot de passe" className="form-control" type="password"/>
                            <ErrorMessage
                                name="password"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <button className={"form-button"} type="submit"
                                disabled={isLoading}>
                            {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
                        </button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default ResetPassword;
