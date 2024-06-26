import React, {FC, useState} from 'react';
import { Nav } from 'react-bootstrap';
import Users from "../classes/Users";
import {UserCardNav} from "./user-card/UserCardNav";

interface FacepileProps {
    users: Users[];
    maxCount?: number;
}

const Facepile: FC<FacepileProps> = ({ users, maxCount = 5 }) => {
    const visibleUsers = users.slice(0, maxCount);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [showCard, setShowCard] = useState(false);
    const handleShowCard = (user: Users) => {
        setShowCard(true);
        setSelectedUser(user)
    };

    return (
        <>
        <Nav>
            {visibleUsers.map((user) => (
                <Nav.Link key={user.id}>
                    <img
                        src={"/profile.png"}
                        alt={user.firstname}
                        className="rounded-circle me-2"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => {
                            handleShowCard(user)
                        }}
                    />
                </Nav.Link>
            ))}
            {users.length > maxCount && (
                <Nav.Link>{`+${users.length - maxCount}`}</Nav.Link>
            )}
        </Nav>
            {selectedUser && (
                <div className={"position-userCardNav"}>
                    {showCard && <UserCardNav user={selectedUser} setShowCard={setShowCard} />}
                </div>
            )}
        </>
    );
};

export default Facepile;
