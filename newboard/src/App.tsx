import React from 'react';
import NavbarHome from "./components/NavbarHome";
import Footer from "./components/Footer";
import Home from "./components/Home";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import SignInPage from "./pages/SignIn";

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
            <Route path="signin" element={<SignInPage/>}/>

        </Routes>
        </BrowserRouter>
    );
}
