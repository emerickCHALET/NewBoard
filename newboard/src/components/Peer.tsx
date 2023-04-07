import React, {useMemo} from 'react';


const PeerContext = React.createContext(null)
export const usePeer = () => React.useContext(PeerContext)
// @ts-ignore
const PeerProvider = (props) => {
    const peer = useMemo(() => new RTCPeerConnection({
        'iceServers': [
            {'urls': 'stun:stun.l.google.com:19302'}]
    }), [])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
    }
    return (
        // @ts-ignore
        <PeerContext.Provider value={{ peer, createOffer }}>{props.children}</PeerContext.Provider>
    )
}

export default PeerProvider;