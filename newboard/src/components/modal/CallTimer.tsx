import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import axios from "axios";
import * as AiIcons from "react-icons/ai";
import {toast} from "react-toastify";
import {urlApi} from "../../App";
import Classroom from "../../classes/Classroom";

interface CallTimerProps {
    classrooms: Classroom[];
}

const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

const CallTimer: React.FC<CallTimerProps> = ({classrooms}) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState('');

    const showModal = () => setShowTimer(true);
    const closeModal = () => setShowTimer(false);
    const classSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(event.target.value);
    };
    const timeSelection = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedTime(event.target.value);
        console.log(selectedTime);
    }
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
     * savePredictAttendance save the predicted attendance
     */
    const savePredictAttendance = () => {
        if (!selectedClassId || !selectedTime) {
            toastWarning('Veuillez sélectionner une classe et une heure avant de sauvegarder.');
            return;
        }
        const myData = {
            classroomsId: selectedClassId,
            call_date: selectedTime,
        }
        setIsLoading(true);
        axios.post(urlApi + 'attendancetimer', myData, config)
            .then((response) => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                if (response.status === 200) {
                    toastSuccess(response.data.message)
                }
            })
            .catch((error) => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                toastError(error.response.data.message)
            });
    }

    return (
        <div className="containerModal">
            <Button variant="primary" onClick={showModal}>
                <AiIcons.AiOutlineFieldTime size={20}/>
            </Button>
            <Modal show={showTimer} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Programmer un appel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Classe à surveiller</Form.Label>
                        <Form.Select
                            onChange={classSelection}
                            value={selectedClassId ?? ''}
                            required={true}
                        >
                            <option value="" disabled={true}>Choix de la classe</option>
                            {classrooms && classrooms.map((classe) => (
                                <option key={classe.id} value={classe.id}>
                                    {classe.ClassroomName}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="timePicker">
                        <Form.Label>Heure de l'appel</Form.Label>
                        <Form.Control type="time" value={selectedTime} required={true} onChange={timeSelection}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Fermer
                    </Button>
                    <Button
                        variant="success"
                        onClick={savePredictAttendance}
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
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CallTimer;
