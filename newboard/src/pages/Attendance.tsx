import React, {useEffect, useState} from 'react';
import {Form, Table, Button} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import {urlLocal} from "../App";
import axios from "axios";
import {toast} from "react-toastify";
import useProtectedPO from "../components/ProtectedPO";

interface Student {
    firstname: string;
    lastname: string;
    present: boolean;
}

interface Classrooms {
    id: string;
    users: Student[];
    ClassroomName: string;
}

const AttendanceSheet: React.FC = () => {
    const { loading } = useProtectedPO()
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classrooms, setClassrooms] = useState<Classrooms[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getClassrooms = () => {
        axios.get(urlLocal + 'classrooms')
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
                }
            })
    }

    useEffect(() => {
        getClassrooms();
    }, []);

    const getStudentByClass = () => {
        const id = {
            params: {
                classroomsId: selectedClassId
            }
        }
        axios.get(urlLocal + 'usersByClassroom', id)
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
                }
            })
    }

    const saveAttendance = () => {
        const myData = {
            classroomId: selectedClassId,
            attendance: selectedStudents.map(student => {
                return {
                    firstname: student.firstname,
                    lastname: student.lastname,
                    present: student.present
                }
            })
        }
        setIsLoading(true);
        console.log(myData);
        axios.post(urlLocal + 'attendance', myData)
            .then((response) => {
                setIsLoading(false);
                toast.success("Appel enregistré !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Erreur lors de l'enregistrement !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
    };

    const handleClassSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(event.target.value);
        getStudentByClass();
    };

    const handleToggleAttendance = (index: number) => {
        setSelectedStudents(selectedStudents.map((users, i) => {
            if (i === index) {
                return {
                    ...users,
                    present: !users.present
                };
            }
            return users;
        }));
    };

    if (loading){
    }

    return (
        <div className="wrap">
            <SideBar/>
            <h1 className="text-center my-5">Feuille d'appel</h1>
            <Form>
                <Form.Group>
                    <Form.Label>Classe</Form.Label>
                    <Form.Select onChange={handleClassSelection}>
                        <option>Choisissez une classe</option>
                        {classrooms.map(classroom => (
                            <option key={classroom.id} value={classroom.id}>
                                {classroom.ClassroomName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>
            {selectedClassId && (
                <Table responsive bordered variant="light">
                    <thead>
                    <tr>
                        <th>Nom de l'étudiant</th>
                        <th>Prénom de l'étudiant</th>
                        <th>Présent/Absent</th>
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
                                    onClick={() => handleToggleAttendance(index)}
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
        </div>
    );
};

export default AttendanceSheet;
