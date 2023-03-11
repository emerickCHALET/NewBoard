import React from 'react';
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import InscriptionPage from "./pages/Inscription";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import WorkspacesPage from "./pages/WorkspacesPage";
import SideBar from "./components/SideBar";
import Forgot from "./pages/Forgot";
import ResetPassword from "./pages/ResetPassword";
import BoardPage from "./pages/BoardPage";
import Management from "./pages/Management";
import Chat from "./pages/Chat";
import Kanban from "./pages/Kanban";
import {useParams} from "react-router";

const MainPage = () => {
  return (
      <div className="wrap">
          <SideBar/>
          <Home/>
          <Footer/>
      </div>

  );
}

export default function App(){

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
            <Route path="board/:workspaceId" element={<BoardPage/>}/>
            <Route path="kanban" element={<Kanban/>}/>
            <Route path="kanban/:boardId" element={<Kanban/>}/>
            <Route path="management" element={<Management/>}/>
            <Route path="chat" element={<Chat/>}/>
        </Routes>
        </BrowserRouter>
    );
}
/**
 * url of the Production environment
 */
//export const urlApi = "http://newboardapifr.swks7487.odns.fr/api/";
//export const urlApiSocket = "http://newboardapifr.swks7487.odns.fr";

/**
 * url of the Development environment
 */
export const urlApi = "http://localhost:3001/api/"
export const urlApiSocket = "http://localhost:3001";
