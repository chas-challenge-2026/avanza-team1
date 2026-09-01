// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";

function App() {

  return (
    <>
      <header>
        <Navbar/>
      </header>
      <main>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/holdings" element={null} />
          <Route path="/login" element={null} />
          <Route path="/alerts" element={null} />
        </Routes>
      </main>
      <footer>
        {/* Place footer component here */}
      </footer>
    </>
  )
}

export default App
