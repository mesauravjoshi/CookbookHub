import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FetchDataProvider } from './Component/FetchContext.jsx'
import { AuthProvider } from './Component/Auth/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
        <AuthProvider>
    <FetchDataProvider>
        <App />
    </FetchDataProvider>
        </AuthProvider>
    
)
