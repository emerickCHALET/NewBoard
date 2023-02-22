import React, {useEffect, useState} from 'react';
import {Form, Table, Button} from 'react-bootstrap';
import SideBar from '../components/SideBar';
import {urlLocal} from "../App";
import axios from "axios";
import {toast} from "react-toastify";

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
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classrooms, setClassrooms] = useState<Classrooms[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const getClassrooms = () => {
        axios.get(urlLocal + 'classrooms')
            .then((response) => {
                if (response.status === 200) {
                    setClassrooms(response.data.data)
                }
            })
            .catch(function (error) {
                if (error.response) {
                    toast.error(error.response.data.message.name + ". \nReconnexion requise", {
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
                    toast.error("Erreur axios", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
    }

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
                    <Button variant="light" onClick={() => console.log(selectedClassId + selectedStudents)}>
                        Sauvegarder
                    </Button>
                </Table>
            )}
        </div>
    );
};

export default AttendanceSheet;
