
export const HOST = "afe6722196936407592eb00432203ec0-226711586.us-east-1.elb.amazonaws.com"

export const SOCKET_URL = HOST+"/ws-message";

export const CONN_RECV_TOPIC = "/topic/connect"
export const CONN_SEND_TOPIC = "/app/connect"

export const CLOSE_SEND_TOPIC = "/app/close"

export const DISCONN_RECV_TOPIC = "/topic/disconnect"
export const DISCONN_SEND_TOPIC = "/app/disconnect"

export const GAME_RECV_TOPIC = "/topic/game";
export const GAME_SEND_TOPIC = "/app/game";
export const GAME_SEND_DEBUG_TOPIC = "/app/gameDebug";


export const SOLUTION_SEND_TOPIC = "/app/solution";

// Socket Receive data types
export const QUESTION_SET = "QUESTION_SET"
export const USER_SOLUTION = "USER_SOLUTION"
export const PLAYER_CONNECTION = "PLAYER_CONNECTION"
export const PLAYER_DISCONNECTION = "PLAYER_DISCONNECTION"
export const SESSION_CLOSE = "SESSION_CLOSE"
