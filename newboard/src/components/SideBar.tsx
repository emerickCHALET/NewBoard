import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Link, useNavigate} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import "../App.css";
import { IconContext } from "react-icons";
import Navbar from "react-bootstrap/Navbar";
import {Button} from "react-bootstrap";
import Container from "react-bootstrap/Container";

/**
 * SideBar of the website when the user is authenticated
 * @param {string} token - this is the authentication token where the user is authenticated
 * @param {string} role - this is the role of the user
 * @param {string} establishment - this is the establishment Id when a administrator is connected
 * @constructor
 */
const SideBar = () => {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('permissions_role');
    const establishment = localStorage.getItem('establishmentId');
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    /**
     * Logout the user connected
     * @constructor
     */
    function Logout() {
        localStorage.removeItem('permissions_role');
        localStorage.removeItem('token');
        localStorage.removeItem('establishmentId');
        localStorage.removeItem('userId');
        navigate('/');
    }

    return (
        <>
            <IconContext.Provider value={{ color: "undefined" }}>
                <div className="navbar">
                    {token ?
                        <Link to="#" className="menu-bars">
                            <FaIcons.FaBars onClick={showSidebar} />
                        </Link>
                        : <></>}
                    <Container>
                        <Navbar.Brand href="/" className="family-font-first">
                            <img
                                alt=""
                                src="/NewBoardLogo.png"

                                height="50"
                                className="d-inline-block align-top"
                            />{' '}
                        </Navbar.Brand>
                        {token ? <></> : <Button onClick={() => navigate("/login")}>Connexion</Button>}
                    </Container>
                </div>
                {token ?
                    <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items" onClick={showSidebar}>
                            <li className="navbar-toggle">
                                <Link to="#" className="menu-bars">
                                    <AiIcons.AiOutlineClose />
                                </Link>
                            </li>
                            {role! === "ROLE_USER"?
                                <li className='nav-text'>
                                    <Link to={'/workspaces'}>
                                        <AiIcons.AiFillLayout />
                                        <span>Workspaces</span>
                                    </Link>
                                </li> : <></>}
                            {role! === "ROLE_USER"?
                                <li className='nav-text'>
                                    <Link to={'/chat'}>
                                        <AiIcons.AiFillLayout />
                                        <span>chat</span>
                                    </Link>
                                </li> : <></>}
                            {role! === "ROLE_ADMIN" &&  establishment != null?
                            <li className='nav-text'>
                                <Link to={'/management'}>
                                    <AiIcons.AiOutlineTeam />
                                    <span>Gestion</span>
                                </Link>
                            </li> : <></>}
                            <li className='nav-text' onClick={Logout}>
                                <a className='nav-text'><AiIcons.AiOutlineLogout />
                                    <span>Se déconnecter</span></a>
                            </li>
                        </ul>
                    </nav>
                    : <></>}
            </IconContext.Provider>
        </>
)
}

export default SideBar;
