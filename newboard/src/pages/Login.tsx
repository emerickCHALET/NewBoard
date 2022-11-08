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
            <div className="container-home">
                <div className="form-login">
                    <form className="wrap" onSubmit={evt => {sendForm(evt)}}>
                        <fieldset>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email"/>
                        </fieldset>
                        <fieldset>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password"/>
                        </fieldset>
                        <button type="submit" className="button-form">Login</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Login;
