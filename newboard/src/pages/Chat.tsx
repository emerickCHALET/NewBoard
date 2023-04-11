import React, {useEffect, useState} from 'react';
import * as io from "socket.io-client";
import {toast} from "react-toastify";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import { useNavigate, useParams} from "react-router";
import "../Chat.css"
import axios from "axios";
import {urlApi} from "../App";
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom";
import Messages from "../classes/Messages";

const ChatPage = () => {
    const {roomId} = useParams<{ roomId: string}>()
    const config = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    };
    const navigate = useNavigate();

    let socket = io.connect("http://localhost:3001/");
    let userId = localStorage.getItem("userId")
    let userFirstName = localStorage.getItem("userFirstName")
    let userLastName = localStorage.getItem("userLastName")
    let userFullName = userFirstName + " " + userLastName

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    async function getMessages() {
        await axios
            .get(urlApi + "messagesByRoomId/" + roomId, config)
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
                    if(error.response.data.disconnect === true){
                        localStorage.clear()
                        navigate('/login');
                    }
                }


            })
    }

    /**
     * submitMessage sends an event on socketIo to tell every listener that a new message has been sent, so they can receive it
     */
    const submitMessage = () => {
        if (userId !== null && currentMessage != "") {
            // @ts-ignore
            socket.emit("send_message", new Messages(null, userId, userFullName, currentMessage, roomId.toString()))
        }
    }

    /**
     * When we arrive at the page, we notify that we joined the room and get all messages in DB
     */
    useEffect(() => {
        socket.emit("join_room", roomId)
        getMessages()
    },[])


    /**
     * when we receive a new message, we add it to the message list
     */
    useEffect(() => {
        socket.on("message_received", (data) => {
            // @ts-ignore
            setMessageList((list) => {
                return [...list, data];
            })
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
                        {messageList.map((message: Messages) => {

                            return (

                                <div
                                    className="message"
                                    id={userId == message.sentBy.toString() ? "you" : "other"}
                                    data-testid="message"
                                >
                                    <div>
                                        <div className="message-content">
                                            <p>{message.message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{message.created}</p>
                                            <p id="author">{message.fullNameSender}</p>
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
                        placeholder="Type your message..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && submitMessage();
                        }}
                    />
                    <button onClick={submitMessage} aria-label="Send">&#9658;</button>
                </div>
            </div>

        <Footer/>
        </div>

    );
}

export default ChatPage;
