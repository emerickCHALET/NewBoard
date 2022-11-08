import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const NavbarHome = () => {
    const navigate = useNavigate();
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home" className="family-font-first">
                    <img
                        alt=""
                        src="/postit.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    New Board
                </Navbar.Brand>
                <Navbar.Toggle />
                <Button onClick={() => navigate("/home")}>Connexion</Button>
            </Container>
        </Navbar>
    )
}

export default NavbarHome;
