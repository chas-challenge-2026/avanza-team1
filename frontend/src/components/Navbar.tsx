import { NavLink, useNavigate } from "react-router-dom";
import { mockPortfolio } from "../types/portfolio";
import { useAuth } from "../auth/useAuth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout(): void {
    logout(); // rensar token + user - utan detta är man fortfarande "inloggad" efter redirecten
    navigate("/login");
  }

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
        <button className="logout-button" onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </header>
  );
}

export default Navbar;
