import React from 'react';
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import * as AiIcons from "react-icons/ai";

/**
 * Home Page when the user is not authenticated
 * @constructor
 */
const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
                <div className="container-home">
                    <div className="inner">
                        <img title="scrum" className="scrum" src="./homeWelcome.png" alt="scrum board from home"/>
                        {token ?
                            <div></div>
                            : <Button onClick={() => navigate("/inscription")}>
                                Rejoignez nous !
                            </Button>}
                    </div>
                </div>
    )
}

export default Home;
