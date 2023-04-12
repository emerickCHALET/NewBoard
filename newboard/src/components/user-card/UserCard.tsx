import * as React from "react";
import { FunctionComponent } from "react";
import Users from "../../classes/Users";

export const UserCard = ({ user }: { user: Users }) => (
    <div className="ui card">
        <div className="image">
            <img src={'/profile.png'}/>
        </div>
        <div className="content">
            <div className="chat-header-profile">
                {user.firstname} {user.lastname}
            </div>
            <div className="meta">
                <span>{user.email}</span>
            </div>
            <div className="description">description</div>
        </div>
        <div className="extra content">
        </div>
    </div>
);