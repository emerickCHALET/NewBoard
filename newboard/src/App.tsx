import React from 'react';
import NavbarHome from "./components/NavbarHome";
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import HomePage from "./pages/Home";
import InscriptionPage from "./pages/Insciption";
import ErrorPage from "./pages/Error";

const MainPage = () => {
  return (
      <div className="Main">
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
            <Route path="home" element={<HomePage/>}/>
            <Route path="*" element={<ErrorPage/>}/>
            <Route path="inscription" element={<InscriptionPage/>}/>
        </Routes>
        </BrowserRouter>
    );
}
