import Panel from '../Panel';
import styles from './HoldingsTable.module.css';

function HoldingsTable(): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <div className={styles.header}>
        <h2 className={styles.title}>Innehav</h2>
        <a href="#" className={styles.backLink}>← Tillbaka till Översikt</a>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.headerCell}>Ticker</th>
            <th className={styles.headerCell}>Namn</th>
            <th className={styles.headerCell}>Konto</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Antal</th>
            <th className={styles.headerCell}>Valuta</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Värde</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Värde SEK</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Ändring</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.cellTicker}`}>AAPL</td>
            <td className={styles.cell}>Apple Inc</td>
            <td className={styles.cell}>Depå</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>10</td>
            <td className={styles.cell}>USD</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>21 000</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>21 000</td>
            <td className={`${styles.cell} ${styles.cellRight} ${styles.cellChange}`}>+12%</td>
          </tr>
          <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.cellTicker}`}>VOLV-B</td>
            <td className={styles.cell}>Volvo</td>
            <td className={styles.cell}>ISK</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>40</td>
            <td className={styles.cell}>SEK</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>112 000</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>112 000</td>
            <td className={`${styles.cell} ${styles.cellRight} ${styles.cellChange}`}>+4%</td>
          </tr>
          <tr>
            <td className={`${styles.cell} ${styles.cellTicker}`}>Avanza Global</td>
            <td className={styles.cell}>Avanza Global (KF)</td>
            <td className={styles.cell}>KF</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>250</td>
            <td className={styles.cell}>SEK</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>89 500</td>
            <td className={`${styles.cell} ${styles.cellRight}`}>89 500</td>
            <td className={`${styles.cell} ${styles.cellRight} ${styles.cellChange}`}>-7%</td>
          </tr>
        </tbody>
      </table>

      <p className={styles.footer}>Värdena i SEK med FX-vikten</p>
    </Panel>
  );
}

export default HoldingsTable;
