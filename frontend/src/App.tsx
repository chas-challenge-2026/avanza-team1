// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";

function App() {

  return (
    <>
      <header>
        <Navbar/>
          <Routes>
            <Route path="/" element={null} />
            <Route path="/holdings" element={null} />
            <Route path="/login" element={null} />
            <Route path="/alerts" element={null} />
          </Routes>
      </header>
      <main>

      </main>
      <footer>
        
      </footer>
    </>
  )
}

export default App
