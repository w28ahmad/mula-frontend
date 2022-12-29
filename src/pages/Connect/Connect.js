import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SockJsClient from "../../services/SockJsClient";
import PlayersTable from "../../components/PlayersTable/PlayersTable.component";
import {
  SOCKET_URL,
  CONN_RECV_TOPIC,
  CONN_SEND_TOPIC,
  CLOSE_SEND_TOPIC,
  DISCONN_SEND_TOPIC,
  PLAYER_CONNECTION,
  PLAYER_DISCONNECTION,
  SESSION_CLOSE,
} from "../../data/SocketData";

export default function Connect() {
  const url = new URL(window.location.href);

  let clientRef = null;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    name: url.searchParams.get("name"),
  });
  const [players, setPlayers] = useState([user]);

  const [sessionId, setSessionId] = useState(null);

  const [secondsLeft, setSecondsLeft] = useState(10);

  const onMessage = (data) => {
    switch (data.type) {
      // Request for player to join the game
      case PLAYER_CONNECTION:
        onPlayersConnect(data);
        break;
      // Request for a player to leave the game
      case PLAYER_DISCONNECTION:
        somePlayerDisconnected(data);
        break;
      // Request for a session to close to game can begin
      case SESSION_CLOSE:
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
    setSessionId(data.sessionId);
    setPlayers(data.users);
    if (user.id == null) setUser(data.users.at(0));
  };

  // Reset session users on disconnection
  const somePlayerDisconnected = (data) => {
    setPlayers(data.users);
  };

  // Broadcast player on connection
  const onConnection = () =>
    clientRef.sendMessage(CONN_SEND_TOPIC, JSON.stringify(user));

  const onDisconnect = () => {};

  // Remove player from session
  const removePlayer = () => {
    let data = {
      sessionId: sessionId,
      users: [user],
    };
    clientRef.sendMessage(DISCONN_SEND_TOPIC, JSON.stringify(data));
  };

  // Closes an open session
  const closeSession = () =>
    clientRef.sendMessage(CLOSE_SEND_TOPIC, JSON.stringify(sessionId));

  const startGame = () => {
    // Close open session
    closeSession();

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
    window.onbeforeunload = () => removePlayer();
  });

  // 10 second timer
  // TODO: remove
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);

    if (secondsLeft === 0) {
      clearInterval(interval);
      startGame();
    }

    return () => clearInterval(interval);
  }, [secondsLeft, startGame]);

  return (
    <div className="outerContainer">
      <div className="tableContainer">
        <div style={{ margin: "10px" }}>
          {secondsLeft} seconds left before game starts
        </div>
        <PlayersTable players={players} />
        <SockJsClient
          url={SOCKET_URL}
          topics={[CONN_RECV_TOPIC]}
          onMessage={onMessage}
          onConnect={onConnection}
          onDisconnect={onDisconnect}
          ref={(client) => {
            clientRef = client;
          }}
        />
      </div>
    </div>
  );
}
