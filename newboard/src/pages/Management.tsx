import React, {ChangeEvent} from 'react';
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import {useNavigate} from "react-router";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import useReadCSV from "../components/UseReadCsv";

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

const Test = (value: string) => {
    useReadCSV(value)
};

const Management = () => {

    const navigate = useNavigate();
    const handleSubmit = async () => {
        console.log('la')
        //const result = await postCsvUser(values);
        //if (result) {
        //    navigate('/management');
        //}
    };

    const input = document.getElementById('csvFile') as HTMLInputElement | null;
    const value = input?.value;

    return (
        <div className="wrap">
            <SideBar/>
            <div className="container-wrap">
                <form
                    onSubmit={(e: React.SyntheticEvent) => {
                        e.preventDefault();
                        console.log(value);
                        Test(value!);
                    }}>
                    <input id={"csvFile"} type={"file"} accept={".csv"} />
                    <input type="submit" value="Valider" />
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default Management
