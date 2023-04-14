import React, {useMemo, useEffect, useState} from 'react';
import {Form, Table, Button, Spinner} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import {urlApi} from "../App";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import Attendance from "../classes/Attendance";
import Classroom from "../classes/Classroom";
import Student from "../classes/Student";
import '../styles/Attendance.css';
import OnlineUser from "../components/modal/OnlineUser";
import HistoryUser from "../components/modal/HistoryUser";


const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

/**
 * AttendanceSheet is the page where the PO can see the attendance of a classroom
 */
const AttendanceSheet: React.FC = () => {
    const navigate = useNavigate();

    /**
     * useState is the hook to use state in a functional component
     */
    const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<Student[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [history, setHistory] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLateEnabled, setIsLateEnabled] = useState<boolean[]>([]);
    const [lateDuration, setLateDuration] = useState(0);

    /**
     * toastError, toastWarning and toastSuccess are used to display a toast with a message
     */
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
     * getClassrooms get all the classrooms when the page is loaded
     */
    const getClassrooms = async () => {
        try {
            const response = await axios.get(urlApi + 'classrooms', config)
            if (response.status === 200) {
                setClassrooms(response.data.data)
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }

    /**
     * getHistory get all attendance history of a class when getClassroom is called
     * @param classroomId
     */
    const getHistory = async () => {
        try {
            const response = await axios.get(urlApi + 'attendancecall', config)
            if (response.status === 200) {
                setHistory(response.data.data)
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }

    /**
     * useEffect is called after the render is committed to the screen.
     */
    useEffect(() => {
        getClassrooms();
        getHistory();
    }, []);

    /**
     * getStudentByClass get all the students of a classroom when the user select a classroom
     * @param classroomId
     */
    const getStudentByClass = async (classroomId: string) => {
        try {
            const response = await axios.get(urlApi + 'usersByClassroom/' + classroomId, config)
            if (response.status === 200) {
                if (response.data.data.length === 0) {
                    toastWarning("Aucun élève n'est enregistré dans cette classe");
                    setSelectedStudents([]);
                } else {
                    setSelectedStudents(response.data.data);
                }
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }

    /**
     * getStudentByHistory get all the students of a history when the user select a history
     * @param selectedHistoryId
     */
    const getStudentByHistory = async (selectedHistoryId: number) => {
        try {
            const response = await axios.get(urlApi + 'attendancehisto/' + selectedHistoryId, config)
            if (response.status === 200) {
                if (response.data.data.length === 0) {
                    toastWarning("Aucun élève n'est enregistré dans cette classe");
                    setSelectedStudents([]);
                }
                setSelectedHistory(response.data.data)
            }
        } catch (error: any) {
            toastError(error.response.data.message);
        }
    }

    /**
     * saveAttendance save the attendance of the students in the database when the user click on the button "Enregistrer"
     */
    const saveAttendance = async () => {

        if (selectedStudents.length === 0) {
            toastError('Aucune donnée est présente');
            return;
        }

        /**
         * myData is the data to send to the API
         * @type {{classroomId: number, attendance: {id: number, firstname: string, lastname: string, present: boolean, late: boolean, lateDuration: number}[]}}
         */
        const myData = {
            classroomId: selectedClassroomId,
            attendance: selectedStudents.map(student => {
                return {
                    id: student.id,
                    firstname: student.firstname,
                    lastname: student.lastname,
                    present: student.present ? student.present : false,
                    late: student.late ? student.late : false,
                    ...(student.late && {lateDuration: student.lateDuration})
                }
            })
        }
        setIsLoading(true);

        try {
            const response = await axios.post(urlApi + 'attendance', myData, config)
            if (response.status === 200) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                toastSuccess(response.data.message);
                getHistory();
            }
        } catch (error: any) {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            toastError(error.response.data.message);
        }
    };

    /**
     * updateAttendance update the attendance of the students in the database when the user click on the button "Enregistrer"
     */
    const updateAttendance = async () => {

        if (selectedHistory.length === 0) {
            toastError('Aucune donnée est présente');
            return;
        }

        const myData = {
            attendance: selectedHistory.map(student => {
                return {
                    id: student.id,
                    present: student.present ? student.present : false,
                    late: student.late ? student.late : false,
                    ...(student.late && {lateDuration: student.lateDuration})
                }
            })
        }
        setIsLoading(true);

        try {
            const response = await axios.put(urlApi + 'attendance/' + selectedHistoryId, myData, config)
            if (response.status === 200) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                toastSuccess(response.data.message);
                getHistory();
            }
        } catch (error: any) {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            toastError(error.response.data.message);
        }
    };

    /**
     * classSelection is a function that is called when the user select a classroom in the select.
     * It will update the state of the selectedClassroomId and call the function getStudentByClass to get all the students of the selected classroom.
     * @param event
     */
    const classSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedClassroom = classrooms.find((classroom) => classroom.id.toString() === selectedValue);
        const selectedClassroomId = selectedClassroom ? selectedClassroom.id : null;
        if (selectedClassroomId !== null) {
            setSelectedClassroomId(parseInt(selectedClassroomId));
            getStudentByClass(selectedClassroomId);
        } else {
        }
        setSelectedHistoryId(null);
    }

    /**
     * historySelection is a function that is called when the user select a history in the select.
     * It will update the state of the selectedHistoryId and call the function getStudentByHistory to get all the students of the selected history.
     * @param event
     */
    const historySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedHistoryId = parseInt(selectedValue); // convertir en nombre entier
        if (selectedHistoryId !== null) {
            setSelectedHistoryId(selectedHistoryId);
            getStudentByHistory(selectedHistoryId);
        }
        setSelectedHistoryId(selectedHistoryId);
        setSelectedClassroomId(null);

    };

    /**
     * togglePresence is a function that is called when the user click on the checkbox of a student.
     * It will update the state of the selectedStudents or selectedHistory depending on the value of the history state.
     * @param index
     * @param selectedData
     */
    const togglePresence = (index: number, selectedData: any[]) => {
        const updatedData = selectedData.map((student, i) => {
            if (i === index) {
                return {
                    ...student,
                    present: !student.present
                };
            }
            return student;
        });

        if (selectedData === selectedStudents) {
            setSelectedStudents(updatedData);
        } else if (selectedData === selectedHistory) {
            setSelectedHistory(updatedData);
        }
    };

    /**
     * toggleLate is a function that is called when the user click on the checkbox of a student.
     * It will update the state of the selectedStudents or selectedHistory depending on the value of the history state.
     * It will also update the state of the isLateEnabled and lateDuration.
     * @param index
     */
    const toggleLate = (index: number) => {
        setSelectedStudents(prevState => prevState.map((student, i) => {
            if (i === index) {
                return {
                    ...student,
                    late: !student.late,
                    lateDuration: 0
                };
            }
            return student;
        }));

        setSelectedHistory(prevState => prevState.map((history, i) => {
            if (i === index) {
                return {
                    ...history,
                    late: !history.late,
                    lateDuration: 0
                };
            }
            return history;
        }));

        setIsLateEnabled(prevState => {
            const newState = [...prevState];
            newState[index] = !prevState[index];
            return newState;
        });
        setLateDuration(0);
    };

    /**
     * lateDurationChange is a function that is called when the user change the value of the input of a student.
     * It will update the state of the selectedStudents or selectedHistory depending on the value of the history state.
     * It will also update the state of the lateDuration.
     * @param index
     * @param duration
     */
    const lateDurationChange = (index: number, duration: string | number) => {
        const parsedDuration = parseInt(duration.toString());
        setSelectedStudents(prevState => prevState.map((student, i) => {
            if (i === index) {
                return {
                    ...student,
                    lateDuration: isNaN(parsedDuration) ? 0 : parsedDuration
                };
            }
            return student;
        }));
        setSelectedHistory(prevState => prevState.map((student, i) => {
            if (i === index) {
                return {
                    ...student,
                    lateDuration: isNaN(parsedDuration) ? 0 : parsedDuration
                };
            }
            return student;
        }));
    };

    return (
        <div className="wrap">
            <SideBar/>
            <h1 className="text-center mt-0">Feuille d'appel</h1>
            <Form>
                <div className="row d-flex align-items-center">
                    <div className="col-md-5">
                        <Form.Group className="w-100">
                            <Form.Label htmlFor="Classe">Classe</Form.Label>
                            <Form.Select className="select-classroom" id="Classe" onChange={classSelection}
                                         value={selectedClassroomId ?? ''}>
                                <option value="" disabled>Choisissez une classe</option>
                                {classrooms && classrooms.map(classroom => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.ClassroomName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-5">
                        <Form.Group className="w-100">
                            <Form.Label>Historique</Form.Label>
                            <Form.Select className="select-history" onChange={historySelection}
                                         value={selectedHistoryId ?? ''}>
                                <option value="" disabled>Choisissez un appel</option>
                                {history && history.map((Attendance) => {
                                    const date = new Date(Attendance.call_date);
                                    const options: Intl.DateTimeFormatOptions = {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Europe/Paris'
                                    };
                                    const newDate = date.toLocaleString('fr-FR', options);
                                    const displayData = `Classe : ${Attendance.classroomName} le ${newDate}`;
                                    return (
                                        <option key={Attendance.id} value={Attendance.id}>
                                            {displayData}
                                        </option>
                                    );
                                })};
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-2 Custom-Component">
                        <OnlineUser classrooms={classrooms}/>
                        <HistoryUser classrooms={classrooms}/>
                    </div>
                </div>
            </Form>

            {/*     Tableau Appel      */}

            {selectedClassroomId && selectedStudents.length > 0 && (
                <Table itemID="StudentTable" responsive bordered variant="light" className="mx-auto Table rounded">
                    <thead>
                    <tr>
                        <th>Nom de l'étudiant</th>
                        <th>Prénom de l'étudiant</th>
                        <th>Présence</th>
                        <th>Retard</th>
                        <th>Durée du retard</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedStudents?.map((users, index) => (
                        <tr key={index}>
                            <td>{users.lastname}</td>
                            <td>{users.firstname}</td>
                            <td>
                                {users.present ? 'Présent' : 'Absent'}
                                <Button
                                    variant="link"
                                    onClick={() => togglePresence(index, selectedStudents)}
                                >
                                    Modifier
                                </Button>
                            </td>
                            <td>
                                <Form.Check
                                    type="switch"
                                    id={`late-switch-${index}`}
                                    label=""
                                    checked={history ? selectedHistory[index]?.late : selectedStudents[index]?.late}
                                    onChange={() => toggleLate(index)}
                                />

                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={selectedStudents[index].lateDuration || ''}
                                    placeholder="Entrez la durée du retard"
                                    onChange={(e) => lateDurationChange(index, parseInt(e.target.value))}
                                    disabled={!isLateEnabled[index]}
                                    min="1"
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <br/>
                    <Button
                        variant="success"
                        onClick={saveAttendance}
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
                </Table>
            )}

            {/*     Tableau historique      */}

            {selectedHistoryId && selectedHistory.length > 0 && (
                <div className="table-container">
                    <Table responsive bordered variant="light">
                        <thead>
                        <tr>
                            <th>Nom de l'étudiant</th>
                            <th>Prénom de l'étudiant</th>
                            <th>Présence</th>
                            <th>Retard</th>
                            <th>Durée du retard</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedHistory?.map((student, index) => (
                            <tr key={index}>
                                <td>{student.lastname}</td>
                                <td>{student.firstname}</td>
                                <td>
                                    {student.present ? 'Présent' : 'Absent'}
                                    <Button
                                        variant="link"
                                        onClick={() => togglePresence(index, selectedHistory)}
                                    >
                                        Modifier
                                    </Button>
                                </td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`late-switch-${index}`}
                                        label=""
                                        checked={student.late}
                                        onChange={() => toggleLate(index)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Entrez la durée du retard"
                                        value={selectedHistory[index]?.lateDuration || ''}
                                        onChange={(e) =>
                                            lateDurationChange(index, parseInt(e.target.value))
                                        }
                                        disabled={!selectedHistory[index].late}
                                        min="1"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <br/>
                        <Button
                            variant="success"
                            disabled={isLoading}
                            onClick={updateAttendance}
                        >
                            {isLoading ? (
                                <>
                                    Enregistrement en cours... <Spinner animation="border" size="sm"/>
                                </>
                            ) : (
                                'Mettre à jour'
                            )}
                        </Button>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default AttendanceSheet;
