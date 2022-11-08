import React from 'react';
import type {FormEvent} from "react";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import '../index.css';

const sendForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const {name, password} = event.target as typeof event.target & {
        name: {value: string}
        password: {value: string}
    }

    console.log(name.value, password.value)

    /*await fetch('/route', {
        headers: {
            'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: name.value,
            password: password.value
        })
    })*/
}

const InscriptionPage = () => {
    return (
        <div className="wrap">
            <NavbarHome/>
            <div className="inscription-wrap">
                <form className="form-inscription" onSubmit={evt =>{sendForm(evt)}}>
                    <fieldset className={"field-area"}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id={"name"} />
                    </fieldset>
                    <fieldset className={"field-area"}>
                        <label htmlFor={"password"}>Password:</label>
                        <input type={"password"} id={"password"} />
                    </fieldset>
                    <button className={"form-button"} type={"submit"}>Inscription</button>
                </form>
            </div>
            <Footer/>
        </div>

    )
}

export default InscriptionPage;
