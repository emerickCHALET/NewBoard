import React from 'react'
import messageItem from "./MessageItem";
import Message from '../../Classes/Message'
import {array} from "yup";
import MessageItem from "./MessageItem";

const Messages = (props: {
    handleSendMessage: Function;
    message: Message;
    setMessage: Function;
    messages: Array<Message>;
    username: string;
}) => {
    return (
        <div className="messages">
            <ul className="message-list scrollable">
                {props.messages.map((message, i) => (
                    <MessageItem key={i + message.id} message={message}/>
                ))}
            </ul>

            <form onSubmit={e => {
                e.preventDefault()
                props.handleSendMessage();
            }}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={props.message.message}
                    onChange={e => props.setMessage(e.target.value)}
                    required={true}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default Messages

