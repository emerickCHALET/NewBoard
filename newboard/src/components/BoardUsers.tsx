import React, {useEffect, useRef, useState} from 'react';
import Users from "../classes/Users";
import {UserCard} from "./user-card/UserCard";
import Button from "react-bootstrap/Button";
import * as AiIcons from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik, FormikValues} from "formik";
import {toast} from "react-toastify";
import ApiService from "../services/ApiService";
import {useLocation, useNavigate, useParams} from "react-router";


interface UserListProps {
    usersWorkspace: Users[];
}
const BoardUsers: React.FC<UserListProps> = ({ usersWorkspace }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);

    const location = useLocation();
    // Initialize workspaceId here because the app crashes when we click on menu button, location.state.workspaceId would be null ??
    const {workspaceId} = useParams<{ workspaceId: string}>()
    let roomId = 0
    if(location.state != null){
        roomId = location.state.roomId
    }
    const apiService = new ApiService();
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);

    const handleUserClick = (user: Users) => {
        setSelectedUser(prevSelectedUser =>
            prevSelectedUser === user ? null : user
        );
    };

    const handleShowAddUser = () => setShowAddUser(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const handleCloseAddUser = () => setShowAddUser(false)
    /**
     * forceSelectOnlyOption is used to avoid a bug when our select only has 1 option and would take initial values instead of the only option available
     * @param options
     * @param values
     */
    const forceSelectOnlyOption = (options: Users[], values: FormikValues): void => {
        if (options.length == 1) {
            values.userId = options[0].id;
        }
        handleSubmitAddUsers(values)
    };

    const handleSubmitAddUsers = async (values: FormikValues) => {
        const result = await postWorkspaceUser(values);
        if (result) {
            window.location.reload()
        }
    };

    async function postWorkspaceUser(values: FormikValues): Promise<boolean> {
        let payload = {userID: values.userId, workspaceID: workspaceId};
        let result = false;

        const response = await apiService.post('workspacesUser',payload,token!,navigate)
        if (response && response.status === 200){
            toast.success("WorkspaceUser crée avec succès !", {
                position: toast.POSITION.TOP_RIGHT,
            });
            result = true
        }

        return result;
    }

    const [users, setUsers] = useState<Users[]>([])

    const className = localStorage.getItem("userClass")
    const getUsers = async () => {
        const response = await apiService.get("userByClassIdAndWorkspaceId/" + className + "/" + workspaceId, token!, navigate)
        if (response && response.status === 200) {
            setUsers(response.data.data);
        }
    }

    useEffect(() => {
        if(token !== null){
            getUsers()
        }
    }, [token])

    return (
        <div className="list-users">
            <Modal show={showAddUser} onHide={handleCloseAddUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un élève au Workspace</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{userId: 'null'}}
                        onSubmit={(values) => forceSelectOnlyOption(users, values)}
                        validateOnBlur={false}
                        validateOnChange={false}
                    >
                        <Form>
                            <fieldset className={"field-area"}>
                                <label htmlFor="name">User:</label>
                                <Field as="select" name="userId" className="form-control" type="userId">
                                    <option value="" disabled>Choisissez un Elève</option>
                                    {users.map((user, index) => (
                                        <option key={index} value={user.id}>
                                            {user.email}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="name"
                                    component="small"
                                    className="text-danger"
                                />
                            </fieldset>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAddUser}>
                                    Fermer
                                </Button>
                                <Button variant="primary" type={"submit"}>
                                    Ajouter
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
            <h2>Membres</h2>
            <ul className={"nav-menu-items"}>
                {usersWorkspace.map(user => (
                    <li className="nav-text nav-text-user" key={user.id} onClick={() => handleUserClick(user)}>
                        <img className={"profile-list-users"} src={"/profile.png"}/>
                        <span>{user.firstname + " " + user.lastname}</span>
                    </li>
                ))}
            </ul>
            {selectedUser && (
                <div className={"nav-text-user-information"}>
                    <div className={"informations-users"}>
                        <UserCard user={selectedUser} key={selectedUser.id}/>
                    </div>
                </div>
            )}
            <div className={"nav-menu-items bottom-fixed"}>
                <div className={"addUser-item-div"}>
                    <Button type={"button"} className={"btn-outline-primary informations-users"}  onClick={() => {
                        handleShowAddUser()
                    }}>
                        <AiIcons.AiOutlineUserAdd /> Partager
                    </Button>
                    <br/>
                    <br/>
                    <Button className={"btn-outline-primary informations-users"} variant="primary" onClick={() => {
                        navigate(`/chat/${roomId}`)
                    }}>
                       <AiIcons.AiFillWechat /> Chat
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BoardUsers;
