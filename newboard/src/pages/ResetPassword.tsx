import React, {useEffect, useState} from 'react';
import Footer from "../components/Footer";
import '../index.css';
import * as Yup from 'yup';
import {Formik, ErrorMessage, Form, Field} from 'formik';
import axios from 'axios';
import {urlLocal} from "../App";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import SideBar from "../components/SideBar";

async function putReset(values: { password: string}): Promise<boolean> {
    let data = {  password: values.password };
    let params = new URLSearchParams(window.location.search);
    let tokenAccess = params.get('check');
    let myHeaders = {
        'Authorization': 'Bearer ' +tokenAccess
    };
    let result = false;
    await axios
        .put(urlLocal+'reset',data,{headers: myHeaders})
        .then((response) => {
            if(response.status === 200){
                toast.success("Mot de passe modifié !", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                result = true
            }
        })
        .catch(function (error) {
            if(error.response) {
                console.log("Check token "+tokenAccess);
                toast.error(error.response.data.message,{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
    return result;
}

const ResetPassword = () => {

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
            navigate('/login');
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
                            <p>Veuillez saisir votre nouveau mot de passe</p>
                            <Field name="password" placeholder="Mot de passe" className="form-control" type="password"/>
                            <ErrorMessage
                                name="password"
                                component="small"
                                className="text-danger"
                            />
                        </fieldset>
                        <button className={"form-button"} type="submit">Sauvegarder</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}


export default ResetPassword;
