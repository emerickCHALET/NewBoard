import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

/**
 * Home Page when the user is not authenticated
 * @constructor
 */
const Home = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);

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
                    <div className={"featuresPresentation"}>
                        <img className={"iconHome"} src="./groupChat.png"/>
                        <img className={"iconHome"} src="./kanbanBoard.png"/>
                        <img className={"iconHome"} src="./studentAttendance.png"/>
                    </div>
                </div>
    )
}

export default Home;
