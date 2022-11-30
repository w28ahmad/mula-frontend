import React, { useState, useRef } from 'react'
import { useLocation } from "react-router-dom"

import ProgressGroup from '../../components/ProgressGroup/ProgressGroup.component'
import OptionsGroup from '../../components/OptionsGroup/OptionsGroup.component'
import SockJsClient from '../../services/SockJsClient'
import Markdown from '../../components/Markdown/Markdown.component'

import { SOCKET_URL, GAME_RECV_TOPIC, GAME_SEND_TOPIC, SOLUTION_SEND_TOPIC, 
        QUESTION_SET, USER_SOLUTION } from '../../data/SocketData'

import './Game.css'

export default function Game() {
    let clientRef = null
    const location = useLocation()
    const activeUser = location.state.user
    const players = location.state.players

    const [isFinished, setIsFinished] = useState(false)
    const [score, setScore] = useState(0)
    const [questionData, setQuestionData] = useState([{
        questionSnippet: '',
        options: {},
        id: null
    }])

    const updateProgressBar = useRef(null)
    let step = 100/questionData.length

    const onConnect = () => queryQuestions()

    const queryQuestions = () => clientRef.sendMessage(GAME_SEND_TOPIC, JSON.stringify())

    const onQuestionReceive = (data) => {
        switch(data.type) {
            case QUESTION_SET:
                setQuestionData(data.questions)
                break
            case USER_SOLUTION:
                if(data.isCorrect) updateScores(data.userId)
                break
            default: break
        }
    }

    const updateScores = (userId) => {
        if(score+1 === questionData.length) setIsFinished(true)
        else if(userId === activeUser.id) setScore(score+1)
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
            {
                isFinished ? <h1>FINISHED</h1> : null
            }

            <ProgressGroup players={players} updateProgressBar={updateProgressBar} step={step}/>
            
            {
                isFinished ?
                null : // TODO: back to home page
                <div>
                    <Markdown>{questionData[score].questionSnippet}</Markdown>
                    <OptionsGroup options={questionData[score].options} onSolution={onSolution}/>
                </div>
            }

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