import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FetchDataProvider } from './Component/FetchContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <FetchDataProvider>
        <App />
    </FetchDataProvider>
)
