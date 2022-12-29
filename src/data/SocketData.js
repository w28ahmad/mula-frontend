
export const HOST = "http://localhost:8080"

// Socket Connection URL
export const SOCKET_URL = HOST+"/ws-message";

// Player Connection topics
export const CONN_RECV_TOPIC = "/topic/connect"
export const CONN_SEND_TOPIC = "/app/connect"

// Player close session topic -- change session
// from open to close
export const CLOSE_SEND_TOPIC = "/app/close"

// Disconnect player from players connection table
export const DISCONN_RECV_TOPIC = "/topic/disconnect"
export const DISCONN_SEND_TOPIC = "/app/disconnect"

// Game Topics
// send, recv and debug
export const GAME_RECV_TOPIC = "/topic/game";
export const GAME_SEND_TOPIC = "/app/game";
export const GAME_SEND_DEBUG_TOPIC = "/app/gameDebug";

// Solution Send topic
export const SOLUTION_SEND_TOPIC = "/app/solution";

// Socket Receive data types
export const QUESTION_SET = "QUESTION_SET"
export const USER_SOLUTION = "USER_SOLUTION"
export const PLAYER_CONNECTION = "PLAYER_CONNECTION"
export const PLAYER_DISCONNECTION = "PLAYER_DISCONNECTION"
export const SESSION_CLOSE = "SESSION_CLOSE"
