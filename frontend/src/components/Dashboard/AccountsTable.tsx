import styles from "./AccountsTable.module.css";
import type { Account, Allocation, Holding } from "../../types/portfolio";

interface AccountsTableProps {
  accounts: Account[];
  allocation: Allocation;
  holdings: Holding[];
}

interface HoldingsByAssetClass {
  aktier: Holding[];
  stabilt: Holding[];
}

function formatSek(value: number): string {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function sortHoldingsByAssetClass(holdings: Holding[]): HoldingsByAssetClass {
  return holdings.reduce<HoldingsByAssetClass>(
    (sorted, holding) => {
      sorted[holding.assetClass === "AKTIER" ? "aktier" : "stabilt"].push(holding);
      return sorted;
    },
    { aktier: [], stabilt: [] },
  );
}

function AccountsTable({
  accounts,
  holdings,
}: AccountsTableProps): JSX.Element {
  const holdingsByAssetClass = sortHoldingsByAssetClass(holdings);
  const aktierValueSek = holdingsByAssetClass.aktier.reduce(
    (total, holding) => total + holding.valueSek,
    0,
  );
  const stabiltValueSek = holdingsByAssetClass.stabilt.reduce(
    (total, holding) => total + holding.valueSek,
    0,
  );

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
        <details>
          <summary className={styles.row}>
            <span>Aktier</span>
            <span className={styles.value}>{formatSek(aktierValueSek)}</span>
          </summary>
          {holdingsByAssetClass.aktier.map(aktie => (
            <div key={aktie.ticker} className={styles.row}>
              <span>{aktie.name} ({aktie.returnPct > 0 && "+"}{aktie.returnPct}%)</span>
              <span>{aktie.valueSek} kr</span>
              </div>
          )
          )}
        </details>
        <details>
          <summary className={styles.row}>
            <span>Fonder</span>
            <span className={styles.value}>{formatSek(stabiltValueSek)}</span>
          </summary>
          {holdingsByAssetClass.stabilt.map(stabil => (
            <div key={stabil.ticker} className={styles.row}>
              <span>{stabil.name} ({stabil.returnPct > 0 && "+"}{stabil.returnPct}%)</span>
              <span>{stabil.valueSek} kr</span>
              </div>
          )
          )}
        </details>

        {/* <div className={styles.row}>
          <span>Fonder</span>
          <span className={styles.value}>{formatSek(stabiltValueSek)}</span>
        </div> */}
      </div>
    </div>
  );
}

export default AccountsTable;
