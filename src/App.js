import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Join from "./pages/Join/Join";
import JoinGame from "./pages/JoinGame/JoinGame";
import CreateGame from "./pages/CreateGame/CreateGame";
import Game from "./pages/Game/Game";
import Question from "./pages/Question/Question";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Join />} />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path="/createGame" element={<CreateGame />} />
        <Route path="/game" element={<Game />} />
        <Route path="/question" element={<Question />} />
      </Routes>
    </Router>
  );
};

export default App;
