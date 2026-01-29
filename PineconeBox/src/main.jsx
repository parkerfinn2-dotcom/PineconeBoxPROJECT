import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx loaded')
try {
  const rootElement = document.getElementById('root')
  console.log('Root element:', rootElement)
  
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('React app rendered successfully')
  } else {
    console.error('Root element not found')
  }
} catch (error) {
  console.error('Error rendering app:', error)
}