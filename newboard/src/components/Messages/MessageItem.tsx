import React from 'react';
import Moment from 'react-moment';
import Message from "../../Classes/Message";

const MessageItem = (props: {message: Message;}) => {

    return (
        <li className={props.message.idsender ? "message received" : "message sended"}>
            <div className="message-info">
                <span>{props.message.idsender}</span> <Moment format="MM/DD/YYYY h:mm:ss">{Date.now()}</Moment>
            </div>

            <p>{props.message.message}</p>
        </li>
    )
}

export default MessageItem
