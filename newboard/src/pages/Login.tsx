import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import type {FormEvent} from "react";

const sendForm = async (event : FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const {email, password} = event.target as typeof event.target & {
        email: { value: string }
        password: { value: string }
    }

    console.log(email.value);
    console.log(password.value);
}

const Login = () => {
    return (
        <div className="Main">
            <NavbarHome/>
            <div className="inscription-wrap">
                <form className="form-inscription" onSubmit={evt => {sendForm(evt)}}>
                    <fieldset className={"field-area"}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email"/>
                    </fieldset>
                    <fieldset className={"field-area"}>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password"/>
                    </fieldset>
                    <button type="submit" className={"form-button"}>Login</button>
                </form>
            </div>
            <Footer/>
        </div>
    )
}

export default Login;
