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
  const titleColor = assetClass === "AKTIER" ? "primaryLight" : "primaryDark"

  return (
    <Panel title={title} size="small" titleColor={titleColor}>
      <div className={`${styles.row} ${styles.topRow}`}>
        <span>Totalt i denna allokering</span>
        <span>{formatSek(totalValueSek)}</span>
      </div>
      <div className={styles.holdingsList}>
        {classHoldings.map((holding) => (
          <div key={holding.ticker} className={styles.row}>
            <span>
              {holding.name} ({holding.returnPct > 0 && "+"}
              {holding.returnPct}%)
            </span>
            <span>{formatSek(holding.valueSek)} kr</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default SmallHoldingsTable;
