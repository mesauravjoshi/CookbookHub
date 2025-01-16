import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Dashboard from './Component/Change/Dashboard'
import Recipes from './Component/Change/Recipes'
import Users from './Component/Change/Users'
import Bookmark from './Component/Change/Bookmarks'
import Signup from './Component/Auth/Signup'
import Login from './Component/Auth/Login'
// import { AuthProvider } from './Component/Auth/AuthContext'; 

function App() {

  return (
    // <AuthProvider>
    <Router>
      <div className='grid-container'>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/recipes" element={<Recipes/>} />
          <Route path="/bookmarks" element={<Bookmark/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </Router>
    // </AuthProvider>
  )
}

export default App
