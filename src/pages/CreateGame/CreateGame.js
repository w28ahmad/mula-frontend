import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateGame.css";

export default function CreateGame() {
  const location = useLocation();
  const navigate = useNavigate();

  const name = location.state.name;

  const [options, setOptions] = useState({
    grade: 7,
    difficulty: [],
    subject: null,
    topics: [
      "Graphs",
      "Physics",
      "Game Theory",
      "Circle Geometry",
      "Statistics",
      "Probability",
      "Arithmetic",
      "Combinatorics",
      "Exponents",
      "2D Geometry",
      "3D Geometry",
      "Logic",
      "Algebra",
      "Number Sense",
      "Fractions",
    ],
  });

  const handleOptionChange = (event) => {
    const { name, value, type, checked } = event.target;
    setOptions((prevOptions) => {
      if (type === "checkbox") {
        if (checked) {
          return {
            ...prevOptions,
            [name]: [...prevOptions[name], value],
          };
        } else {
          return {
            ...prevOptions,
            [name]: prevOptions[name].filter((option) => option !== value),
          };
        }
      } else {
        return {
          ...prevOptions,
          [name]: value,
        };
      }
    });
  };

  const handleCreateButtonClick = async () => {
    // console.log(options);
    navigate("/joinGame", {
      state: {
        name,
        isRoom: true,
        options,
      },
    });
  };

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
            name="grade"
            value={options.grade}
            onChange={handleOptionChange}
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
              <input
                className="form-check-input"
                type="checkbox"
                id="easy"
                name="difficulty"
                value="A"
                checked={options.difficulty.includes("A")}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="easy">
                Easy
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="medium"
                name="difficulty"
                value="B"
                checked={options.difficulty.includes("B")}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="medium">
                Medium
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="hard"
                name="difficulty"
                value="C"
                checked={options.difficulty.includes("C")}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="hard">
                Hard
              </label>
            </div>
          </div>
        </div>

        <div className="form-group subject-checkboxes">
          <h3 className="title">Subject</h3>
          <div className="OptionGroup">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="subject"
                id="math"
                value="math"
                checked={options.subject === "math"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="math">
                Math
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="subject"
                id="english"
                value="english"
                checked={options.subject === "english"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="english">
                English
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="subject"
                id="programming"
                value="programming"
                checked={options.subject === "programming"}
                onChange={handleOptionChange}
              />
              <label className="form-check-label" htmlFor="programming">
                Programming
              </label>
            </div>
          </div>
        </div>

        <div className="submit-button">
          <button
            className="button mt-20"
            style={{ width: "35%" }}
            onClick={handleCreateButtonClick}
          >
            CREATE GAME
          </button>
        </div>
      </div>
    </div>
  );
}
