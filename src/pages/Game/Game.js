import React, { useState } from 'react';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import './Game.css'
import { useLocation } from "react-router-dom";

import SockJsClient from '../Connect/SockJsClient';
import Markdown from '../../components/Markdown.component';

const SOCKET_URL = "http://localhost:8080/ws-message";
const CONN_RECV_TOPIC = "/topic/game";
const GAME_TOPIC = "/app/game";
const QUESTION_TOPIC = "/app/question";

const PROGRESS_COLORS = ["#6a1b9a", "#00695c", "#ef6c00", "#c41e3a", "#0096ff"];

export default function Game() {
    let clientRef = null;
    const location = useLocation();
    const user = location.state.user;

    const [questionData, setQuestionData] = useState({
        questionSnippet: '',
        options: {},
        id: null
    })

    let playersData = [];

    for(const [index, player] of location.state.players.entries()){
        playersData.push({
            id: player.id,
            name: player.name,
            bgcolor: PROGRESS_COLORS[index],
            completed: 0
        });
    }
    const [progressState, setProgressState] = useState(playersData);

    const onConnect = () => queryQuestions();

    const queryQuestions = () => clientRef.sendMessage(GAME_TOPIC, JSON.stringify());

    const onQuestionReceive = (data) => {
        switch(data.type) {
            case "QUESTION_SET":
                setQuestionData(data.questions[0])
                break;
            case "USER_SOLUTION":
                updateProgressBar(data.userId, data.isCorrect)
                break;
            default:
              // TODO
        }
    }

    const updateProgressBar = (userId, isCorrect) => {
        if (isCorrect) 
            for(let playerData of playersData)
                if(playerData.id === userId) playerData.completed = 100;
            setProgressState(playersData)
    }
   
   const onSolution = (e) => {
       const questionSolution = {
           userId: user.id,
           questionId: questionData.id,
           solution: e.target.value
       }
       clientRef.sendMessage(QUESTION_TOPIC, JSON.stringify(questionSolution))
   }

   const onDisconnect = () => console.log("Disconnted");

    return (
        <div style={{"color":"white", "width":"30%"}}>
            {/* TODO: move the progress bars to a seperate component  */}
            <div className={'progressGroup'}>
                {progressState.map((item, idx) => (
                    <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} name={item.name} />
                ))}
            </div>

            <Markdown>{questionData.questionSnippet}</Markdown>
            {
                Object.keys(questionData.options).map((keyName, _) => {
                    if (keyName.startsWith("option")){
                        return (
                            <button 
                                className={'button mt-20'} 
                                type="submit" 
                                key={keyName} 
                                value={questionData.options[keyName]}
                                onClick={onSolution}>
                                    {questionData.options[keyName]}
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