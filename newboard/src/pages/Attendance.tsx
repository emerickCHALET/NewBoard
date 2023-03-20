import React, {useEffect, useState} from 'react';
import {Form, Table, Button} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import {urlApi} from "../App";
import axios from "axios";
import {toast} from "react-toastify";
import useProtectedPO from "../components/ProtectedPO";
import {useNavigate} from "react-router";

interface Student {
    id: number;
    firstname: string;
    lastname: string;
    present: boolean;
}

interface Classrooms {
    id: string;
    users: Student[];
    ClassroomName: string;
}

interface Attendance {
    id: string;
    classroomsId: string;
    call_date: string;
    present: boolean;
    students: Student[];

}

const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

/**
 * AttendanceSheet is the page where the PO can see the attendance of a classroom
 */
const AttendanceSheet: React.FC = () => {
    const navigate = useNavigate();
    const {loading} = useProtectedPO()
    const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
    const [selectedHistory, setSelectedHistory] = useState<string>('');
    const [classrooms, setClassrooms] = useState<Classrooms[]>([]);
    const [history, setHistory] = useState<Attendance[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * getClassrooms get all the classrooms when the page is loaded
     */
    const getClassrooms = () => {
        axios.get(urlApi + 'classrooms', config)
            .then((response) => {
                if (response.status === 200) {
                    setClassrooms(response.data.data)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nErreur Classroom", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if (error.response.data.disconnect === true) {
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })
    }

    /**
     * getHistory get all attendance history of a class when getClassroom is called
     * @param classroomId
     */
    const getHistory = () => {
        axios.get(urlApi + 'attendanceHistory', config)
            .then((response) => {
                if (response.status === 200) {
                    setHistory(response.data.data)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nErreur History", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if (error.response.data.disconnect === true) {
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })

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
    const getStudentByClass = (classroomId: string) => {
        axios.get(urlApi + 'usersByClassroom/' + classroomId, config)
            .then((response) => {
                if (response.status === 200) {
                    setSelectedStudents(response.data.data)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error("Erreur Student", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    if (error.response.data.disconnect === true) {
                        localStorage.clear()
                        navigate('/login');
                    }
                }
            })
    }

    /**
     * saveAttendance save the attendance of the students in the database when the user click on the button "Enregistrer"
     */
    const saveAttendance = () => {

        if (selectedStudents.length === 0) {
            toast.error('Aucune donnée est présente', {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        /**
         * myData is the data that will be sent to the API
         * @type {{classroomId: number | null, attendance: {id: number, firstname: string, lastname: string, present: boolean}[]}}
         */
        const myData = {
            classroomId: selectedClassroomId,
            attendance: selectedStudents.map(student => {
                return {
                    id: student.id,
                    firstname: student.firstname,
                    lastname: student.lastname,
                    present: student.present ? student.present : false
                }
            })
        }
        setIsLoading(true);
        axios.post(urlApi + 'attendance', myData, config)
            .then((response) => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
                getHistory();
            })
            .catch((error) => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                toast.error(error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
                if (error.response.data.disconnect === true) {
                    localStorage.clear()
                    navigate('/login');
                }
            });
    };

    /**
     * handleClassSelection is a function that is called when the user select a classroom in the select.
     * It will update the state of the selectedClassroomId and call the function getStudentByClass to get all the students of the selected classroom.
     * @param event
     */
    const handleClassSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedClassroom = classrooms.find((classroom) => classroom.id.toString() === selectedValue);
        const selectedClassroomId = selectedClassroom ? selectedClassroom.id : null;
        if (selectedClassroomId !== null) {
            setSelectedClassroomId(parseInt(selectedClassroomId));
            getStudentByClass(selectedClassroomId);
        } else {
            console.log("Aucune classe trouvé depuis selectedValue: ", selectedValue);
        }
        setSelectedHistory('');
    }

    /**
     * handleHistorySelection is a function that is called when the user select a history in the select.
     * @param event
     */
    const handleHistorySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedHistory(event.target.value);
        setSelectedClassroomId(null);
    }

    /**
     * handleTogglePresence is a function that is called when the user click on the button "Présent" or "Absent" of a student.
     * It will update the state of the selectedStudents.
     * @param index
     */
    const handleTogglePresence = (index: number) => {
        setSelectedStudents(prevState => prevState.map((student, i) => {
            if (i === index) {
                return {
                    ...student,
                    present: !student.present
                };
            }
            return student;
        }));
    };

    if (loading) {
    }

    return (
        <div className="wrap">
            <SideBar/>
            <h1 className="text-center my-5">Feuille d'appel</h1>
            <Form>
                <div className="row">
                    <div className="col">
                        <Form.Group>
                            <Form.Label>Classe</Form.Label>
                            <Form.Select onChange={handleClassSelection} defaultValue="">
                                <option value="" disabled>Choisissez une classe</option>
                                {classrooms.map(classroom => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.ClassroomName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col">
                        <Form.Group>
                            <Form.Label>Historique</Form.Label>
                            <Form.Select onChange={handleHistorySelection} value={selectedHistory} defaultValue="">
                                <option value="" disabled>Choisissez un appel</option>
                                {history && history.map((attendance) => {
                                    const date = new Date(attendance.call_date);
                                    const options: Intl.DateTimeFormatOptions = {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Europe/Paris'
                                    };
                                    const newDate = date.toLocaleString('fr-FR', options);
                                    const displayData = `Classe : ${attendance.classroomsId} le ${newDate}`;
                                    return (
                                        <option key={attendance.call_date} value={attendance.call_date}>
                                            {displayData}
                                        </option>
                                    );
                                })};
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>
            </Form>
            {selectedClassroomId && (
                <Table responsive bordered variant="light">
                    <thead>
                    <tr>
                        <th>Nom de l'étudiant</th>
                        <th>Prénom de l'étudiant</th>
                        <th>Présent / Absent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedStudents.map((users, index) => (
                        <tr key={index}>
                            <td>{users.lastname}</td>
                            <td>{users.firstname}</td>
                            <td>
                                {users.present ? 'Présent' : 'Absent'}
                                <Button
                                    variant="link"
                                    onClick={() => handleTogglePresence(index)}
                                >
                                    Modifier
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <br/>
                    <Button
                        variant="light"
                        onClick={saveAttendance}
                        disabled={isLoading}
                    >
                        {isLoading ? "Enregistrement en cours..." : "Sauvegarder"}
                    </Button>

                </Table>
            )}

            {/*    Tableau historique*/}

            {selectedHistory && (
                <Table responsive bordered variant="light">
                    <thead>
                    <tr>
                        <th>Nom de l'étudiant</th>
                        <th>Prénom de l'étudiant</th>
                        <th>Présent / Absent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedStudents.map((users, index) => (
                        <tr key={index}>
                            <td>{users.lastname}</td>
                            <td>{users.firstname}</td>
                            <td>
                                {users.present ? 'Présent' : 'Absent'}
                                <Button
                                    variant="link"
                                    onClick={() => handleTogglePresence(index)}
                                >
                                    Modifier
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <br/>
                    <Button
                        variant="light"
                        disabled={isLoading}
                    >
                        {isLoading ? "Enregistrement en cours..." : "Mettre à jour"}
                    </Button>

                </Table>
            )}
        </div>
    );
};

export default AttendanceSheet;
