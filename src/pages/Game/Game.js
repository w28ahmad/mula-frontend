import React, { useState } from 'react';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import './Game.css'
import { useLocation } from "react-router-dom";


import SockJsClient from '../Connect/SockJsClient';
import Markdown from '../../components/Markdown.component';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/game"
const SEND_QUESTION_TOPIC = "/app/game"

const PROGRESS_COLORS = ["#6a1b9a", "#00695c", "#ef6c00", "#c41e3a", "#0096ff"]

export default function Game() {
    let clientRef = null;
    const location = useLocation();
    const user = location.state.user;
    console.log(location.state)

    let playersData = [] 
    
    for(const [index, player] of location.state.players.entries()){
        playersData.push({
            id: player.id,
            name: player.name,
            bgcolor: PROGRESS_COLORS[index],
            completed: 0
        })
    }

    const [questionSnippet, setQuestionSnippet] = useState('');
    const [options, setOptions] = useState({});

    const onConnect = () => queryQuestions();
    const queryQuestions = () => clientRef.sendMessage(SEND_QUESTION_TOPIC, JSON.stringify());

    const onQuestionReceive = (questionData) => {
        setQuestionSnippet(questionData.questionSnippet);
        setOptions(questionData.options);
    }

    const onSolution = (e) => {
        for(let playerData of playersData){
            if(playerData.id === user.id){
                playerData.completed = 100
            }
        }
    }

    const onDisconnect = () => console.log("Disconnted");



    return (
        <div style={{"color":"white", "width":"30%"}}>
            {/* TODO: move the progress bars to a seperate component  */}
            <div className={'progressGroup'}>
                {playersData.map((item, idx) => (
                    <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} name={item.name} />
                ))}
            </div>

            <Markdown>{questionSnippet}</Markdown>
            {
                Object.keys(options).map((keyName, _) => {
                    if (keyName.startsWith("option")){
                        return (
                            <button 
                                className={'button mt-20'} 
                                type="submit" 
                                key={keyName} 
                                value={options[keyName]}
                                onClick={onSolution}>
                                    {options[keyName]}
                            </button>
                        )
                    }
                    return null
                })
            }
            <SockJsClient
                url={SOCKET_URL}
                topics={[CONN_RECV_TOPIC]}
                onMessage={onQuestionReceive} 
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                ref={ (client) => { clientRef = client }} 
            />
        </div>
    )
}