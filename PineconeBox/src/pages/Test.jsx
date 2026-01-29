import React from 'react'

const Test = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>Test Page</h1>
      <p>React is working!</p>
      <button onClick={() => console.log('Button clicked')}>Click Me</button>
    </div>
  )
}

export default Test