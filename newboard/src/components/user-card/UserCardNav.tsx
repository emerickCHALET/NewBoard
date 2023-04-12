import * as React from "react";
import Users from "../../classes/Users";

export const UserCardNav = ({ user }: { user: Users }) => (

        <div className="content">
            <div className="card">
                <div className="firstinfo"><img src="https://bootdey.com/img/Content/avatar/avatar6.png"/>
                    <div className="profileinfo">
                        <h1>John Doe</h1>
                        <h3>Swift developer</h3>
                        <p className="bio">Lived all my life on the top of mount Fuji, learning the way to be a Ninja
                            Dev.</p>
                    </div>
                </div>
            </div>
        </div>
);