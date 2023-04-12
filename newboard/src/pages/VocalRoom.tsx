import SideBar from "../components/SideBar";
import Messages from "../classes/Messages";
import Footer from "../components/Footer";
import React, {useCallback, useEffect, useState} from "react";
import { Peer } from "peerjs";
import {useParams} from "react-router";
import {urlApi, urlApiSocket} from "../App";
import {Stream} from "stream";
import * as io from "socket.io-client";
import PeerProvider from "../components/Peer";


const VocalRoom = () => {
    let myUserId = localStorage.getItem("userId")

    let socket = io.connect(urlApiSocket);
    const {roomId} = useParams<{ roomId: string}>()
    const videoGrid = document.getElementById('video-grid');

    async function playVideoFromCamera() {
        try {
            const constraints = {'video': true, 'audio': true};
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            // @ts-ignore
            const videoElement: HTMLVideoElement = document.querySelector('video#localVideo');
            if(videoElement !== null){
                videoElement.srcObject = stream;
                console.log(videoElement.srcObject)
                videoElement.muted = true
            }

        } catch(error) {
            console.error('Error opening video camera.', error);
        }
    }

    useEffect(() => {
        playVideoFromCamera()
    }, [])

    return (

        <div className="wrap">
            <SideBar/>
            <PeerProvider>
                <div id={"video-grid"}>
                    <video id={"localVideo"} autoPlay={true} playsInline={true} controls={false} />
                </div>
            </PeerProvider>
            <Footer/>
        </div>

    );
}

export default VocalRoom