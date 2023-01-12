import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SockJsClient from "../../services/SockJsClient";
import PlayersTable from "../../components/PlayersTable/PlayersTable.component";
import {
  SOCKET_URL,
  CONN_RECV_TOPIC,
  CONN_SEND_TOPIC,
  CONN_ROOM_SEND_TOPIC,
  DISCONN_SEND_TOPIC,
  DISCONN_RECV_TOPIC,
  PLAYER_CONNECTION,
  PLAYER_DISCONNECTION,
  START_GAME,
} from "../../data/SocketData";

import "./JoinGame.css";

export default function JoinGame() {
  let clientRef = null;
  const navigate = useNavigate();
  const location = useLocation();

  const isRoom = location.state.isRoom || false;
  const options = location.state.options || null;

  const [user, setUser] = useState({
    id: null,
    name: location.state.name,
  });
  const [players, setPlayers] = useState([user]);

  const [sessionId, setSessionId] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const [counter, setCounter] = useState(10);

  const onMessage = (data) => {
    switch (data.type) {
      // Request for player to join the game
      case PLAYER_CONNECTION:
        onPlayersConnect(data);
        break;
      // Request for a player to leave the game
      case PLAYER_DISCONNECTION:
        onPlayerDisconnect(data);
        break;
      // start the game
      case START_GAME:
        startGame();
        break;
      default:
        break;
    }
  };

  // When a player connects we want to
  // Set sessionID & Players
  // Active user will be at the first index
  const onPlayersConnect = (data) => {
    if (isRoom) {
      setRoomId(data.roomId);
    } else {
      setSessionId(data.sessionId);
      setCounter(data.remainingTime);
    }
    setPlayers(data.users);
    if (user.id == null) setUser(data.users.at(0));
  };

  // Reset session users on disconnection
  const onPlayerDisconnect = (data) => setPlayers(data.users);

  // Broadcast player on connection
  const onConnection = () =>
    isRoom
      ? clientRef.sendMessage(
          CONN_ROOM_SEND_TOPIC,
          JSON.stringify({ ...options, user })
        )
      : clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user));

  const onDisconnect = () => {};

  // Remove player from session
  const clientDisconnection = () => {
    let data = {
      sessionId: sessionId,
      users: [user],
    };
    clientRef.sendMessage(DISCONN_SEND_TOPIC, JSON.stringify(data));
  };

  const startGame = () => {
    // Navigate to the game page
    navigate("/game", {
      state: {
        user,
        players,
        sessionId,
        debug: false,
        questionId: 0,
      },
    });
  };

  // On refresh we don't want to re-add player
  useEffect(() => {
    window.onbeforeunload = () => clientDisconnection();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => (counter > 0 ? counter - 1 : counter));
    }, 1000);
    return () => clearInterval(interval);
  });

  const copyLink = () => {
    let link = window.location.href;
    navigator.clipboard.writeText(link + `?roomId=${roomId}`);
  };

  return (
    <div className="outerContainer">
      <div className="tableContainer">
        {isRoom ? null : (
          <div style={{ margin: "10px" }}>
            <h1>{counter}</h1>
          </div>
        )}
        <PlayersTable players={players} />
        <SockJsClient
          url={SOCKET_URL}
          topics={[CONN_RECV_TOPIC, DISCONN_RECV_TOPIC]}
          onMessage={onMessage}
          onConnect={onConnection}
          onDisconnect={onDisconnect}
          ref={(client) => {
            clientRef = client;
          }}
        />
        {isRoom ? (
          <div>
            <button className={"button mt-20"} onClick={copyLink}>
              Copy Link
            </button>
            <button className={"button mt-20"} onClick={startGame}>
              Start Game
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
