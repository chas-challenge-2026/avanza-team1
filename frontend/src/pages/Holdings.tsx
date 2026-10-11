import { useState } from "react";
import HistoryChart from "../components/Dashboard/HistoryChart";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
import { useHistory } from "../hooks/useHistory";
import { usePortfolio } from "../hooks/usePortfolio";
import type { HistoryRange } from "../types/history";
import styles from "./Holdings.module.css";

const ranges: { key: HistoryRange; label: string }[] = [
  { key: "1M", label: "1M" },
  { key: "6M", label: "6M" },
  { key: "1Y", label: "1Y" },
  { key: "ALL", label: "Allt" },
];

function Holdings() {
  const { portfolio, isPending, isError } = usePortfolio();
  const [selectedKey, setSelectedKey] = useState("TOTAL");
  const [range, setRange] = useState<HistoryRange>("1Y");
  const { series, isFetching, isError: isHistoryError } = useHistory({
    key: selectedKey,
    range,
  });

  if (isPending) {
    return <p>Laddar innehav…</p>;
  }

  if (isError || !portfolio) {
    return <p>Kunde inte hämta innehaven.</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Innehav</h1>
      <div className={styles.controls}>
        <label className={styles.selection}>
          <span>Visa historik för</span>
          <select
            value={selectedKey}
            onChange={(event) => setSelectedKey(event.target.value)}
          >
            <option value="">Välj innehav…</option>
            <option value="TOTAL">Totalt</option>
            {portfolio.holdings.map((holding) => (
              <option key={`${holding.ticker}-${holding.account}`} value={holding.ticker}>
                {holding.ticker} – {holding.name}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.rangeControls} role="group" aria-label="Tidsperiod">
          {ranges.map((item) => (
            <button
              key={item.key}
              type="button"
              className={range === item.key ? styles.activeRange : undefined}
              aria-pressed={range === item.key}
              onClick={() => setRange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isHistoryError && (
        <p className={styles.error} role="alert">
          Kunde inte hämta historiken.
        </p>
      )}
      {!selectedKey ? (
        <p className={styles.placeholder}>Välj ett innehav för att visa historik.</p>
      ) : series ? (
        <div className={isFetching ? styles.fetching : undefined}>
          <HistoryChart series={[series]} />
        </div>
      ) : !isHistoryError ? (
        <p className={styles.placeholder}>Laddar historisk utveckling…</p>
      ) : null}

      <HoldingsTable
        holdings={portfolio.holdings}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
      />
    </div>
  );
}

export default Holdings;
