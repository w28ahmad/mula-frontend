import React from 'react';
import SockJsClient from './SockJsClient';
import { v4 as uuidv4 } from 'uuid';
import { Navigate } from 'react-router-dom';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/connection"
const CONN_SEND_TOPIC = "/app/connection"


class Connect extends React.Component {
    constructor(props) {
        super(props)

        this.uid = uuidv4()
        const url = new URL(window.location.href)
        this.name = url.searchParams.get('name')

        this.state = {
            redirect: false,

            waitingPlayers: {
                [this.uid]: this.name
            },

            names: [
                [this.name, this.uid]
            ]
        }
    }

    onPlayersReceive = (players) => {
        players.forEach(player => {
            if(this.state.waitingPlayers[player.id]===undefined) {
                this.setState((state)=>{
                    state.waitingPlayers[player.id] = player.name
                    state.names.push([player.name, player.id])
                    if(state.names.length > 4) state.redirect=true
                    return state
                })
            }
        });
    }

    playerBroadcast = () => {
        const user = {
            id : this.uid,
            name: this.name
        }
        this.clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user))
    }

    onConnection = () => {
        console.log("Connection")
        this.playerBroadcast()
    }

    onError = () => {
        console.log("Error")
    }

    onDisconnect = () => {
        console.log("Disconnected")
    }

    
    render() {
        return (
            <div className="tableContainer">
                 { this.state.redirect ? (<Navigate push to="/game"/>) : null }
                <table className='table table-dark table-hover'>
                    <thead>
                        <tr>
                            <th scope='col'>Players</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.names.map(player => {
                        return (
                            <tr key={player[1]}>
                            <td style={{"padding":" 20px 80px"}}>{ player[0] }</td>
                            </tr>
                        );
                    })}                    
                    </tbody>
                    <tfoot/>
                </table>

                <SockJsClient
                    url={SOCKET_URL}
                    topics={[CONN_RECV_TOPIC]}
                    onMessage={this.onPlayersReceive} 
                    onConnect={this.onConnection}
                    onDisconnect={this.onDisconnect}
                    ref={ (client) => { this.clientRef = client }} 
                />
            </div>
        )
    }

}

export default Connect
