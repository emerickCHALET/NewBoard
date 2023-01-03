import React, {ChangeEvent} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";

async function postCsvUser(values: { email: string; password: string; }): Promise<boolean> {
    let payload = { email: values.email, password: values.password };
    let result = false;
    await axios
        .post(urlApi + 'login',payload)
        .then((response) => {
            if(response.status === 200){
                toast.success("Bienvenue!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(response)
                localStorage.setItem('permissions_role', response.data.data.role);
                localStorage.setItem('token', response.data.token);
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

const Management = () => {

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

    const navigate = useNavigate();
    const handleSubmit = async (values: { email: string; password: string; }) => {
        const result = await postCsvUser(values);
        if (result) {
            navigate('/management');
        }
    };

    const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.files![0])
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
                        <input
                            type="file"
                            name="file"
                            accept=".csv"
                            onChange={changeHandler}
                            style={{ display: "block", margin: "10px auto" }}
                        />                        <button type="submit" className="form-button">Valider</button>
                    </Form>
                </div>
            </Formik>
            <Footer/>
        </div>
    )
}

export default Management
