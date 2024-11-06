// Community Recipe Sharing Platform: 
import Login from './Components/Login'
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import Upload from './Components/Upload';
import Home from './Components/Home';
import Bookmark from './Components/Bookmark';
import RecipeID from './Components/RecipeID';
import Recipe from './Components/Recipe';
import InfiniteScrollExample from './Components/InfiniteScrollExample';
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
                  <Route path="/InfiniteScrollExample" element={<InfiniteScrollExample />} />
                  <Route path="/profile/:username" element={<Profile />} /> {/* Dynamic route */}
              </Routes>
          </div>
      </Router>
  );
}

export default App