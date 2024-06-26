import React, {useState} from 'react';
import Footer from "../components/Footer";
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import {useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import SideBar from "../components/SideBar";
import Workspace from "../classes/Workspace";
import ApiService from "../services/ApiService";

const ForgotPassword = () => {
    const apiService = new ApiService();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email invalide")
            .required("L'email est obligatoire")
    });

    async function postForgot(values: { email: string }): Promise<boolean> {
        let data = {email: values.email};
        let result = false;

        const response = await apiService.post('forgot/',data, undefined)
        if (response && response.status === 200){
            toast.success("Un email vous à été envoyé !", {
                position: toast.POSITION.TOP_RIGHT,
            });
            result = true
        }
        return result;
    }

    const initialValues = {
        email: ""
    };
    const navigate = useNavigate();
    const handleSubmit = async (values: { email: string }) => {
        const result = await postForgot(values);
        if (result) {
            setIsLoading(true);
            setTimeout(() => {
                navigate('/');
            }, 5000);
        }
    };

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
                            <p>Entre ton adresse email pour recevoir un lien de réinitialisation de ton mot de
                                passe.</p>
                            <Field name='email' placeholder='Email' className="form-control" type="email"/>
                            <ErrorMessage
                                name="email"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <button type="submit" className="form-button"
                                disabled={isLoading}>
                            {isLoading ? "Traitement en cours..." : "Envoyer le lien"}
                        </button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default ForgotPassword
