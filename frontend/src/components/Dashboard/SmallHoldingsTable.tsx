import Panel from "../Panel";
import styles from "./SmallHoldingsTable.module.css";
import type { AssetClass, Holding } from "../../types/portfolio";
import type { HistorySeries } from "../../types/history";

interface SmallHoldingsTableProps {
  holdings: Holding[];
  assetClass: AssetClass;
  title: string;
  histories: Record<string, HistorySeries | undefined>;
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function SmallHoldingsTable({
  holdings,
  assetClass,
  title,
  histories,
}: SmallHoldingsTableProps): JSX.Element {
  const classHoldings = holdings.filter(
    (holding) => holding.assetClass === assetClass,
  );
  const totalValueSek = classHoldings.reduce(
    (total, holding) => total + holding.valueSek,
    0,
  );
  const titleColor = assetClass === "AKTIER" ? "primaryLight" : "primaryDark"

  return (
    <Panel title={title} size="small" titleColor={titleColor}>
      <div className={`${styles.row} ${styles.topRow}`}>
        <span>Totalt i denna allokering</span>
        <span>{formatSek(totalValueSek)}</span>
      </div>
      <div className={styles.holdingsList}>
        {classHoldings.map((holding) => (
          (() => {
            const points = histories[holding.ticker]?.points ?? [];
            const previous = points[points.length - 2];
            const latest = points[points.length - 1];
            const changePercent = previous && latest && previous.value !== 0
              ? ((latest.value - previous.value) / previous.value) * 100
              : undefined;

            return (
              <div key={holding.ticker} className={styles.row}>
                <span>
                  {holding.name} ({changePercent === undefined ? "–" : `${changePercent > 0 ? "+" : ""}${changePercent.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} %`})
                </span>
                <span>{formatSek(holding.valueSek)}</span>
              </div>
            );
          })()
        ))}
      </div>
    </Panel>
  );
}

export default SmallHoldingsTable;
