import styles from "./PageHeader.module.css";
import type { HistorySeries } from "../../types/history";

interface PageHeaderProps {
  title?: string;
  totalValueSek: number;
  history?: HistorySeries;
}

function PageHeader({
  title = "Din portfölj",
  totalValueSek,
  history,
}: PageHeaderProps): JSX.Element {
  const points = history?.points ?? [];
  const previous = points[points.length - 2];
  const latest = points[points.length - 1];
  const change = previous && latest ? latest.value - previous.value : undefined;
  const changePercent = previous && previous.value !== 0 && change !== undefined
    ? (change / previous.value) * 100
    : undefined;

  return (
    <section className={styles.pageHeader}>
      <div className={styles.pageHeaderContainer}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.value}>
          {totalValueSek.toLocaleString("sv-SE")} <span>SEK</span>
        </div>
        <p className={styles.subtitle}>
          {change === undefined ? "Senaste månadens förändring saknas" : (
            <>Senaste månadens förändring: {change > 0 ? "+" : ""}{change.toLocaleString("sv-SE")} kr
              {changePercent !== undefined && ` (${changePercent > 0 ? "+" : ""}${changePercent.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} %)`}
            </>
          )}
        </p>
      </div>
    </section>
  );
}

export default PageHeader;
