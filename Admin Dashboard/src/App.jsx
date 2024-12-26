import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Dashboard from './Component/Change/Dashboard'
import Recipes from './Component/Change/Recipes'
import Users from './Component/Change/Users'
import Signup from './Component/Auth/Signup'

function App() {

  return (
    <Router>
      <div className='grid-container'>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/recipes" element={<Recipes/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
