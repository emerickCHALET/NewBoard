import React from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

/**
 * Home Page when the user is not authenticated
 * @constructor
 */
const Home = () => {
    const navigate = useNavigate();
    return (
                <div className="container-home">
                    <div className="inner">
                        <h1 className="cover-heading family-font-first">Développez en gagnant du temps !</h1>
                        <img title="scrum" className="scrum" src="./scrumboard.jpg" alt="scrum board from home"/>
                        <p className="font-home-p font-weight-bold">Vous en avez marre d’avoir plusieurs outils ouverts sur votre ordinateur ? Marre de vous perdre dans tous ces onglets ? Alors ne cherchez pas plus loin car nous avons la solution !
                        </p>
                        <p className="font-home-p font-weight-bold">
                            Le projet New Board est fait pour vous ! Il s’agit d’un site web permettant aux utilisateurs de gérer leurs projets grâce à divers services. Tableaux, Messagerie, Chat vocal, tout ce dont vous avez besoin se trouve ici.
                        </p>
                        <p className="font-home-p font-weight-bold">
                            New Board permettra aux élèves, professeurs et même aux développeurs de gérer en toute facilité leur projet.
                        </p>
                        <p className="font-home-p font-weight-bold">
                            T’as ton idée ? T’as ton New Board !
                        </p>
                        <Button onClick={() => navigate("/inscription")}>
                            Rejoignez nous !
                        </Button>
                    </div>
                </div>
    )
}

export default Home;