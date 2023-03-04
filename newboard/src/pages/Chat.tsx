import React, {useEffect, useState} from 'react';
import * as io from "socket.io-client";
import {toast} from "react-toastify";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useLocation, useNavigate} from "react-router";
import "../Chat.css"
import axios from "axios";
import {urlApi} from "../App";

const ChatPage = () => {
    const config = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    };

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
            }
            await socket.emit("send_message", messageData)
            // @ts-ignore
            await postMessage(messageData.room, messageData.sentBy, messageData.message)
        }

    }

    const validationSchema = Yup.object().shape({
        message: Yup.string()
            .required("veuillez entrer un message"),

    });

    const initialValues = {
        message: ""
    };

    async function postMessage(room: string, sentBy: String, message: String): Promise<boolean> {
        let payload = {room: room, sentBy: sentBy, message: message};
        let result = false;
        await axios
            .post(urlApi + 'messages',payload, config)
            .then((response) => {
                if(response.status === 200){

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

    const getMessages = () => {
        axios
            .get(urlApi + "messages/", config)
            .then((response) => {
                if (response.status === 200) {
                    setMessageList(response.data.data)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nReconnexion requise", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }


            })
    }

    const navigate = useNavigate();
    const handleSubmit = async (values: {message: string; }) => {
        setCurrentMessage(values.message)

        await sendMessage()
    };

    useEffect(() => {
        getMessages()
        socket.emit("join_room", room);

        socket.on("receive_message", (message) => {
            // @ts-ignore
            console.log(message)
        })
    }, [socket])

    return (

        <div className="wrap">
            <SideBar/>
            <div className="chat-wrap">


                <div className="container-wrap-chat">
                    {messageList.map((messageContent) => {
                        const {message, sentBy} = messageContent;
                        return <div>
                            <h1>{message}</h1>
                            <p>id sender: {sentBy}</p>
                        </div>

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
