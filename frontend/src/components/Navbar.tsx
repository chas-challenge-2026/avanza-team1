import { NavLink, useNavigate } from "react-router-dom";
import { mockPortfolio } from "../types/portfolio";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>Avanza</h1>
      </div>
      <nav>
        <NavLink to="/">Portfolio</NavLink>
        <NavLink to="/holdings">Innehav</NavLink>
        <NavLink to="/alerts">Notiser</NavLink>
      </nav>
      <div className="navbar-user">
        <span className="navbar-user-name">{mockPortfolio.userName}</span>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Logga ut
        </button>
      </div>
    </header>
  );
}

export default Navbar;
