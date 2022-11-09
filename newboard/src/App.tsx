import React from 'react';
import NavbarHome from "./components/NavbarHome";
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import InscriptionPage from "./pages/Inscription";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import Workspaces from "./pages/Workspaces";

const MainPage = () => {
  return (
      <div className="wrap">
          <NavbarHome/>
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
            <Route path="workspaces" element={<Workspaces/>}/>
        </Routes>
        </BrowserRouter>
    );
}
