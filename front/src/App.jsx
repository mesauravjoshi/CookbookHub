// Community Recipe Sharing Platform: 
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup';
import Profile from './Components/Profile';
import Upload from './Components/Upload';
import Home from './Components/Home/Home';
import Bookmark from './Components/Bookmark';
import RecipeID from './Components/Recipe/RecipeID';
import Recipe from './Components/Recipe/Recipe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/bookmark" element={<Bookmark />} />
                  <Route path="/recipe" element={<Recipe />} />
                  <Route path="/recipe/:_id" element={<RecipeID />} />
                  <Route path="/profile/:username" element={<Profile />} /> {/* Dynamic route */}
              </Routes>
          </div>
      </Router>
  );
}

export default App