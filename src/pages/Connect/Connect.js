import React from 'react';
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/ws-message';

const Connect = () => {

    // const [message, setMessage] = useState('You server message here.');

    let onConnected = () => {
      console.log("Connected!!")
    }
  
    let onMessageReceived = (msg) => {
      console.log(msg)
    }
  
    return (
      <div>
        <SockJsClient
          url={SOCKET_URL}
          topics={['/chat']}
          onConnect={onConnected}
          onDisconnect={console.log("Disconnected!")}
          onMessage={msg => onMessageReceived(msg)}
          debug={false}
        />
        {/* <div>{message}</div> */}
      </div>
    );
}

export default Connect;