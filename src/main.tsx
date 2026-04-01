import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize dark mode from localStorage before render to prevent flash
const stored = localStorage.getItem('maheel_theme')
if (stored) {
  try {
    const { state } = JSON.parse(stored)
    if (state?.dark) document.documentElement.classList.add('dark')
  } catch { /* ignore */ }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
