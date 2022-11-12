import React from 'react';
import SockJsClient from '../Connect/SockJsClient';
import Markdown from '../../components/Markdown.component';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/game"
const CONN_SEND_TOPIC = "/app/game"

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questionSnippet: "",
            options: {}
        }
    }

    onConnect = () => {
        console.log("Connected")
        this.helloBroadcast()
    }

    onDisconnect = () => {
        console.log("Disconnected")
    }

    helloBroadcast = () => {
        this.clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify({data: "Give me quesitons!"}))
    }

    onQuestionReceive = (questionData) => {
        console.log(questionData)
        this.setState((state)=>{
            state.questionSnippet = questionData.questionSnippet
            state.options = questionData.options
            return state
        })
    }

    render() {
        return (
            <div style={{"color":"white"}}>
                <Markdown>{this.state.questionSnippet}</Markdown>
                {
                    Object.keys(this.state.options).map((keyName, keyIndex) => {
                        if (keyName.startsWith("option")){
                            return (<button className={'button mt-20'} type="submit">
                                    {this.state.options[keyName]}
                            </button>)
                        }
                    })
                }
                <SockJsClient
                    url={SOCKET_URL}
                    topics={[CONN_RECV_TOPIC]}
                    onMessage={this.onQuestionReceive} 
                    onConnect={this.onConnect}
                    onDisconnect={this.onDisconnect}
                    ref={ (client) => { this.clientRef = client }} 
                />
            </div>
        )
    }

}

export default Game