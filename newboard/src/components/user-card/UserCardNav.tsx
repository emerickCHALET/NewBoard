import React from "react";
import Users from "../../classes/Users";

type Props = {
    user: Users;
    setShowCard: (showCard: boolean) => void;
};

export const UserCardNav = ({ user, setShowCard }: Props) => {
    const handleCloseCard = () => {
        setShowCard(false);
    };

    return (
        <div className="content">
            <div className="card">
                <div className="firstinfo">
                    <img src="/profile.png" />
                    <div className="profileinfo">
                        <h1>
                            {user.firstname} {user.lastname}
                        </h1>
                        <h3 className={"color-email"}>{user.email}</h3>
                    </div>
                </div>
                <button onClick={handleCloseCard}>Fermer</button>
            </div>
        </div>
    );
};
