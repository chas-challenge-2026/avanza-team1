import Panel from "../Panel";
import styles from "./SmallHoldingsTable.module.css";
import type { AssetClass, Holding } from "../../types/portfolio";

interface SmallHoldingsTableProps {
  holdings: Holding[];
  assetClass: AssetClass;
  title: string;
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function SmallHoldingsTable({
  holdings,
  assetClass,
  title,
}: SmallHoldingsTableProps): JSX.Element {
  const classHoldings = holdings.filter(
    (holding) => holding.assetClass === assetClass,
  );
  const totalValueSek = classHoldings.reduce(
    (total, holding) => total + holding.valueSek,
    0,
  );

  return (
    <Panel title={title} size="medium">
      <div className={styles.row}>
        <span>{title}</span>
        <span className={styles.value}>{formatSek(totalValueSek)}</span>
      </div>
      <div className={styles.holdingsList}>
        {classHoldings.map((holding) => (
          <div key={holding.ticker} className={styles.row}>
            <span>
              {holding.name} ({holding.returnPct > 0 && "+"}
              {holding.returnPct}%)
            </span>
            <span>{holding.valueSek} kr</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default SmallHoldingsTable;
