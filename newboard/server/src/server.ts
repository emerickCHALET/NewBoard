import express from 'express';
import http from 'http'
import {Server} from 'socket.io';
import  {getUsers, userJoin, userLeft} from './util/user'


const app = express();

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "http://localhost:3000"}});
io.on("connection", socket => {
    socket.join("myChat");

socket.on("handle-connection",(username: string)=>{
        if(!userJoin(socket.id, username)){
            socket.emit("username-taken")
        }else{
            socket.emit("username-submitted-successfully");
            io.to("mychat").emit("get-connected-users", getUsers())
        }
    })
    socket.on("disconnect",() =>{
        userLeft(socket.id);
    })
})
server.listen(5000,()=>console.log("serveur a demarrer au port 5000 fdp "))



