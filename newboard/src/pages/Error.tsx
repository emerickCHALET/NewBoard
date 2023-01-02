import React from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

const ErrorPage = () => {
    return (
        <div className="wrap">
            <SideBar/>
            <img
                alt=""
                src="/404.png"
                width="700"
                height="400"
                className="d-inline-block align-top center"

            />
        <Footer/>
        </div>
)
}

export default ErrorPage;
