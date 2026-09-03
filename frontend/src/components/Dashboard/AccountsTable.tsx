import styles from './AccountsTable.module.css';

function AccountsTable(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h3 className={styles.columnTitle}>Konton</h3>
        <div className={styles.row}>
          <span>ISK</span>
          <span>412 000 kr</span>
        </div>
        <div className={styles.row}>
          <span>KF</span>
          <span>196 200 kr</span>
        </div>
        <div className={styles.row}>
          <span>Dagå</span>
          <span>100 250 kr</span>
        </div>
      </div>
      <div className={styles.column}>
        <h3 className={styles.columnTitle}>Tillgångsslag</h3>
        <div className={styles.row}>
          <span>Aktier</span>
          <span className={styles.value}>75%</span>
        </div>
        <div className={styles.row}>
          <span>Fonder</span>
          <span className={styles.value}>25%</span>
        </div>
      </div>
    </div>
  );
}

export default AccountsTable;
