import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   navigate("/login");
  // };


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
        <button className={styles["logout-button"]} onClick={() => navigate("/login")}>
          Logga ut
        </button>
    </header>
  );
}

export default Navbar;