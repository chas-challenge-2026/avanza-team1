import Panel from '../Panel';
import styles from './AllocationTable.module.css';

function AllocationTable(): JSX.Element {
  return (
    <Panel title="Fördelning" size="large">
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.headerCell}>Tillgångsslag</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Andel</th>
            <th className={`${styles.headerCell} ${styles.headerCellRight}`}>Värde</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.row}>
            <td className={styles.cell}>Aktier</td>
            <td className={`${styles.cell} ${styles.cellPercentage}`}>75%</td>
            <td className={`${styles.cell} ${styles.cellValue}`}>523 837 kr</td>
          </tr>
          <tr className={styles.row}>
            <td className={styles.cell}>Obligationer</td>
            <td className={`${styles.cell} ${styles.cellPercentage}`}>15%</td>
            <td className={`${styles.cell} ${styles.cellValue}`}>104 767 kr</td>
          </tr>
          <tr>
            <td className={styles.cell}>Kontanter</td>
            <td className={`${styles.cell} ${styles.cellPercentage}`}>10%</td>
            <td className={`${styles.cell} ${styles.cellValue}`}>69 846 kr</td>
          </tr>
        </tbody>
      </table>
    </Panel>
  );
}

export default AllocationTable;
