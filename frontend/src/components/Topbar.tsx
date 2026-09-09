import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";
import { mockPortfolio } from "../types/portfolio";

function Topbar() {
  const navigate = useNavigate();

  return (
    <header className={styles.topbar}>
        <div className={styles.brand}>
          <img src="src/assets/logo.webp" alt="Logo" className={styles.logo} />
          <h1>Portföljhälsa</h1>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}>Portfolio</NavLink>
          <NavLink to="/holdings" className={({ isActive }) => isActive ? styles.active : ""}>Innehav</NavLink>
          <NavLink to="/alerts" className={({ isActive }) => isActive ? styles.active : ""}>Notiser</NavLink>
        </nav>
        <div className={styles.user}>
          <span className={styles["user-name"]}>{mockPortfolio.userName}</span>
          <button className={styles["logout-button"]} onClick={() => navigate("/login")}>
            Logga ut
          </button>
        </div>
    </header>
  );
}

export default Topbar;
