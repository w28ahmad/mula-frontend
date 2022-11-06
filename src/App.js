import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Join from './pages/Join/Join';
import Connect from './pages/Connect/Connect';

const App = () => {  
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Join/>}/>
          <Route path="/connect" element={<Connect/>}/>
        </Routes>
      </Router>
  );
}

export default App;