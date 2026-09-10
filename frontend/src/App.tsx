// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import Portfolio from './pages/Portfolio';
import Holdings from './pages/Holdings';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './auth/useAuth';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <header>
        {/* Navbar döljs på /login - man ska inte se nav-länkar eller en "Logga ut"-knapp innan man är inloggad */}
        {isAuthenticated && <Navbar/>}
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Portfolio />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </main>
      <footer>
        {/* Place footer component here */}
      </footer>
    </>
  )
}

export default App;
