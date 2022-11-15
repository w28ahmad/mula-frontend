import React, { useState, useEffect } from 'react';
import SockJsClient from './SockJsClient';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/connection"
const CONN_SEND_TOPIC = "/app/connection"

export default function Connect(props) {

    const url = new URL(window.location.href);

    let clientRef = null;
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: null,
        name: url.searchParams.get('name')
    })
    const [players, setPlayers] = useState([user]);

    const onPlayersReceive = (players) => {
        setPlayers(players)
        if(user.id == null) setUser(players.at(-1))
    }
    
    const playerBroadcast = () => clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user))
    
    const onConnection = () => playerBroadcast()
    
    const onDisconnect = () => console.log("Disconnected")

    const startGame = () => {
        navigate("/game", {
            state: {
                user,
                players
            }
        });
    };

    useEffect(()=>{
        if(players.length >= 2) startGame()
    })


    return (
        <div className="tableContainer">
            <table className='table table-dark table-hover'>
                <thead>
                    <tr>
                        <th scope='col'>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => 
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