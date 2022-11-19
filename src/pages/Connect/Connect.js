import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import SockJsClient from '../../services/SockJsClient'
import PlayersTable from '../../components/PlayersTable/PlayersTable.component'
import { SOCKET_URL, CONN_RECV_TOPIC, CONN_SEND_TOPIC } from '../../data/SocketData'

export default function Connect() {

    const url = new URL(window.location.href)

    let clientRef = null
    const navigate = useNavigate()

    const [user, setUser] = useState({
        id: null,
        name: url.searchParams.get('name')
    })
    const [players, setPlayers] = useState([user])

    const onPlayersReceive = (players) => {
        setPlayers(players)
        if(user.id == null) setUser(players.at(-1))
    }
    
    const playerBroadcast = () => clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user))
    
    const onConnection = () => playerBroadcast()
    
    const onDisconnect = () => {}

    const startGame = () => {
        navigate("/game", {
            state: {
                user,
                players
            }
        })
    }

    useEffect(()=>{
        if(players.length >= 2) startGame()
    })


    return (
        <div className="tableContainer">
            <PlayersTable players={players}/>
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