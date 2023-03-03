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
import Message from "../Classes/Message";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Column from "../components/Column";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link} from "react-router-dom";
import * as Yup from "yup";
import {useLocation, useNavigate} from "react-router";
import "../Chat.css"




const ChatPage = () => {


    const location = useLocation()
    const room = location.state.workspaceId
    let socket = io.connect("http://localhost:3001/");

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                room: room,
                sentBy: localStorage.getItem("userId"),
                message: currentMessage,
                sentAt: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message", messageData)
        }

    }

    const validationSchema = Yup.object().shape({
        message: Yup.string()
            .required("veuillez entrer un message"),

    });

    const initialValues = {
        message: ""
    };

    const navigate = useNavigate();
    const handleSubmit = async (values: {message: string; }) => {
        setCurrentMessage(values.message)
        await sendMessage()
    };

    useEffect(() => {
        socket.emit("join_room", room);

        socket.on("receive_message", (message) => {
            // @ts-ignore
            setMessageList((list) => [...list, message])
        })
    }, [socket])

    return (

        <div className="wrap">
            <SideBar/>
            <div className="chat-wrap">


                <div className="container-wrap-chat">
                    {messageList.map((messageContent) => {
                        // @ts-ignore
                        return <p>{messageContent.message}</p>
                    })}
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    <div className="container-wrap-form">
                        <Form className="form-wrap-message">
                            <fieldset className={"field-area"}>
                                <Field name="message" className="form-input-message" type="text" placeholder="Tapez votre message..."/>
                                <ErrorMessage
                                    name="message"
                                    component="small"
                                    className="text-danger"
                                />
                            </fieldset>
                            <button type="submit" className="send-message-button">Send</button>
                        </Form>
                    </div>
                </Formik>
            </div>
        <Footer/>
        </div>

    );
}

export default ChatPage;
