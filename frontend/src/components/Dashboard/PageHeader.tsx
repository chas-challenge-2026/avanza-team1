import styles from "./PageHeader.module.css";
import type { Fx } from "../../types/portfolio";

interface PageHeaderProps {
  title?: string;
  totalValueSek: number;
  fx: Fx;
}

function PageHeader({
  title = "Din portfölj",
  totalValueSek,
  fx,
}: PageHeaderProps): JSX.Element {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.value}>
        {totalValueSek.toLocaleString("sv-SE")} <span>SEK</span>
      </div>
      <p className={styles.subtitle}>
        USD/SEK {fx.usdSek.toLocaleString("sv-SE")} · EUR/SEK{" "}
        {fx.eurSek.toLocaleString("sv-SE")}
      </p>
    </div>
  );
}

export default PageHeader;
