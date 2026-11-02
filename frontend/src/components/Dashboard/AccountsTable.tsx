import styles from "./AccountsTable.module.css";
import Panel from "../Panel";
import type { Account } from "../../types/portfolio";

interface AccountsTableProps {
  accounts: Account[];
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function AccountsTable({ accounts }: AccountsTableProps): JSX.Element {
  return (
    <Panel title="Konton" size="medium">
          {accounts.map((account) => (
            <div key={account.type} className={styles.row}>
              <span>{account.name}</span>
              <span>{formatSek(account.valueSek)}</span>
            </div>
          ))}
    </Panel>
  );
}

export default AccountsTable;
