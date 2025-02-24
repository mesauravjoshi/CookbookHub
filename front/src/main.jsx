import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './Components/UserContext.jsx'; // Adjust the import path as necessary

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>,
)