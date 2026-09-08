import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { mockPortfolio } from "../types/portfolio";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className={styles.navbar}>
        <div className={styles["navbar-brand"]}>
          <h1>Avanza</h1>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}>Portfolio</NavLink>
          <NavLink to="/holdings" className={({ isActive }) => isActive ? styles.active : ""}>Innehav</NavLink>
          <NavLink to="/alerts" className={({ isActive }) => isActive ? styles.active : ""}>Notiser</NavLink>
        </nav>
        <div className="navbar-user">
          <span className="navbar-user-name">{mockPortfolio.userName}</span>
          <button className={styles["logout-button"]} onClick={() => navigate("/login")}>
            Logga ut
          </button>
        </div>
    </header>
  );
}

export default Navbar;
