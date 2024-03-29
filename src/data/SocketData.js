export const HOST = "http://192.168.0.20:8080";

// Socket Connection URL
export const SOCKET_URL = HOST + "/ws-message";

// Player Connection topics
export const CONN_RECV_TOPIC = "/topic/connect";
export const CONN_SEND_TOPIC = "/app/connect";

// Player CreateGame Connection topics
export const CONN_ROOM_SEND_TOPIC = "/app/createGame/connect";

// Player close session topic -- change session
// from open to close
export const CLOSE_SEND_TOPIC = "/app/close";

// Disconnect player from players connection table
export const DISCONN_RECV_TOPIC = "/topic/disconnect";
export const DISCONN_SEND_TOPIC = "/app/disconnect";

// Game Topics
// send, recv and debug
export const GAME_SEND_TOPIC = "/app/game";
export const GAME_SEND_DEBUG_TOPIC = "/app/gameDebug";

// Room Topics
export const ROOM_SEND_TOPIC = "/app/createGame/getQuestions";

// Solution Send topic
export const SOLUTION_SEND_TOPIC = "/app/solution";
export const CREATE_GAME_SOLUTION_SEND_TOPIC = "/app/createGame/solution";

// Socket Receive data types
export const QUESTION_SET = "QUESTION_SET";
export const SCORE_RESPONSE = "SCORE_RESPONSE";
export const PLAYER_CONNECTION = "PLAYER_CONNECTION";
export const PLAYER_DISCONNECTION = "PLAYER_DISCONNECTION";
export const SESSION_CLOSE = "SESSION_CLOSE";

export const START_GAME = "START_GAME";

export const QUESTION_TEMPLATE = {
  questionSnippet: "",
  options: {},
  id: null,
  diagram: "",
};
