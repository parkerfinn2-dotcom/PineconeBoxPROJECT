import React from 'react'
import ReactDOM from 'react-dom/client'

function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      color: '#333'
    }}>
      <h1>Simple React App</h1>
      <p>This is a simple React app</p>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
)