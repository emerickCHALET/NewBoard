import React from 'react';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import '../index.css';
import Workspace from "../Classes/Workspace";

const myWorkspace = new Workspace("PHP");
const myWorkspace2 = new Workspace("JavaScript");
const myWorkspace3 = new Workspace("Flutter");
const myWorkspace4 = new Workspace("React Native");
const myWorkspace5 = new Workspace("iOS");

let list: Array<Workspace> = [myWorkspace, myWorkspace2, myWorkspace3, myWorkspace4, myWorkspace5];

console.log(list)
const WorkspacesPage = () => {


    return (
        <div className="wrap">
            <NavbarHome/>
                <h2>Workspaces</h2>
                    <div className={"workspace-list"}>
                        {list.map((workspace) => { return <div key={workspace.name.toString()} className={"workspace-item"}> {workspace.name} </div>; })}
                    </div>
            <Footer/>
        </div>
    )
}

export default WorkspacesPage;
