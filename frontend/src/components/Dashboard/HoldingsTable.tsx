import Panel from "../Panel";
import styles from "./HoldingsTable.module.css";
import type { Holding } from "../../types/portfolio";

interface HoldingsTableProps {
  holdings: Holding[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

function formatSek(value: number): string {
  return value.toLocaleString("sv-SE");
}

function formatReturnPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("sv-SE")} %`;
}

function HoldingsTable({ holdings, selectedKey, onSelect }: HoldingsTableProps): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Ticker</th>
            <th>Namn</th>
            <th>Konto</th>
            <th className={styles.right}>Antal</th>
            <th>Valuta</th>
            <th className={styles.right}>
              Värde SEK
            </th>
            <th className={styles.right}>
              Ändring
            </th>
            <th>Historik</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr
              key={`${holding.ticker}-${holding.account}`}
              className={selectedKey === holding.ticker ? styles.selectedRow : undefined}
            >
              <td className={styles.ticker}>
                {holding.ticker}
              </td>
              <td>{holding.name}</td>
              <td>{holding.account}</td>
              <td className={styles.right}>
                {holding.quantity}
              </td>
              <td>{holding.currency}</td>
              <td className={styles.right}>
                {formatSek(holding.valueSek)}
              </td>
              <td
                className={`${styles.right} ${styles.change}`}
              >
                {formatReturnPct(holding.returnPct)}
              </td>
              <td>
                <button
                  type="button"
                  className={styles.historyButton}
                  aria-pressed={selectedKey === holding.ticker}
                  onClick={() => onSelect?.(holding.ticker)}
                >
                  Visa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </Panel>
  );
}

export default HoldingsTable;
