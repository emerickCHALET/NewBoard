// @ts-ignore

import React, {useEffect, useRef, useState} from 'react';
import * as io from "socket.io-client";
import {toast, ToastContainer} from "react-toastify";
import express from "express";
import ErrorPage from "./Error";


const Client = () => {
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState("")
    const [connectedUsers, SetConnectedUsers] = useState([] as { id: string; username: string; }[]);
    const socketClient = useRef<SocketIOClient.Socket>()

    useEffect(() => {
        socketClient.current = io.connect("http://localhost:5000");
        if (socketClient.current) {
            socketClient.current.on("username-taken", () => {
                toast.error("username est pris fdp")

            })
            socketClient.current.on("username-submitted-successfully", () => {
                setConnected(true)
            })
            socketClient.current.on("get-connected-users", (connectedUsers: { id: string; username: string; }[]) => {
                SetConnectedUsers(connectedUsers.filter(user => user.username !== username));
                console.log(connectedUsers)
            })
        }


},
[]
)

const handleConnection = () => {
    if (socketClient.current) {
        socketClient.current.emit("handle-connection");
    }
}
    return (
        <div className="app">
            {
            !connected &&
                <div className=" .enter-username-form">
                    <form onSubmit={e => {
                    e.preventDefault()
                        handleConnection()
                    }}>
                        <input type="text"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                               placeholder="enter your username"/>
                        <button type="submit">Submit</button>

                    </form>
                </div>

            }
            {

            connected &&
                <div>Connected</div>
            }


            <ToastContainer position="bottom-right"/>
        </div>

    );
}

    export default Client;
