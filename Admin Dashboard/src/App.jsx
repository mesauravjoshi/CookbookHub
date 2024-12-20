import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Dashboard from './Component/Change/Dashboard'
import Products from './Component/Change/Products'
import Users from './Component/Change/Users'

function App() {

  return (
    <Router>
      <div className='grid-container'>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/home" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/products" element={<Products/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
