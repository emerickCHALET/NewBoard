import React, {useEffect, useState} from 'react';
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import { DragDropContext } from 'react-beautiful-dnd';


const Kanban = () => {

    return (

        <div className="wrap">
            <SideBar/>

            <Footer/>
        </div>
    )

}

export default Kanban
