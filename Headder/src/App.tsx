import { useState } from 'react'
import { Button } from './components/ui/button'
import { Link } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
    
      <h1>Welcome to Headder</h1>
      <p>A web application for all you header needs</p>
      <Link to="/upload"><Button variant="outline">Upload File</Button></Link>

       
    </>
  )
}

export default App
