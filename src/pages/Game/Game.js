import React, { useState, useRef } from 'react';
import { useLocation } from "react-router-dom";

import ProgressGroup from '../../components/ProgressGroup/ProgressGroup.component';
import OptionsGroup from '../../components/OptionsGroup/OptionsGroup.component'
import SockJsClient from '../../services/SockJsClient';
import Markdown from '../../components/Markdown/Markdown.component';

import { SOCKET_URL, GAME_RECV_TOPIC, GAME_SEND_TOPIC, SOLUTION_SEND_TOPIC } from '../../data/SocketData';

import './Game.css'

export default function Game() {
    let clientRef = null;
    const location = useLocation();
    const activeUser = location.state.user;
    const players = location.state.players;

    const [score, setScore] = useState(0)
    const [questionData, setQuestionData] = useState([{
        questionSnippet: '',
        options: {},
        id: null
    }]);

    const updateProgressBar = useRef(null)
    let step = 100/questionData.length;

    const onConnect = () => queryQuestions();

    const queryQuestions = () => clientRef.sendMessage(GAME_SEND_TOPIC, JSON.stringify());

    const onQuestionReceive = (data) => {
        switch(data.type) {
            case "QUESTION_SET":
                setQuestionData(data.questions)
                break;
            case "USER_SOLUTION":
                if(data.isCorrect) updateScores(data.userId)
                break;
            default:
        }
    }

    const updateScores = (userId) => {
        if(userId === activeUser.id) setScore(score+1)
        updateProgressBar.current(userId)
    }
   
   const onSolution = (e) => {
       const questionSolution = {
           userId: activeUser.id,
           questionId: questionData[score].id,
           solution: e.target.value
       }
       clientRef.sendMessage(SOLUTION_SEND_TOPIC, JSON.stringify(questionSolution))
   }

   const onDisconnect = () => {}

    return (
        <div style={{"color":"white", "width":"30%"}}>
            <ProgressGroup players={players} updateProgressBar={updateProgressBar} step={step}/>
            <Markdown>{questionData[score].questionSnippet}</Markdown>
            <OptionsGroup options={questionData[score].options} onSolution={onSolution}/>
            <SockJsClient
                url={SOCKET_URL}
                topics={[GAME_RECV_TOPIC]}
                onMessage={onQuestionReceive} 
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                ref={ (client) => { clientRef = client }} 
            />
        </div>
    )
}