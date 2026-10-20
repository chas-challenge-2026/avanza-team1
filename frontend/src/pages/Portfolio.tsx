import { useRef, useState } from "react";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import { InfoAside } from "../components/Dashboard/InfoAside";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import SmallHoldingsTable from "../components/Dashboard/SmallHoldingsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import "./Portfolio.css";
import type { Alert, Allocation } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";
import { computeDrift } from "../lib/drift";
import { usePortfolio } from "../hooks/usePortfolio";
import { useHistory } from "../hooks/useHistory";
import { useHistories } from "../hooks/useHistories";

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
  const holdingHistories = useHistories(
    portfolio?.holdings.map((holding) => holding.ticker) ?? [],
    "1M",
  );
  const goalAllocationDialog = useRef<HTMLDialogElement>(null);

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
  }

  const drift = computeDrift(allocation);

  return (
    <>
      <PageHeader totalValueSek={portfolio.totalValueSek} history={history} />
      <div className="dashboardGrid">
        <div className="leftColumn">
          {drift.overThreshold && <WarningBanner message={drift.message} />}
          <AssetAllocation allocation={allocation} />
          <button className="setAllocationBtn"
            type="button"
            onClick={() => goalAllocationDialog.current?.showModal()}
          >
            Ändra målallokering
          </button>
          <dialog ref={goalAllocationDialog} className="goalAllocationDialog">
            <form method="dialog" className="goalAllocationDialogClose">
              <button type="submit" aria-label="Stäng målallokering">
                Stäng
              </button>
            </form>
            <GoalAllocation
              targetAktierPct={allocation.targetAktierPct}
              targetStabiltPct={allocation.targetStabiltPct}
              onTargetSaved={handleTargetSaved}
            />
          </dialog>
          <div className="smallTables">
            <SmallHoldingsTable
              holdings={portfolio.holdings}
              assetClass="AKTIER"
              title="Riskbetonade innehav"
              histories={holdingHistories}
            />
            <SmallHoldingsTable
              holdings={portfolio.holdings}
              assetClass="STABILT"
              title="Stabila innehav"
              histories={holdingHistories}
            />
          </div>
          <AccountsTable accounts={portfolio.accounts} />
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
