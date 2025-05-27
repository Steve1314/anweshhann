import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Global } from 'global'; // Ensure global is imported

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
