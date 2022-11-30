import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import SockJsClient from '../../services/SockJsClient'
import PlayersTable from '../../components/PlayersTable/PlayersTable.component'
import { SOCKET_URL, CONN_RECV_TOPIC, CONN_SEND_TOPIC, 
    DISCONN_SEND_TOPIC, PLAYER_CONNECTION, PLAYER_DISCONNECTION } from '../../data/SocketData'

export default function Connect() {

    const url = new URL(window.location.href)

    let clientRef = null
    const navigate = useNavigate()

    const [user, setUser] = useState({
        id: null,
        name: url.searchParams.get('name')
    })
    const [players, setPlayers] = useState([user])

    const [sessionId, setSessionId] = useState('')

    const onMessage = (data) => {
        switch(data.type) {
            case PLAYER_CONNECTION:
                onPlayersConnect(data)
                break
            case PLAYER_DISCONNECTION:
                onPlayersDisconnect(data)
                break
            default: break
        }
    }

    const onPlayersConnect = (data) => {
        // console.log(players)
        setSessionId(data.id)
        setPlayers(data.users)
        if(user.id == null) setUser(data.users.at(-1))
    }

    const onPlayersDisconnect = (data) => {
        setPlayers(data.users)
    }
    
    const playerBroadcast = () => clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user))
    
    const onConnection = () => playerBroadcast()
    
    const onDisconnect = () => removePlayer()

    const removePlayer = () => {
        let data = {
            id: sessionId,
            users: [
                user,
            ]
        }
        clientRef.sendMessage(DISCONN_SEND_TOPIC, JSON.stringify(data))
    }

    const startGame = () => {
        navigate("/game", {
            state: {
                user,
                players
            }
        })
    }

    useEffect(()=>{
        // TODO: This 2 should be set by the BE
        if(players.length >= 2) startGame()
    })


    return (
        <div className="tableContainer">
            <PlayersTable players={players}/>
            <SockJsClient
                url={SOCKET_URL}
                topics={[CONN_RECV_TOPIC]}
                onMessage={onMessage} 
                onConnect={onConnection}
                onDisconnect={onDisconnect}
                ref={ (client) => { clientRef = client }} 
            />
        </div>
    )
}