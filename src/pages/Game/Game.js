import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ProgressGroup from "../../components/ProgressGroup/ProgressGroup.component";
import OptionsGroup from "../../components/OptionsGroup/OptionsGroup.component";
import SockJsClient from "../../services/SockJsClient";
import Markdown from "../../components/Markdown/Markdown.component";

import {
  SOCKET_URL,
  GAME_RECV_TOPIC,
  GAME_SEND_TOPIC,
  GAME_SEND_DEBUG_TOPIC,
  SOLUTION_SEND_TOPIC,
  QUESTION_SET,
  SCORE_RESPONSE,
  QUESTION_TEMPLATE,
} from "../../data/SocketData";

import "./Game.css";

export default function Game() {
  let clientRef = null;
  const location = useLocation();

  const [activeUser, setActiveUser] = useState(location.state.user);
  const players = location.state.players;
  const sessionId = location.state.sessionId;
  const debug = location.state.debug;
  const questionId = location.state.questionId;

  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const [activeQuestion, setActiveQuestion] = useState(QUESTION_TEMPLATE);
  const [questions, setQuestions] = useState([QUESTION_TEMPLATE]);

  const updateProgressBar = useRef(null);
  let step = 100 / questions.length;

  const onConnect = () => getQuestions();

  // Show normal question page or debug question page
  const getQuestions = () => {
    if (debug)
      clientRef.sendMessage(
        GAME_SEND_DEBUG_TOPIC,
        JSON.stringify({ questionId })
      );
    else clientRef.sendMessage(GAME_SEND_TOPIC, JSON.stringify({ sessionId }));
  };

  // Set questions
  // validate solution
  const onQuestionReceive = (data) => {
    console.log(data);
    switch (data.type) {
      case QUESTION_SET:
        setQuestions(data.questions);
        setActiveQuestion(data.questions[score]);
        break;
      case SCORE_RESPONSE:
        updateScores(data.user);
        break;
      default:
        break;
    }
  };

  // Update score on correct solution
  const updateScores = (user) => {
    if (user.id === activeUser.id) {
      setScore(user.score);
      setIsFinished(user.score === questions.length);
      setActiveQuestion(questions[user.score]);
      setActiveUser(user);
    }
    updateProgressBar.current(user.id, user.score);
  };

  const onSolution = (e) => {
    const questionSolution = {
      sessionId: sessionId,
      user: activeUser,
      questionId: questions[score].id,
      solution: e.target.value,
    };
    clientRef.sendMessage(
      SOLUTION_SEND_TOPIC,
      JSON.stringify(questionSolution)
    );
  };

  const onDisconnect = () => {};

  // On refresh we want to ensure everything is reset
  useEffect(() => {
    window.onbeforeunload = () => clientDisconnection();
  });

  const clientDisconnection = () => {
    /* TODO */
  };

  return (
    <div className="outerContainer">
      <div style={{ color: "white", width: "30%" }}>
        {isFinished ? <h1>FINISHED</h1> : null}

        <ProgressGroup
          players={players}
          updateProgressBar={updateProgressBar}
          step={step}
        />

        {isFinished ? null : ( // TODO: back to home page
          <div>
            <Markdown>{activeQuestion.questionSnippet}</Markdown>
            <img
              src={activeQuestion.diagram}
              style={{ width: "75%", margin: "2.5%" }}
              alt=""
            />
            <OptionsGroup
              options={activeQuestion.options}
              onSolution={onSolution}
            />
          </div>
        )}

        <SockJsClient
          url={SOCKET_URL}
          topics={[GAME_RECV_TOPIC]}
          onMessage={onQuestionReceive}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          ref={(client) => {
            clientRef = client;
          }}
        />
      </div>
    </div>
  );
}
