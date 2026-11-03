import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./Topbar.module.css";
import logo from "../../assets/logo.webp";
import HamburgerMenu from "./HamburgerMenu";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        !navigationRef.current?.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  async function handleLogout(): Promise<void> {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>PORTFÖLJHÄLSA</h1>
      </div>
      <nav
        ref={navigationRef}
        id="topbar-navigation"
        className={`${styles.desktopNav} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
        aria-label="Huvudmeny"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Portfölj
        </NavLink>
        <NavLink
          to="/holdings"
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Innehav
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) => (isActive ? styles.active : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Notiser
        </NavLink>
        <button
          type="button"
          className={`${styles.logoutButton} ${styles.mobileLogout} green`}
          onClick={handleLogout}
        >
          Logga ut
        </button>
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
          <HamburgerMenu
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((currentValue) => !currentValue)}
            buttonRef={menuButtonRef}
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
