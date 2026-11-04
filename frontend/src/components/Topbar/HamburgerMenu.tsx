import type { RefObject } from "react";
import styles from "./HamburgerMenu.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
}

function HamburgerMenu({
  isOpen,
  onToggle,
  buttonRef,
}: HamburgerMenuProps) {
  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        onClick={onToggle}
        aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
        aria-expanded={isOpen}
        aria-controls="topbar-navigation"
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </span>
      </button>
    </div>
  );
}

export default HamburgerMenu;
