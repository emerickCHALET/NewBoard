import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import React, {useCallback, useEffect, useState} from "react";
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
        setStream(stream)
        addVideoStream(myVideo, stream)
    })

    useEffect(() => {
        if(!me) return;
        if(!stream) return;

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
    }, [me ,stream])

    socket.on('user-disconnected', userId => {
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