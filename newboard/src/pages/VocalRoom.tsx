import SideBar from "../components/SideBar";
import Messages from "../classes/Messages";
import Footer from "../components/Footer";
import React, {useCallback, useEffect, useState} from "react";
import { Peer } from "peerjs";
import {useParams} from "react-router";
import {urlApi, urlApiSocket} from "../App";
import {Stream} from "stream";
import * as io from "socket.io-client";
import PeerProvider, {usePeer} from "../components/Peer";


const VocalRoom = () => {
    let myUserId = localStorage.getItem("userId")

    let socket = io.connect(urlApiSocket);
    const {roomId} = useParams<{ roomId: string}>()
    const videoGrid = document.getElementById('video-grid');
    // @ts-ignore
    const { peer, createOffer} = usePeer()

    const handleNewUserJoined = useCallback(async (data: { userId: string; }) => {
        const {userId} = data
        const offer = await createOffer()
        socket.emit('call-user', { userId, offer })
    }, [createOffer, socket])

    const handleIncomingCall = useCallback((data: { from: any; offer: any; }) => {
        const {from, offer} = data
        console.log(`incoming call from ${from}, ${offer}`)
    }, [])


    useEffect(() => {
        socket.on("user-connected", handleNewUserJoined)
        socket.on('incoming-call', handleIncomingCall)
    }, [handleNewUserJoined, socket])

    useEffect(() => {
        const myVideo = document.createElement('video')
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {

            myVideo.srcObject = stream
            socket.emit('join_room', roomId, myUserId)
            if(videoGrid !== null){
                videoGrid.append(myVideo)
            }

        })
    }, [])



    return (

        <div className="wrap">
            <SideBar/>
            <PeerProvider>
            <div id={"video-grid"}></div>
            </PeerProvider>
            <Footer/>
        </div>

    );
}

export default VocalRoom