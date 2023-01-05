import React, {ChangeEvent, useState} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import {useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import { parse } from 'papaparse';
import { readFileSync } from 'fs';
import * as path from 'path';

type Data = {
    Nom: string;
    Prenom: string;
    Classe: string;
    Email: string;
};

type Values = {
    data: Data[]
}

//API
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
    const [term, setTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = () => {
        //if (result) {
        //    navigate('/management');
        //}

    };

    return (
        <div className="wrap">
            <SideBar/>
            <div className="container-wrap">
                <form
                    onSubmit={handleSubmit}>
                    <input
                        id={"csvFile"}
                        type={"file"}
                        accept={".csv"}
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}/>
                    <input type="submit" value="Valider" />
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default Management
