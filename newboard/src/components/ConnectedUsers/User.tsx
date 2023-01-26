import React, {useState} from 'react'

const User = (props: {user: {id: string, username: string}}) => {
    const [username, setUsername] = useState(localStorage.getItem('nom prenom'));

    return (
        <li className="connected-user">
            <img src="/assets/user.png" alt="Uknown User"/>
            <span>{props.user.username}</span>
        </li>
    )
}

export default User
