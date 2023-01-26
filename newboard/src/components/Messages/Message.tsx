import React from 'react';
import Moment from 'react-moment';

const Message = (props: {message: {message: string; username: string;}; username: string;}) => {
    const  username = localStorage.getItem('nom prenom');
    const messageReceived = props.message.username !== username;
    return (
        <li className={messageReceived ? "message received" : "message sended"}>
            <div className="message-info">
                <span>{username}</span> <Moment format="MM/DD/YYYY h:mm:ss">{Date.now()}</Moment>
            </div>

            <p>{props.message.message}</p>
        </li>
    )
}

const username = localStorage.getItem('nom prenom');

export default Message
