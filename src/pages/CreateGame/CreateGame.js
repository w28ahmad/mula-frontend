import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./CreateGame.css";

export default function CreateGame() {
  const location = useLocation();

  const [user, setUser] = useState({
    id: null,
    name: location.state.name,
  });

  return (
    <div className="outerContainer">
      <div className="row create-game-container">
        <h3 className="title">Grade</h3>
        <div className="form-group">
          <input
            type="range"
            min="6"
            max="12"
            step="1"
            className="form-control-range slider"
          />
        </div>
        <div className="form-group difficulty-checkboxes">
          <h3 className="title">Difficulty</h3>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="easy" />
            <label className="form-check-label" htmlFor="easy">
              EASY
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="medium" />
            <label className="form-check-label" htmlFor="medium">
              MEDIUM
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="hard" />
            <label className="form-check-label" htmlFor="hard">
              HARD
            </label>
          </div>
        </div>
        <button className="btn btn-primary submit-button">CREATE GAME</button>
      </div>
    </div>
  );
}
