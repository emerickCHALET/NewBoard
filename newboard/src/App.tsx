import React, {useEffect} from 'react';
import Footer from "./components/Footer";
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import InscriptionPage from "./pages/Inscription";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import Workspaces from "./pages/Workspaces";
import SideBar from "./components/SideBar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Board from "./pages/Board";
import Management from "./pages/Management";
import Chat from "./pages/Chat";
import Kanban from "./pages/Kanban";
import {useParams} from "react-router";
import AttendanceSheet from "./pages/Attendance";
import {toast} from "react-toastify";

const MainPage = () => {
    return (
        <div className="wrap">
            <SideBar/>
            <Home/>
            <Footer/>
        </div>

    );
}

export default function App() {

    useEffect(() => {
        const handleOnlineStatus = () => {
            const offlineMsg = () => (
                <div>
                    <p>Vous êtes hors ligne.</p>
                    <p>Les modifications apportées ne seront pas enregistrées.</p>
                </div>
            );
            const toastOptions = {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            };

            if (!navigator.onLine) {
                toast.warn(offlineMsg, toastOptions);
            } else {
                toast.success("Vous êtes de nouveau en ligne.", toastOptions);
            }
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="forgot" element={<ForgotPassword/>}/>
                <Route path="reset" element={<ResetPassword/>}/>
                <Route path="*" element={<ErrorPage/>}/>
                <Route path="inscription" element={<InscriptionPage/>}/>
                <Route path="workspaces" element={<Workspaces/>}/>
                <Route path="board" element={<Board/>}/>
                <Route path="board/:workspaceId" element={<Board/>}/>
                <Route path="kanban" element={<Kanban/>}/>
                <Route path="kanban/:boardId" element={<Kanban/>}/>
                <Route path="management" element={<Management/>}/>
                <Route path="chat" element={<Chat/>}/>
                <Route path="chat/:roomId" element={<Chat/>}/>
                <Route path="attendance" element={<AttendanceSheet/>}/>
            </Routes>
        </BrowserRouter>
    );
}
/**
 * url of the Production environment
 */
export const urlApi = "https://api.newboard.fr/api/";
export const urlApiSocket = "https://api.newboard.fr";

/**
 * url of the Development environment
 */
//export const urlApi = "http://localhost:3001/api/"
//export const urlApiSocket = "http://localhost:3001";
