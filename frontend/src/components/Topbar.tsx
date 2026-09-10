import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";
import { mockPortfolio } from "../types/portfolio";
import { useAuth } from "../auth/useAuth";

function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout(): void {
    logout(); // rensar token + user - utan detta är man fortfarande "inloggad" efter redirecten
    navigate("/login");
  }

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
          <button className={styles["logout-button"]} onClick={handleLogout}>
            Logga ut
          </button>
        </div>
    </header>
  );
}

export default Topbar;
