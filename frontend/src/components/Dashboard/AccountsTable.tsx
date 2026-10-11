import styles from "./AccountsTable.module.css";
import type { Account } from "../../types/portfolio";

interface AccountsTableProps {
  accounts: Account[];
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function AccountsTable({ accounts }: AccountsTableProps): JSX.Element {
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
    </div>
  );
}

export default AccountsTable;
