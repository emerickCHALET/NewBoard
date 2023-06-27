import React, {useEffect, useState} from 'react';
import *  as io from 'socket.io-client';
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import * as AiIcons from "react-icons/ai";
import {toast} from "react-toastify";
import Classroom from "../../classes/Classroom";
import UsersStatus from "../../classes/UsersStatus";
import "../../styles/OnlineUser.css"
import CallTimer from "./CallTimer";
import ApiService from "../../services/ApiService";
import {useNavigate} from "react-router";
import {urlApiSocket} from "../../App";

interface OnlineProps {
    classrooms: Classroom[];
}

const ModalOnline: React.FC<OnlineProps> = ({classrooms}) => {
    const socket = io.connect(urlApiSocket);
    // Global const
    const apiService = new ApiService();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);

    // Component const
    const [userList, setUserList] = useState<UsersStatus[]>([]);
    const storageId = localStorage.getItem('userId');
    const userFirstName = localStorage.getItem('userFirstName') || 'Unknown';
    const userLastName = localStorage.getItem('userLastName') || 'Unknown';
    const userId = storageId ? Number(storageId) : Number(socket.id);
    const [showOnline, setShowOnline] = useState<boolean>(false);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const showModal = () => setShowOnline(true);
    const closeModal = () => setShowOnline(false);

    const toastError = (errorMessage: string) => {
        toast.error(errorMessage, {position: toast.POSITION.TOP_RIGHT});
    }
    const toastWarning = (warningMessage: string) => {
        toast.warning(warningMessage, {position: toast.POSITION.TOP_RIGHT});
    }
    const toastSuccess = (successMessage: string) => {
        toast.success(successMessage, {position: toast.POSITION.TOP_RIGHT});
    }

    /**
     * useEffect is called after the render is committed to the screen.
     * User is added to the list of connected users
     */
    useEffect(() => {
        const user: UsersStatus = {
            id: userId,
            userId: userId,
            firstName: userFirstName,
            lastName: userLastName,
            classId: Number(localStorage.getItem('userClass') || 0),
            lastActive: new Date()
        };
        // Ajoute l'utilisateur à la liste des utilisateurs connectés
        socket.emit('addUser', user);

        // Recupere la liste des utilisateurs connectés du serveur
        socket.on('userList', (users: UsersStatus[]) => {
            const userFilter = users.filter((u) => u.id !== user.id); // Filter out current user
            setUserList(userFilter);
        });

        socket.on('disconnect', () => {
            socket.emit('disconnect', {id: user.id});
        });

    }, [userId, userLastName, userFirstName]);

    const classSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(event.target.value);
    };

    const userFilter = userList.filter((user) => user.classId && user.classId.toString() === selectedClassId);

    useEffect(() => {
        if (selectedClassId !== '' && userFilter.length === 0) {
            toastWarning("Aucun élève est actif dans la classe sélectionnée.")
        }
    }, [selectedClassId]);

    /**
     * saveAutoAttendance save the attendance of the students who are connected
     */
    const saveAutoAttendance = async () => {
        if (!selectedClassId) {
            toastWarning('Veuillez sélectionner une classe avant de sauvegarder.');
            return;
        }
        const myData = {
            classroomId: selectedClassId,
            attendance: userFilter.map((user) => {
                return {
                    id: user.userId,
                    firstname: user.firstName,
                    lastname: user.lastName,
                    present: true,
                    late: false,
                }
            })
        }
        setIsLoading(true);
        try {
            const response = await apiService.post('attendance', myData, token!, navigate);
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            if (response && response.status === 200) {
                toastSuccess(response.data.message)
            }
        } catch (error: any) {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            toastError(error.response.data.message)
        }
    }

    return (
        <div className="containerModal">
            <Button variant="success" onClick={showModal}>
                <AiIcons.AiFillPhone size={20}/>
            </Button>
            <Modal show={showOnline} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Liste des utilisateurs connectés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="Form-Select-Classroom">
                            <Form.Label>Filtrer par classe</Form.Label>
                            <Form.Select
                                onChange={classSelection}
                                value={selectedClassId ?? ''}
                            >
                                <option value="" disabled={true}>Choix de la classe</option>
                                {classrooms && classrooms.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.ClassroomName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                    <ul className="mapModal">
                        {userFilter && userFilter.map((user) => (
                            <li className="mapModalOption" key={user.id}>
                                <span className="mapModalData">
                                    {user.firstName} {user.lastName}
                                </span> ({user.classId}) - Dernière activité
                                : {new Date(user.lastActive).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Fermer
                    </Button>
                    <Button
                        variant="success"
                        onClick={saveAutoAttendance}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Enregistrement en cours... <Spinner animation="border" size="sm"/>
                            </>
                        ) : (
                            'Sauvegarder'
                        )}
                    </Button>
                    <CallTimer classrooms={classrooms}/>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalOnline;
