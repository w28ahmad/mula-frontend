import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Join.css";

export default function Join() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const joinGame = (e) => {
    if (!name) {
      e.preventDefault();
      return;
    }
    navigate("/joinGame", {
      state: {
        name,
      },
    });
  };

  const createGame = (e) => {
    if (!name) {
      e.preventDefault();
      return;
    }
    navigate("/createGame", {
      state: {
        name,
      },
    });
  };

  return (
    <div className="outerContainer">
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">Join</h1>
          <div>
            <input
              placeholder="Name"
              className="joinInput"
              type="text"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <button onClick={joinGame} className={"button mt-20"} type="submit">
            Join Game
          </button>
          <button onClick={createGame} className={"button mt-20"} type="submit">
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
}
