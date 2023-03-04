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
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom";

const ChatPage = () => {
    const config = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    };

    const location = useLocation()
    const room = location.state.roomId
    let socket = io.connect("http://localhost:3001/");
    let userId = localStorage.getItem("userId")

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    async function getMessages() {
        await axios
            .get(urlApi + "messagesByRoomId/" + room, config)
            .then((response) => {
                if (response.status === 200) {
                    setMessageList(response.data.data)
                    console.log(messageList)
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


    const submitMessage = () => {
        if (userId !== null && currentMessage != ""){
            const messageData = {
                roomId: room.toString(),
                sentBy: userId.toString(),
                message: currentMessage,
            }
            socket.emit("send_message", messageData)
        }
    }

    useEffect(() => {
        socket.emit("join_room", room)
        getMessages()
    },[])


    useEffect(() => {
// @ts-ignore
        socket.on("message_received", (data) => {
            console.log(data)
            // @ts-ignore
            setMessageList((list) => [...list, data])
        })

    }, [socket])

    return (

        <div className="wrap">
            <SideBar/>
            <div className="chat-window">
                <div className="chat-header">
                    <p>Live Chat</p>
                </div>
                <div className="chat-body">
                    <ScrollToBottom className="message-container">
                        {messageList.map((messageContent) => {
                            const {sentBy, message, created} = messageContent;
                            return (

                                <div
                                    className="message"
                                    id={userId == sentBy ? "you" : "other"}
                                >
                                    <div>
                                        <div className="message-content">
                                            <p>{message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{created}</p>
                                            <p id="author">{sentBy}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollToBottom>
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Hey..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && submitMessage();
                        }}
                    />
                    <button onClick={submitMessage}>&#9658;</button>
                </div>
            </div>

        <Footer/>
        </div>

    );
}

export default ChatPage;


/*
<div className="chat-window">
    <div className="chat-body">
        {messageList.map((messageContent) => {
            const {sentBy, message, created} = messageContent;
            return (
                <div className={"message-wrap"} id={userId === sentBy ? "you" : "other" }>
                    <div className={"message-content"}>
                        <h4>{message}</h4>
                    </div>
                    <div className={"message-meta"}>
                        <p>{created}</p>
                        <p>id sender: {sentBy}</p>
                    </div>
                </div>

            )})}
    </div>
    <input id={"messageText"} type={"text"} placeholder={"message..."} onChange={(event) => {
        setCurrentMessage(event.target.value)
    }
    }/>
    <button onClick={submitMessage}>Send</button>
</div>*/
