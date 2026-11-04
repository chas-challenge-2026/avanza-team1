import styles from "./AccountsTable.module.css";
import type { Account, Allocation } from "../../types/portfolio";

interface AccountsTableProps {
  accounts: Account[];
  allocation: Allocation;
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function AccountsTable({
  accounts,
  allocation,
}: AccountsTableProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h3 className={styles.columnTitle}>Konton</h3>
        {accounts.map((account) => (
          <div key={account.type} className={styles.row}>
            <span>{account.name}</span>
            <span>{formatSek(account.valueSek)}</span>
          </div>
        ))}
      </div>
      <div className={styles.column}>
        <h3 className={styles.columnTitle}>Tillgångsslag</h3>
        <div className={styles.row}>
          <span>Aktier</span>
          <span className={styles.value}>{allocation.actualAktierPct}%</span>
        </div>
        <div className={styles.row}>
          <span>Fonder</span>
          <span className={styles.value}>{allocation.actualStabiltPct}%</span>
        </div>
      </div>
    </div>
  );
}

export default AccountsTable;
