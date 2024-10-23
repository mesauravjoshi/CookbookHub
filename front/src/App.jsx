// Community Recipe Sharing Platform: 
import Login from './Auth/Login'
import Home from './Auth/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Upload from './Auth/Upload';
import Signup from './Auth/Signup';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/upload" element={<Upload />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App