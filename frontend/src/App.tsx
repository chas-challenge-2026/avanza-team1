// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={null} />
        <Route path="/holdings" element={null} />
        <Route path="/login" element={null} />
        <Route path="/alerts" element={null} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
