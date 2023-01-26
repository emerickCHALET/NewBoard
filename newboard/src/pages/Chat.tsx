    // @ts-ignore

import React, {useEffect, useRef, useState} from 'react';
import * as io from "socket.io-client";
import {toast, ToastContainer} from "react-toastify";
import express from "express";
import ErrorPage from "./Error";
    import EnterUsername from "../components/EnterUsername";
    import ConnectedUsers from "../components/ConnectedUsers/ConnectedUsers";
   import Messages from "../components/Messages/Messages";
    import SideBar from "../components/SideBar";
    import Footer from "../components/Footer";

    const Client = () => {
        const [connectedUsers, setConnectedUsers] = useState([] as {id: string, username: string}[]);
        const [username, setUsername] = useState("");
        const [connected, setConnected] = useState(false)
        const [messages, setMessages] = useState([] as {message: string, username: string}[]);
        const [message, setMessage] = useState("");

        const socketClient = useRef<SocketIOClient.Socket>();

        useEffect(() => {
            socketClient.current = io.connect("http://localhost:5000");

            if(socketClient.current){
                socketClient.current.on("username-submitted-successfully", () => {
                    setConnected(true);
                })

                socketClient.current.on("username-taken", () => {
                    toast.error("Username is taken")
                })

                socketClient.current.on("get-connected-users", (connectedUsers: {id: string, username: string}[]) => {
                    setConnectedUsers(connectedUsers.filter(user => user.username !== username));
                })

                socketClient.current.on("receive-message", (message: {message: string; username: string}) => {
                    setMessages(prev => [...prev, message]);
                })
            }

            return () => {
                socketClient.current?.disconnect();
                socketClient.current = undefined;
            };
        }, [username])

        const handleConnection = () => {
            if(socketClient.current){
                socketClient.current.emit("handle-connection", username);
            }
        }

        const handleSendMenssage = () => {
            if(socketClient.current){
                setMessages(prev => [...prev, {message, username}]);
                socketClient.current.emit("message", {message, username});
                setMessage("")
            }
        }

        return (
            <div className="app">
                <SideBar/>
                {
                    !connected &&
                    <EnterUsername handleConnection={handleConnection} username={username} setUsername={setUsername}/>
                }

                {
                    connected &&
                    <>
                        <ConnectedUsers connectedUsers={connectedUsers}/>

                        <Messages
                            handleSendMessage={handleSendMenssage}
                            message={message}
                            setMessage={setMessage}
                            messages={messages}
                            username={username}
                        />
                    </>
                }

                <ToastContainer position="bottom-right"/>
            </div>
        );
    }

    export default Client;
