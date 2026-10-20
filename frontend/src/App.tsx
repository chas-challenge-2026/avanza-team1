// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Topbar from "./components/Topbar";
import Portfolio from './pages/Portfolio';
import Holdings from './pages/Holdings';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './auth/useAuth';
import MockModeBanner from "./components/MockModeBanner";
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className ="appShell">
      <MockModeBanner />
      {/* Topbar döljs på /login */}
      {isAuthenticated && <Topbar />}
      <main className="pageContent">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Portfolio />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
