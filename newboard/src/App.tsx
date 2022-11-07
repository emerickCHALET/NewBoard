import React from 'react';
import NavbarHome from "./components/NavbarHome";
import Footer from "./components/Footer";
import Home from "./components/Home";

function App() {
  return (
      <div className="App">
        <NavbarHome/>
          <Home/>
          <Footer/>
      </div>

  );
}

export default App;