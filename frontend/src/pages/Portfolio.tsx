import { useRef, useState, type KeyboardEvent } from "react";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import { InfoAside } from "../components/Dashboard/InfoAside";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import SmallHoldingsTable from "../components/Dashboard/SmallHoldingsTable";
import DriftInterpretationPanel from "../components/Dashboard/DriftInterpretationPanel";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import "./Portfolio.css";
import type { Alert, Allocation } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";
import { computeDrift } from "../lib/drift";
import { usePortfolio } from "../hooks/usePortfolio";
import { useHistory } from "../hooks/useHistory";
import { useHistories } from "../hooks/useHistories";

type HoldingsTab = "accounts" | "equities" | "stable";

const holdingsTabs: { id: HoldingsTab; label: string }[] = [
  { id: "accounts", label: "Konton" },
  { id: "equities", label: "Aktier" },
  { id: "stable", label: "Fonder" },
];

function withDrift(allocation: Allocation): Allocation {
  const { overThreshold } = computeDrift(allocation);
  return { ...allocation, overThreshold };
}

function driftAlerts(allocation: Allocation): Alert[] {
  const drift = computeDrift(allocation);
  if (!drift.overThreshold) return [];
  return [{ type: "DRIFT", message: drift.message }];
}

function Portfolio() {
  const { portfolio, isPending, isError } = usePortfolio();
  const { series: history } = useHistory({ key: "TOTAL", range: "1M" });
  const { histories: holdingHistories } = useHistories(
    portfolio?.holdings.map((holding) => holding.ticker) ?? [],
    "1M",
  );
  const goalAllocationDialog = useRef<HTMLDialogElement>(null);
  const holdingsTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selectedHoldingsTab, setSelectedHoldingsTab] =
    useState<HoldingsTab>("accounts");

  const [targetOverride, setTargetOverride] = useState<{
    targetAktierPct: number;
    targetStabiltPct: number;
  } | null>(null);

  if (isPending) {
    return <p>Laddar portfölj…</p>;
  }

  if (isError || !portfolio) {
    return <p>Kunde inte hämta portföljen.</p>;
  }

  const useMock = import.meta.env.VITE_USE_MOCK !== "false";
  const storedTarget = useMock ? (targetOverride ?? readStoredTarget()) : null;

  const allocation = withDrift({
    ...portfolio.allocation,
    actualAktierPct: Math.round(portfolio.holdings
      .filter((holding) => holding.assetClass === "AKTIER")
      .reduce((sum, holding) => sum + holding.valueSek, 0) / portfolio.totalValueSek * 100),
    actualStabiltPct: Math.round(portfolio.holdings
      .filter((holding) => holding.assetClass === "STABILT")
      .reduce((sum, holding) => sum + holding.valueSek, 0) / portfolio.totalValueSek * 100),
    targetAktierPct:
      storedTarget?.targetAktierPct ?? portfolio.allocation.targetAktierPct,
    targetStabiltPct:
      storedTarget?.targetStabiltPct ?? portfolio.allocation.targetStabiltPct,
  });

  function handleTargetSaved(
    targetAktierPct: number,
    targetStabiltPct: number,
  ) {
    setTargetOverride({ targetAktierPct, targetStabiltPct });
    goalAllocationDialog.current?.close();
  }

  function handleHoldingsTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = holdingsTabs.findIndex(
      (tab) => tab.id === selectedHoldingsTab,
    );
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % holdingsTabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + holdingsTabs.length) % holdingsTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = holdingsTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = holdingsTabs[nextIndex];
    setSelectedHoldingsTab(nextTab.id);
    holdingsTabRefs.current[nextIndex]?.focus();
  }

  const drift = computeDrift(allocation);

  return (
    <>
      <PageHeader totalValueSek={portfolio.totalValueSek} history={history} />
      <div className="dashboardGrid">
        <div className="leftColumn">
          {drift.overThreshold && <WarningBanner message={drift.message} />}
          <section className="allocationAndHoldings">
            <article className="allocationPanel">
              <AssetAllocation allocation={allocation} />
              <button className="setAllocationBtn"
                type="button"
                onClick={() => goalAllocationDialog.current?.showModal()}
              >
                Ändra målallokering
              </button>
            </article>
            <article className="holdingsTabs" aria-label="Portföljinnehav">
              <div className="holdingsTabList" role="tablist" aria-label="Visa innehav">
                {holdingsTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(element) => { holdingsTabRefs.current[index] = element; }}
                    id={`holdings-tab-${tab.id}`}
                    className="holdingsTab"
                    type="button"
                    role="tab"
                    aria-selected={selectedHoldingsTab === tab.id}
                    aria-controls={`holdings-panel-${tab.id}`}
                    tabIndex={selectedHoldingsTab === tab.id ? 0 : -1}
                    onClick={() => setSelectedHoldingsTab(tab.id)}
                    onKeyDown={handleHoldingsTabKeyDown}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {holdingsTabs.map((tab) => (
                <div
                  key={tab.id}
                  id={`holdings-panel-${tab.id}`}
                  className="holdingsTabPanel"
                  role="tabpanel"
                  aria-labelledby={`holdings-tab-${tab.id}`}
                  tabIndex={0}
                  hidden={selectedHoldingsTab !== tab.id}
                >
                  {tab.id === "accounts" ? (
                    <AccountsTable accounts={portfolio.accounts} />
                  ) : (
                    <SmallHoldingsTable
                      holdings={portfolio.holdings}
                      assetClass={tab.id === "equities" ? "AKTIER" : "STABILT"}
                      title={tab.id === "equities" ? "Aktier (riskbetonade innehav)" : "Fonder (stabila innehav)"}
                      histories={holdingHistories}
                    />
                  )}
                </div>
              ))}
            </article>
          </section>
          <DriftInterpretationPanel allocation={allocation} />
          <dialog 
            ref={goalAllocationDialog} 
            className="goalAllocationDialog"
            onClick={(event) => {
              const dialog = event.currentTarget;
              const rect = dialog.getBoundingClientRect();
              const outside =
                event.target === dialog &&
                (event.clientX < rect.left ||
                  event.clientX > rect.right ||
                  event.clientY < rect.top ||
                  event.clientY > rect.bottom);

              if (outside) dialog.close();
            }}
          >
            <form method="dialog" className="goalAllocationDialogClose">
              <button type="submit" aria-label="Stäng målallokering">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            <GoalAllocation
              targetAktierPct={allocation.targetAktierPct}
              targetStabiltPct={allocation.targetStabiltPct}
              onTargetSaved={handleTargetSaved}
            />
          </dialog>
          <NoticesEmpty alerts={driftAlerts(allocation)} />
        </div>
        <div className={"rightColumn"}>
          <InfoAside />
        </div>
      </div>
    </>
  );
}

export default Portfolio;
