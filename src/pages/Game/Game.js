import React, { useState, useRef } from 'react'
import { useLocation } from "react-router-dom"

import ProgressGroup from '../../components/ProgressGroup/ProgressGroup.component'
import OptionsGroup from '../../components/OptionsGroup/OptionsGroup.component'
import SockJsClient from '../../services/SockJsClient'
import Markdown from '../../components/Markdown/Markdown.component'

import {
    SOCKET_URL, GAME_RECV_TOPIC, GAME_SEND_TOPIC, GAME_SEND_DEBUG_TOPIC, SOLUTION_SEND_TOPIC,
    QUESTION_SET, USER_SOLUTION, DISCONN_SEND_TOPIC
} from '../../data/SocketData'

import './Game.css'

export default function Game() {
    let clientRef = null
    const location = useLocation()
    const activeUser = location.state.user
    const players = location.state.players
    const sessionId = location.state.sessionId
    const debug = location.state.debug
    const questionId = location.state.questionId

    const [isFinished, setIsFinished] = useState(false)
    const [score, setScore] = useState(0)
    const [questions, setQuestions] = useState([{
        questionSnippet: '',
        options: {},
        id: null
    }])

    const updateProgressBar = useRef(null)
    let step = 100 / questions.length

    const onConnect = () => getQuestions()

    const getQuestions = () => {
        if(debug){
            clientRef.sendMessage(GAME_SEND_DEBUG_TOPIC, JSON.stringify(
                { questionId }
            ))    
        } else {
            clientRef.sendMessage(GAME_SEND_TOPIC, JSON.stringify(
                { sessionId }
            ))                
        }
    }

    const onQuestionReceive = (data) => {
        switch (data.type) {
            case QUESTION_SET:
                setQuestions(data.questions)
                break
            case USER_SOLUTION:
                if (data.isCorrect) updateScores(data.userId)
                break
            default: break
        }
    }

    const updateScores = (userId) => {
        if (userId === activeUser.id) {
            setScore(score + 1)
            if (score + 1 === questions.length) {
                setIsFinished(true)
                removePlayer(activeUser)
            }
        }
        updateProgressBar.current(userId)
    }

    const removePlayer = (activeUser) => {
        let data = {
            sessionId: sessionId,
            users: [
                activeUser,
            ]
        }
        clientRef.sendMessage(DISCONN_SEND_TOPIC, JSON.stringify(data))
    }

    // TODO: Fix the score issue
    const onSolution = (e) => {
        const questionSolution = {
            userId: activeUser.id,
            questionId: questions[score].id,
            solution: e.target.innerText
        }
        clientRef.sendMessage(SOLUTION_SEND_TOPIC, JSON.stringify(questionSolution))
    }

    const onDisconnect = () => { }

    return (
        <div className="outerContainer">
            <div style={{ "color": "white", "width": "30%" }}>
                {
                    isFinished ? <h1>FINISHED</h1> : null
                }

                <ProgressGroup players={players} updateProgressBar={updateProgressBar} step={step} />

                {
                    isFinished ?
                        null : // TODO: back to home page
                        <div>
                            <Markdown>{questions[score].questionSnippet}</Markdown>
                            <OptionsGroup options={questions[score].options} onSolution={onSolution} />
                        </div>
                }

                <SockJsClient
                    url={SOCKET_URL}
                    topics={[GAME_RECV_TOPIC]}
                    onMessage={onQuestionReceive}
                    onConnect={onConnect}
                    onDisconnect={onDisconnect}
                    ref={(client) => { clientRef = client }}
                />
            </div>
        </div>
    )
}