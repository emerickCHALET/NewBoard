import React, {useEffect, useState} from 'react';
import * as io from "socket.io-client";
import {toast} from "react-toastify";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {useLocation, useNavigate} from "react-router";
import "../Chat.css"
import axios from "axios";
import {urlApi} from "../App";
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "../Classes/Message";

const ChatPage = () => {
    const config = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    };
    const navigate = useNavigate();
    const location = useLocation()
    let room = 0

    if(location.state != null){
        room = location.state.roomId
    }

    let socket = io.connect("http://localhost:3001/");
    let userId = localStorage.getItem("userId")
    let userFullName = localStorage.getItem("userFullName")

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    async function getMessages() {
        await axios
            .get(urlApi + "messagesByRoomId/" + room, config)
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

    const submitMessage = () => {
        if (userId !== null && currentMessage != "") {
            // @ts-ignore
            socket.emit("send_message", new Message(room.toString(), userFullName, userId, currentMessage, ""))
        }
    }

    useEffect(() => {
        socket.emit("join_room", room)
        getMessages()
    },[])


    useEffect(() => {
// @ts-ignore
        socket.on("message_received", (data) => {
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
                        {messageList.map((message: Message) => {

                            return (

                                <div
                                    className="message"
                                    id={userId == message.sentBy ? "you" : "other"}
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
                    <button onClick={submitMessage}>&#9658;</button>
                </div>
            </div>

        <Footer/>
        </div>

    );
}

export default ChatPage;
