import React, { useState, useEffect } from 'react';
import SockJsClient from './SockJsClient';
import { v4 as uuidv4 } from 'uuid';
import { Navigate } from 'react-router-dom';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/connection"
const CONN_SEND_TOPIC = "/app/connection"

export default function Connect() {

    const url = new URL(window.location.href);
    const user = {
        id : uuidv4(),
        name: url.searchParams.get('name')
    }

    let clientRef = null;

    const [redirect, setRedirect] = useState(false);
    const [waitingPlayers, setWaitingPlayers] = useState([user]);

    const onPlayersReceive = (players) => setWaitingPlayers(players)
    
    const playerBroadcast = () => clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user))
    
    const onConnection = () => playerBroadcast()
    
    const onDisconnect = () => console.log("Disconnected")

    useEffect(()=>{
        if(waitingPlayers.length > 4) setRedirect(true)
    })


    return (
        <div className="tableContainer">
            { 
                redirect ? (<Navigate push to={{pathname: `/game`,}}/>) : null 
            }
            <table className='table table-dark table-hover'>
                <thead>
                    <tr>
                        <th scope='col'>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {waitingPlayers.map(player => 
                        <tr key={player.id}>
                            <td style={{"padding":" 20px 80px"}}>{ player.name }</td>
                        </tr>
                    )}                    
                </tbody>
                <tfoot/>
            </table>

            <SockJsClient
                url={SOCKET_URL}
                topics={[CONN_RECV_TOPIC]}
                onMessage={onPlayersReceive} 
                onConnect={onConnection}
                onDisconnect={onDisconnect}
                ref={ (client) => { clientRef = client }} 
            />
        </div>
    )

}