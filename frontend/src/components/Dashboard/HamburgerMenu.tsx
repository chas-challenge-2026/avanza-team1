import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./HamburgerMenu.module.css";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  function closeMenu(): void {
    setIsOpen(false);
  }

  function handleLogout(): void {
    logout();
    closeMenu();
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
        aria-expanded={isOpen}
        aria-controls="hamburger-menu"
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </span>
      </button>

      {isOpen && (
        <nav className={styles.menu} id="hamburger-menu" aria-label="Mobilmeny">
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : "")} onClick={closeMenu}>
            Portfolio
          </NavLink>
          <NavLink to="/holdings" className={({ isActive }) => (isActive ? styles.active : "")} onClick={closeMenu}>
            Innehav
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => (isActive ? styles.active : "")} onClick={closeMenu}>
            Notiser
          </NavLink>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Logga ut
          </button>
        </nav>
      )}
    </div>
  );
}

export default HamburgerMenu;
