import SideBar from "../components/SideBar";
import Messages from "../classes/Messages";
import Footer from "../components/Footer";
import React from "react";


const VocalRoomPage = () => {


    return (

        <div className="wrap">
            <SideBar/>
            <div className="chat-window">
                <div className="chat-header">
                    <p>Live Chat</p>
                </div>
                <div className="chat-body">

                </div>
            </div>

            <Footer/>
        </div>

    );
}

export default VocalRoomPage