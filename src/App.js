import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Join from './pages/Join/Join';
import Connect from './pages/Connect/Connect';
import Game from './pages/Game/Game'

const App = () => {
  return (
    <div className="outerContainer">
      <Router>
        <Routes>
          <Route exact path="/" element={<Join/>}/>
          <Route path="/connect" element={<Connect/>}/>
          <Route path="/game" element={<Game/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;