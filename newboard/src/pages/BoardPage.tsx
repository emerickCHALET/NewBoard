import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import {useLocation, useNavigate} from "react-router";
import Student from "../Classes/Student";
import Classroom from "../Classes/Classroom";
import axios from "axios";
import {urlApi} from "../App";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import Board from "../Classes/Board";





const config = {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
};

const student1 = new Student("Antoine", "Haller", "antoine-haller@outlook.fr");
const student2 = new Student("Emerick", "Chalet", "emerick.chalet@gmail.com");

const studentArray = new Array<Student>();

studentArray.push(student1, student2);

const classroom = new Classroom("M1 Lead dev", studentArray);

const classroomArray = new Array<Classroom>();
classroomArray.push(classroom);




const BoardPage = () => {

    const location = useLocation();

//get workspace name from previous page
    let workspaceName = location.state.workspaceName;

//we get the classroom selected in the form from workspacePage, must be replaced by classroom assigned to workspace
    let classroomName = location.state.classroomName;
    let workspaceId = location.state.workspaceId;

    async function postBoard(values: { name: string; }): Promise<boolean> {
        // voir pour récupérer l'id d'user
        let payload = {name: values.name, workspaceID: workspaceId};
        let result = false;
        await axios
            .post(urlApi + 'boards',payload, config)
            .then((response) => {
                if(response.status === 200){
                    let payload2 = { userID: localStorage.getItem('userId'), boardID: response.data.data.id};
                    axios
                        .post(urlApi + 'boardUsers', payload2, config)
                        .then((response) => {
                            if(response.status === 200) {
                                toast.success("Board crée avec succès !", {
                                    position: toast.POSITION.TOP_RIGHT,
                                });
                                result = true
                            }
                        })
                }
            })
            .catch(function (error) {
                if(error.response) {
                    toast.error(error.response.data.message,{
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
        return result;
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [value, setValue] = useState("default");

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const handleSubmit = async (values: { name: string; }) => {
        const result = await postBoard(values);
        if (result) {
            handleClose()
            window.location.reload()
        }
    };

    const initialValues = {
        name: "",
        classroom: "selection"
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Trop petit")
            .max(25, "Trop long!")
            .required("Ce champ est obligatoire"),

    });

    const [boards, setBoards] = useState<Board[]>([])

    const fetchData = () => {
        axios
            .get(urlApi + "boardByWorkspaceId/" + workspaceId, config)
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Boards récupérés", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setBoards(response.data.data)
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
        fetchData()
    }, [])

    const navigate = useNavigate();

    return (

        <div className="wrap">
            <SideBar/>

            {/* à voir pour sortir le modal de ce fichier et en faire un component */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un tableau</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        <Form>
                            <fieldset className={"field-area"}>
                                <label htmlFor="name">Name:</label>
                                <Field name="name" className="form-control" type="text"/>
                                <ErrorMessage
                                    name="name"
                                    component="small"
                                    className="text-danger"
                                />
                            </fieldset>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Fermer
                                </Button>
                                <Button variant="primary" type={"submit"}>
                                    Créer
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Formik>
                </Modal.Body>

            </Modal>
            <h2>Tableaux {workspaceId}</h2>
            <div className={"workspace-container"}>
                <div className={"workspace-list"}>
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */}
                    <Button className={"workspace-item workspace-item-add"} variant="primary" onClick={() => {
                        handleShow()
                    }}>
                        +
                    </Button>
                    {boards.map((board) => {
                        return <div key={board.name.toString()} className={"workspace-item"} onClick={() => {

                        }}> {board.name} </div>;
                    })}
                </div>
            </div>
            <Footer/>
        </div>
    )


}

export default BoardPage;