import React, {useEffect} from 'react';
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import InscriptionPage from "./pages/Inscription";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import WorkspacesPage from "./pages/WorkspacesPage";
import SideBar from "./components/SideBar";
import Forgot from "./pages/Forgot";
import ResetPassword from "./pages/ResetPassword";
import BoardPage from "./pages/BoardPage";
import Management from "./pages/Management";
import Kanban from "./pages/Kanban";
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
                <Route path="forgot" element={<Forgot/>}/>
                <Route path="reset" element={<ResetPassword/>}/>
                <Route path="*" element={<ErrorPage/>}/>
                <Route path="inscription" element={<InscriptionPage/>}/>
                <Route path="workspaces" element={<WorkspacesPage/>}/>
                <Route path="board" element={<BoardPage/>}/>
                <Route path="kanban" element={<Kanban/>}/>
                <Route path="management" element={<Management/>}/>
                <Route path="attendance" element={<AttendanceSheet/>}/>
            </Routes>
        </BrowserRouter>
    );
}
/**
 * url of the Production environment
 */
export const urlApi = "http://newboardapifr.swks7487.odns.fr/api/";
export const urlLocal = "http://localhost:3001/api/"
