import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Join from './pages/Join/Join';
import Connect from './pages/Connect/Connect';
import Game from './pages/Game/Game'
import Question from './pages/Question/Question';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Join/>}/>
          <Route path="/connect" element={<Connect/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/question" element={<Question/>}/>
        </Routes>
      </Router>
  );
}

export default App;