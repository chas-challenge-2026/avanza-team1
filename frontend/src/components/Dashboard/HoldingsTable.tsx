import Panel from "../Panel";
import styles from "./HoldingsTable.module.css";
import type { Holding } from "../../types/portfolio";

interface HoldingsTableProps {
  holdings: Holding[];
}

function formatSek(value: number): string {
  return value.toLocaleString("sv-SE");
}

function formatReturnPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("sv-SE")} %`;
}

function HoldingsTable({ holdings }: HoldingsTableProps): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.headerCell}>Ticker</th>
            <th className={styles.headerCell}>Namn</th>
            <th className={styles.headerCell}>Konto</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>
              Antal
            </th>
            <th className={styles.headerCell}>Valuta</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>
              Värde SEK
            </th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>
              Ändring
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr
              key={`${holding.ticker}-${holding.account}`}
              className={styles.row}
            >
              <td className={`${styles.cell} ${styles.cellTicker}`}>
                {holding.ticker}
              </td>
              <td className={styles.cell}>{holding.name}</td>
              <td className={styles.cell}>{holding.account}</td>
              <td className={`${styles.cell} ${styles.cellRight}`}>
                {holding.quantity}
              </td>
              <td className={styles.cell}>{holding.currency}</td>
              <td className={`${styles.cell} ${styles.cellRight}`}>
                {formatSek(holding.valueSek)}
              </td>
              <td
                className={`${styles.cell} ${styles.cellRight} ${styles.cellChange}`}
              >
                {formatReturnPct(holding.returnPct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.footer}>
        <a href="/holdings" className={styles.viewLink}>
          Visa innehav
        </a>
      </div>
    </Panel>
  );
}

export default HoldingsTable;
