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
    const [file, setFile] = useState<File>();
    const navigate = useNavigate();
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        fetch('http://localhost:3001/api/usersByFile', {
            method: 'POST',
            body: file,
            // 👇 Set headers manually for single file upload
            headers: {
                'content-type': file.type,
                'content-length': `${file.size}`, // 👈 Headers need to be a string
            },
        })
            .then((res) => {
                if(res.status === 200){
                    toast.success("Liste des élèves ajouté avec succés", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    console.log(res)
                }
            })
            .then((data) => console.log(data))
            .catch((err) => {
                {
                    console.log(err.response)
                    if(err.response) {
                        toast.error(err.response.data.message,{
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                }
            });
    };

    return (
        <div className="wrap">
            <SideBar/>
            <div className="container-wrap">
                <form
                    onSubmit={handleUploadClick}>
                    <input
                        id={"csvFile"}
                        type={"file"}
                        accept={".csv"}
                        onChange={handleFileChange}/>
                    <input type="submit" value="Valider" />
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default Management
