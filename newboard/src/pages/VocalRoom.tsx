import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { Peer } from "peerjs";
import {useParams} from "react-router";
import {urlApi, urlApiSocket} from "../App";
import * as io from "socket.io-client";
import PeerProvider from "../components/Peer";
import user from "../components/connectedUsers/User";


const VocalRoom = () => {
    let myUserId = localStorage.getItem("userId")
    const peers = {}
    // @ts-ignore
    const peer = new Peer( undefined, {
        host: '/',
        port: 9000
    })
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        setToken(tokenFromStorage);
    }, []);


    let socket = io.connect(urlApiSocket);
    const {roomId} = useParams<{ roomId: string}>()
    const videoGrid = document.getElementById('video-grid');
    const myVideo = document.createElement('video')
    const [me, setMe] = useState<Peer>()
    const [stream, setStream] = useState<MediaStream>()
    myVideo.muted = true

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        //setStream(stream)
        addVideoStream(myVideo, stream)
        peer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })
    })

    /*useEffect(() => {
        if(!me) return;
        if(!stream) return;


    }, [me ,stream])*/

    socket.on('user_disconnected', userId => {
        console.log('disconnected')
        // @ts-ignore
        if(peers[userId]) peers[userId].close()
    })

    peer.on('open', id => {
        socket.emit('join_room', roomId, id)
    })
    // @ts-ignore
    function connectToNewUser(userId, stream) {
        console.log("user " + userId + " connected")
        const call = peer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        // @ts-ignore
        peers[userId] = call
    }

    // @ts-ignore
    function addVideoStream(video, stream) {
        console.log("addVideoStream")
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid!.append(video)
    }

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (

        <div className="wrap">
            <SideBar/>
            <PeerProvider>
                <div id={"video-grid"}>
                </div>
            </PeerProvider>
            <Footer/>
        </div>

    );
}

export default VocalRoom

/*const VocalRoom: React.FC = () => {
    const [roomId, setRoomId] = useState('');
    const [peer, setPeer] = useState<Peer | null>(null);
    const [socket, setSocket] = useState<io.Socket | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Création d'une instance Peer
        const peerInstance = new Peer();
        setPeer(peerInstance);

        // Connexion au serveur PeerJS
        peerInstance.on('open', (id) => {
            console.log('Connected with ID:', id);
            // Envoi de l'ID au serveur pour rejoindre la salle de chat
            socket?.emit('joinRoom', roomId, id);
        });

        // Gestion de l'appel entrant
        peerInstance.on('call', (call) => {
            // Répondre à l'appel et afficher la vidéo
            call.answer();
            call.on('stream', (remoteStream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = remoteStream;
                }
            });
        });

        // Nettoyage
        return () => {
            peerInstance.destroy();
        };
    }, [roomId, socket]);

    useEffect(() => {
        // Connexion au serveur Socket.IO
        //const socketInstance = io('http://localhost:3000');
        let socketInstance = io.connect(urlApiSocket);
        setSocket(socketInstance);

        // Écoute des événements du serveur
        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        // Nettoyage
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const handleJoinRoom = () => {
        // Demande de rejoindre une salle de chat
        if (socket) {
            socket.emit('joinRoom', roomId, peer?.id);
        }
    };

    return (
        <div>
            <h1>Chat vocal et vidéo de groupe</h1>
            <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
            />
            <button onClick={handleJoinRoom}>Rejoindre</button>
            <video ref={videoRef} autoPlay />
        </div>
    );
};

export default VocalRoom;*/
