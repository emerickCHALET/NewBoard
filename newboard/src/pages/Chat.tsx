import React, {useEffect, useRef} from 'react';
import * as io from "socket.io-client";


function Client() {
    const [connected, SetConnected]
        const socketClient = useRef<SocketIOClient.Socket>()

        useEffect(() => {
            socketClient.current = io.connect("http://localhost:5000");


        if(socketClient.current){

        }
    },[])

    return(
        <div className="client">
            </div>

    );
}

export default Client;
