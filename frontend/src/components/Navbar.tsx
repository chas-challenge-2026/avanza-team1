import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   navigate("/login");
  // };


  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Avanza</h1>
        </div>
    <nav>
      <NavLink to="/">Portfolio</NavLink>
      <NavLink to="/holdings">Innehav</NavLink>
      <NavLink to="/alerts">Notiser</NavLink>
    </nav>

      </div>
    </header>
);
}

export default Navbar;