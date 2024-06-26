import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import * as AiIcons from "react-icons/ai";
import {toast} from "react-toastify";
import Attendance from "../../classes/Attendance";
import Classroom from "../../classes/Classroom";
import Student from "../../classes/Student";
import "../../styles/HistoryUser.css"
import ApiService from "../../services/ApiService";
import {useNavigate} from "react-router";

interface HistoryProps {
    classrooms: Classroom[];
}

const HistoryUser: React.FC<HistoryProps> = ({classrooms}) => {
    // Global const
    const apiService = new ApiService();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);

    // Component const
    const [userRelever, setUserRelever] = useState<Student[]>([]);
    const [releverByUser, setReleverByUser] = useState<Attendance[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [showRelever, setShowRelever] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const showModal = () => setShowRelever(true);
    const closeModal = () => setShowRelever(false);

    const toastError = (errorMessage: string) => {
        toast.error(errorMessage, {position: toast.POSITION.TOP_RIGHT});
    }

    /**
     * classSelection is a function that is called when the user select a classroom in the select.
     * It will update the state of the selectedClassId and call the function getStudentByClass to get all the students of the selected classroom.
     * @param event
     */
    const classSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedClassId = parseInt(selectedValue);
        if (!isNaN(selectedClassId)) {
            setSelectedClassId(selectedClassId);
            getStudentByClass(selectedClassId);
            setReleverByUser([])
            setSelectedUserId(null)
        }
        setSelectedClassId(selectedClassId);
        setReleverByUser([])
        setSelectedUserId(null)

    };

    /**
     * studentSelection is a function that is called when the user select a student in the select.
     * It will update the state of the selectedUserId and call the function getReleverByUser to get all the present history of the student selected.
     * @param event
     */
    const studentSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedUserId = parseInt(selectedValue);
        if (!isNaN(selectedUserId)) {
            setSelectedUserId(selectedUserId);
            getReleverByUser(selectedUserId);
        }
        setSelectedUserId(selectedUserId);
    };

    /**
     * getStudentByClass get all the students of a classroom when the user select a classroom
     * @param selectedClassId
     */
    const getStudentByClass = async (selectedClassId: number) => {
        try {
            const response = await apiService.get('usersByClassroom/' + selectedClassId, token!, navigate);
            if (response && response.status === 200) {
                if (response.data.data.length === 0) {
                    toastError("Aucun élève n'est enregistré dans cette classe")
                    setUserRelever([])
                    setSelectedUserId(null)
                    setIsDisabled(true)

                } else {
                    setUserRelever(response.data.data)
                    setIsDisabled(false)
                }
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }

    /**
     * getReleverByUser get all the present history of a student when the user select a student
     * @param selectedUserId
     */
    const getReleverByUser = async (selectedUserId: number) => {
        try {
            const response = await apiService.get('attendanceByUser/' + selectedUserId, token!, navigate);
            if (response && response.status === 200) {
                if (response.data && response.data.message === "L'élève n'est dans aucune fiche d'appel.") {
                    toastError(response.data.message);
                    setReleverByUser([])
                }
                setReleverByUser(response.data.data)
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }


    return (
        <div className="containerModalHistory">
            <Button variant="dark" onClick={showModal}>
                <AiIcons.AiOutlineHistory size={20}/>
            </Button>
            <Modal show={showRelever} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Relever d'appel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="formGroupHistoryClass">
                            <Form.Label className="labelHistoryClass">Relever de présence d'un élève</Form.Label>
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
                        <Form.Group className="formGroupHistoryStudent">
                            <Form.Select
                                onChange={studentSelection}
                                value={selectedUserId ?? ''}
                                disabled={isDisabled}
                            >
                                <option value="" disabled={true}>Choix de l'élève</option>
                                {userRelever && userRelever.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        <div>{user.firstname} </div>
                                        <div>{user.lastname}</div>
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                    <ul>
                        {releverByUser && releverByUser.map((user) => (
                            <li key={user.id}>
                                <p className="mapModalReleverTitle">Date
                                    : {new Date(user.call_date).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                <p className="mapModalReleverPresence">Présence : {user.present ?
                                    <span className="mapModalReleverSuccess">Présent</span> :
                                    <span className="mapModalReleverFailed">Absent</span>}</p>

                                <p className="mapModalReleverRetard">Retard : {user.late ?
                                    <span className="mapModalReleverFailed">Oui</span> :
                                    <span className="mapModalReleverSuccess">Non</span>}</p>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HistoryUser;
