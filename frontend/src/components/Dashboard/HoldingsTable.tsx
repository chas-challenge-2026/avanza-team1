import Panel from '../Panel';
import styles from './HoldingsTable.module.css';

function HoldingsTable(): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.headerCell}>Ticker</th>
            <th className={styles.headerCell}>Namn</th>
            <th className={styles.headerCell}>Konto</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Antal</th>
            <th className={styles.headerCell}>Valuta</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Värde SEK</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Ändring</th>
          </tr>
        </thead>
        <tbody />
      </table>

      <div className={styles.footer}>
        <a href="/holdings" className={styles.viewLink}>👁️ Visa innehav</a>
      </div>
    </Panel>
  );
}

export default HoldingsTable;
