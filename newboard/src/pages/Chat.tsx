import React, {useEffect, useState} from 'react';
import * as io from "socket.io-client";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import { useNavigate, useParams} from "react-router";
import "../Chat.css"
import {urlApiSocket} from "../App";
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom";
import Messages from "../classes/Messages";
import ApiService from "../services/ApiService";
import Button from "react-bootstrap/Button";

const ChatPage = () => {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);
    const {roomId} = useParams<{ roomId: string}>()
    const apiService = new ApiService();
    const navigate = useNavigate();

    let socket = io.connect(urlApiSocket);
    let userId = localStorage.getItem("userId")
    let userFullName = localStorage.getItem("userFullName")



    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    async function getMessages() {
        const response = await apiService.get("messagesByRoomId/" + roomId, token!, navigate)
        if (response){
            setMessageList(response.data.data)
        }
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
        if(token !== null){
            socket.emit("join_room", roomId)
            getMessages()
        }
    },[token])


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
                    <p>Live Chat</p><br/>
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
            <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                navigate(`/vocal/${roomId}`)
            }}>
                Vocal
            </Button>
        <Footer/>
        </div>

    );
}

export default ChatPage;
