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
    let myStream: MediaStream
    const peer = new Peer( {
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
    myVideo.muted = true




    async function playVideoFromCamera() {
        try {
            const constraints = {'video': true, 'audio': true};
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            myVideo.srcObject = stream;
            addVideoStream(myVideo, stream)
            myStream = stream
        } catch(error) {
            console.error('Error opening video camera.', error);
        }
    }


    useEffect(() => {
        peer.on('open', id=>{
            socket.emit('join_room', roomId, id)
            console.log(roomId)
        })

        peer.on('call', call => {
            call.answer(myStream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId =>{
            connectToNewUser(userId, myStream)
            console.log("connected")
        })

        playVideoFromCamera().then(r => {
            console.log(r)
        })
    }, [])

    useEffect(() => {
        socket.on('user_disconnected', userId => {
            console.log('disconnected')
            console.log(userId)
        })
    }, [socket])



    function connectToNewUser(userId: string, stream: MediaStream){
        console.log(stream)
        const call = peer.call(userId, stream)
        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () =>{
            video.remove()
        })
    }

    function addVideoStream(video: HTMLVideoElement, stream: MediaStream){
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