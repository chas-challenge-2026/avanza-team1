import { useMemo, useState } from "react";
import HistoryChart from "../components/Dashboard/HistoryChart";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
import { useHistory } from "../hooks/useHistory";
import { usePortfolio } from "../hooks/usePortfolio";
import { useHistories } from "../hooks/useHistories";
import type { HistoryRange, HistorySeries } from "../types/history";
import type { AssetClass, Holding } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";
import styles from "./Holdings.module.css";

const ranges: { key: HistoryRange; label: string }[] = [
  { key: "1M", label: "1M" },
  { key: "6M", label: "6M" },
  { key: "1Y", label: "1Y" },
  { key: "ALL", label: "Allt" },
];

type AllocationView = "none" | AssetClass | "ALL";

const allocationColors: Record<AssetClass, { actual: string; target: string }> = {
  AKTIER: { actual: "var(--primary-color-light)", target: "var(--light-gray)" },
  STABILT: { actual: "var(--primary-color)", target: "var(--gray)" },
};

function buildAllocationSeries(
  holdings: Holding[],
  histories: Record<string, HistorySeries | undefined>,
  targetAktierPct: number,
  targetStabiltPct: number,
  selected: Exclude<AllocationView, "none">,
): HistorySeries[] {
  const assetClassByTicker = new Map<string, AssetClass>();
  for (const holding of holdings) assetClassByTicker.set(holding.ticker, holding.assetClass);

  const tickers = [...assetClassByTicker.keys()];
  const pointsByTicker = new Map(tickers.map((ticker) => [
    ticker,
    [...(histories[ticker]?.points ?? [])].sort((left, right) => left.date.localeCompare(right.date)),
  ]));
  const allDates = [...new Set(tickers.flatMap((ticker) =>
    pointsByTicker.get(ticker)?.map((point) => point.date) ?? [],
  ))].sort();
  if (allDates.length === 0 || tickers.some((ticker) => !histories[ticker])) return [];

  const valuesByTicker = new Map<string, number>();
  const pointIndexes = new Map(tickers.map((ticker) => [ticker, 0]));
  const pointsByClass: Record<AssetClass, { date: string; value: number }[]> = {
    AKTIER: [],
    STABILT: [],
  };

  for (const date of allDates) {
    for (const ticker of tickers) {
      const points = pointsByTicker.get(ticker) ?? [];
      let index = pointIndexes.get(ticker) ?? 0;
      while (index < points.length && points[index].date <= date) {
        valuesByTicker.set(ticker, points[index].value);
        index += 1;
      }
      pointIndexes.set(ticker, index);
    }

    // Wait until every holding has a first observation so the total is meaningful.
    if (tickers.some((ticker) => !valuesByTicker.has(ticker))) continue;
    const totals: Record<AssetClass, number> = { AKTIER: 0, STABILT: 0 };
    for (const ticker of tickers) {
      totals[assetClassByTicker.get(ticker)!] += valuesByTicker.get(ticker)!;
    }
    const total = totals.AKTIER + totals.STABILT;
    if (total <= 0) continue;
    pointsByClass.AKTIER.push({ date, value: (totals.AKTIER / total) * 100 });
    pointsByClass.STABILT.push({ date, value: (totals.STABILT / total) * 100 });
  }

  const classes: AssetClass[] = selected === "ALL" ? ["AKTIER", "STABILT"] : [selected];
  return classes.flatMap((assetClass) => {
    const colors = allocationColors[assetClass];
    const actual: HistorySeries = {
      key: `${assetClass}-actual`,
      label: `${assetClass} faktiskt`,
      points: pointsByClass[assetClass],
      color: colors.actual,
    };
    const target: HistorySeries = {
      key: `${assetClass}-target`,
      label: `${assetClass} mål`,
      points: pointsByClass[assetClass].map(({ date }) => ({
        date,
        value: assetClass === "AKTIER" ? targetAktierPct : targetStabiltPct,
      })),
      color: colors.target,
    };
    return [actual, target];
  });
}

function Holdings() {
  const { portfolio, isPending, isError } = usePortfolio();
  const [selectedKey, setSelectedKey] = useState("TOTAL");
  const [range, setRange] = useState<HistoryRange>("1Y");
  const [allocationView, setAllocationView] = useState<AllocationView>("none");
  const { series, isFetching, isError: isHistoryError } = useHistory({
    key: allocationView === "none" ? selectedKey : "",
    range,
  });
  const { histories, isFetching: isAllocationFetching, isError: isAllocationError } =
    useHistories(
      portfolio?.holdings.map((holding) => holding.ticker) ?? [],
      range,
      allocationView !== "none",
    );
  const useMock = import.meta.env.VITE_USE_MOCK !== "false";
  const target = useMock ? readStoredTarget() : null;
  const allocationSeries = useMemo(() => {
    if (allocationView === "none" || !portfolio) return [];
    return buildAllocationSeries(
      portfolio.holdings,
      histories,
      target?.targetAktierPct ?? portfolio.allocation.targetAktierPct,
      target?.targetStabiltPct ?? portfolio.allocation.targetStabiltPct,
      allocationView,
    );
  }, [allocationView, histories, portfolio, target]);

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
        <label className={styles.selection}>
          <span>Visa allokeringshistorik</span>
          <select
            value={allocationView}
            onChange={(event) => setAllocationView(event.target.value as AllocationView)}
          >
            <option value="none">Av</option>
            <option value="AKTIER">Riskbetonat</option>
            <option value="STABILT">Låg risk</option>
            <option value="ALL">Båda</option>
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

      {allocationView === "none" && isHistoryError && (
        <p className={styles.error} role="alert">
          Kunde inte hämta historiken.
        </p>
      )}
      {allocationView !== "none" ? isAllocationError ? (
        <p className={styles.error} role="alert">Kunde inte hämta allokeringshistoriken.</p>
      ) : allocationSeries.length > 0 ? (
        <div className={isAllocationFetching ? styles.fetching : undefined}>
          <HistoryChart series={allocationSeries} valueFormat="percent" />
        </div>
      ) : isAllocationFetching ? (
        <p className={styles.placeholder}>Laddar allokeringshistorik…</p>
      ) : (
        <p className={styles.placeholder}>Ingen komplett allokeringshistorik finns för perioden.</p>
      ) : !selectedKey ? (
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
