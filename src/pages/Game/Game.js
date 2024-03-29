import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ProgressGroup from "../../components/ProgressGroup/ProgressGroup.component";
import OptionsGroup from "../../components/OptionsGroup/OptionsGroup.component";
import SockJsClient from "../../services/SockJsClient";
import Markdown from "../../components/Markdown/Markdown.component";

import {
  SOCKET_URL,
  GAME_SEND_TOPIC,
  ROOM_SEND_TOPIC,
  GAME_SEND_DEBUG_TOPIC,
  SOLUTION_SEND_TOPIC,
  CREATE_GAME_SOLUTION_SEND_TOPIC,
  QUESTION_SET,
  SCORE_RESPONSE,
  QUESTION_TEMPLATE,
} from "../../data/SocketData";

import "./Game.css";

export default function Game() {
  let clientRef = null;
  const location = useLocation();

  const [activeUser, setActiveUser] = useState(location.state.user);
  const [activeQuestion, setActiveQuestion] = useState(QUESTION_TEMPLATE);
  const [questions, setQuestions] = useState([QUESTION_TEMPLATE]);
  const [questionsLength, setQuestionsLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const players = location.state.players;
  const isRoom = location.state.isRoom;
  const roomId = location.state.roomId;
  const sessionId = location.state.sessionId;
  const debug = location.state.debug;
  const questionId = location.state.questionId;

  const updateProgressBar = useRef(null);
  let step = 100 / questionsLength;

  const onConnect = () => getQuestions();

  // Show normal question page or debug question page
  const getQuestions = () => {
    if (debug)
      clientRef.sendMessage(
        GAME_SEND_DEBUG_TOPIC,
        JSON.stringify({ questionId })
      );
    else if (isRoom)
      clientRef.sendMessage(ROOM_SEND_TOPIC, JSON.stringify({ roomId }));
    else clientRef.sendMessage(GAME_SEND_TOPIC, JSON.stringify({ sessionId }));
  };

  // Set questions
  // validate solution
  const onQuestionReceive = (data) => {
    console.log(data);
    switch (data.type) {
      case QUESTION_SET:
        setQuestions(data.questions);
        setQuestionsLength(data.questions.length);
        setActiveQuestion(data.questions[activeQuestionIdx]);
        break;
      case SCORE_RESPONSE:
        const newQuestions = [...questions, ...data.backupQuestion];
        setQuestions(newQuestions);
        progressUpdate(data.user, newQuestions);
        break;
      default:
        break;
    }
  };

  const highlightOption = (isCorrect) => {
    if (isCorrect) selectedOption.className = "btn btn-success";
    else selectedOption.className = "btn btn-danger";
  };

  const progressUpdate = (user, newQuestions) => {
    if (user.id === activeUser.id) {
      setActiveUser(user);
      highlightOption(user.isCorrect);

      // Change questions after 0.5 seconds
      setTimeout(() => {
        selectedOption.className = "btn btn-primary";
        if (user.score < questionsLength) {
          setActiveQuestion(newQuestions[activeQuestionIdx + 1]);
          setActiveQuestionIdx(activeQuestionIdx + 1);
        } else setIsFinished(true);
      }, 500);
    }
    updateProgressBar.current(user.id, user.score);
  };

  const onSolution = (e) => {
    setSelectedOption(e.target);
    const questionSolution = {
      user: activeUser,
      questionId: questions[activeQuestionIdx].id,
      solution: e.target.value,
    };
    isRoom
      ? clientRef.sendMessage(
          CREATE_GAME_SOLUTION_SEND_TOPIC,
          JSON.stringify({ ...questionSolution, roomId })
        )
      : clientRef.sendMessage(
          SOLUTION_SEND_TOPIC,
          JSON.stringify({ ...questionSolution, roomId })
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
    <div className="outerContainer gameOuterContainer">
      <div style={{ color: "white", width: "50%" }}>
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
              style={{ width: "45%", margin: "2.5%" }}
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
          topics={[
            isRoom ? `/topic/${roomId}/game` : `/topic/${sessionId}/game`,
          ]}
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
