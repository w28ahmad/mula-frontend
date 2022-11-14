import React, { useState } from 'react';
import SockJsClient from '../Connect/SockJsClient';
import Markdown from '../../components/Markdown.component';

const SOCKET_URL = "http://localhost:8080/ws-message"
const CONN_RECV_TOPIC = "/topic/game"
const SEND_QUESTION_TOPIC = "/app/game"

export default function Game() {
    let clientRef = null;

    const [questionSnippet, setQuestionSnippet] = useState('');
    const [options, setOptions] = useState({});

    const onConnect = () => queryQuestions();
    const queryQuestions = () => clientRef.sendMessage(SEND_QUESTION_TOPIC, JSON.stringify());

    const onQuestionReceive = (questionData) => {
        setQuestionSnippet(questionData.questionSnippet);
        setOptions(questionData.options);
    }

    const onSolution = (e) => console.log(e.target.value);

    const onDisconnect = () => console.log("Disconnted");

    return (
        <div style={{"color":"white"}}>
            <Markdown>{questionSnippet}</Markdown>
            {
                Object.keys(options).map((keyName, keyIndex) => {
                    if (keyName.startsWith("option")){
                        return (
                        <button 
                            className={'button mt-20'} 
                            type="submit" 
                            key={keyName} 
                            value={options[keyName]}
                            onClick={onSolution}>
                                {options[keyName]}
                        </button>)
                    }
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