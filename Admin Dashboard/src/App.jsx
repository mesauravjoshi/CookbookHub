import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Dashboard from './Component/Change/Dashboard'
import Recipes from './Component/Change/Recipes'
import Users from './Component/Change/Users'

function App() {

  return (
    <Router>
      <div className='grid-container'>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/recipes" element={<Recipes/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
