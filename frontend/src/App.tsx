// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import Portfolio from './pages/Portfolio';
import Holdings from './pages/Holdings';
import Alerts from './pages/Alerts';
import './App.css';

function App() {
  return (
    <>
      <header>
        <Navbar/>
      </header>
      <main className="app-content">
        <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={null} />
        </Routes>
      </main>
    </>
  )
}

export default App;
