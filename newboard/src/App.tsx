import React from 'react';
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import InscriptionPage from "./pages/Inscription";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import WorkspacesPage from "./pages/WorkspacesPage";
import SideBar from "./components/SideBar";
import BoardPage from "./pages/BoardPage";
import Management from "./pages/Management";
import Kanban from "./pages/Kanban";



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
            <Route path="*" element={<ErrorPage/>}/>
            <Route path="inscription" element={<InscriptionPage/>}/>
            <Route path="workspaces" element={<WorkspacesPage/>}/>
            <Route path="board" element={<BoardPage/>}/>
            <Route path="kanban" element={<Kanban/>}/>
            <Route path="management" element={<Management/>}/>
        </Routes>
        </BrowserRouter>
    );
}
/**
 * url of the Production environment
 */
export const urlApi = "http://newboardapifr.swks7487.odns.fr/api/";
