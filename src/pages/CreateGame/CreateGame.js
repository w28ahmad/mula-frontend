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
      <div className="create-game-container">
        <h3 className="title">Grade</h3>
        <div className="form-group">
          <input
            type="range"
            min="7"
            max="12"
            step="1"
            className="form-control-range slider"
          />

          <div className="labels">
            <label>7</label>
            <label>8</label>
            <label>9</label>
            <label>10</label>
            <label>11</label>
            <label>12</label>
          </div>
        </div>
        <div className="form-group difficulty-checkboxes">
          <h3 className="title">Difficulty</h3>
          <div className="OptionGroup">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="easy" />
              <label className="form-check-label" htmlFor="easy">
                Easy
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="medium" />
              <label className="form-check-label" htmlFor="medium">
                Medium
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="hard" />
              <label className="form-check-label" htmlFor="hard">
                Hard
              </label>
            </div>
          </div>
        </div>

        <div class="form-group subject-checkboxes">
          <h3 class="title">Subject</h3>
          <div class="OptionGroup">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="subject"
                id="math"
                value="math"
              />
              <label class="form-check-label" for="math">
                Math
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="subject"
                id="english"
                value="english"
              />
              <label class="form-check-label" for="english">
                English
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="subject"
                id="programming"
                value="programming"
              />
              <label class="form-check-label" for="programming">
                Programming
              </label>
            </div>
          </div>
        </div>

        <div className="submit-button">
          <button className="button mt-20" style={{ width: "35%" }}>
            CREATE GAME
          </button>
        </div>
      </div>
    </div>
  );
}
