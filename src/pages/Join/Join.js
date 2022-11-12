import React, { useState } from 'react';
import { Link } from "react-router-dom";


import './Join.css';

export default function Join() {
  const [name, setName] = useState('');

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/connect?name=${name}`}>
          <button className={'button mt-20'} type="submit">Connect</button>
        </Link>
      </div>
    </div>
  );
}