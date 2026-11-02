import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./Topbar.module.css";
import logo from "../../assets/logo.webp";
import HamburgerMenu from "./HamburgerMenu";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/login");
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>PORTFÖLJHÄLSA</h1>
      </div>
      {/* TODO: NavLinks are duplicated in HamburgerMenu component, responsive behaviour should be that the nav is rendered EITHER as the horizontal navbar as below OR as the HamburgerMenu. */}
      <nav className={styles.desktopNav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Portfölj
        </NavLink>
        <NavLink
          to="/holdings"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Innehav
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Notiser
        </NavLink>
      </nav>
      <div className={styles.user}>
        <span className={styles.userName}>{user?.name ?? ""}</span>
        <button
          className={`${styles.logoutButton} ${styles.desktopLogout} green`}
          onClick={handleLogout}
        >
          Logga ut
        </button>
        <div className={styles.hamburgerContainer}>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
