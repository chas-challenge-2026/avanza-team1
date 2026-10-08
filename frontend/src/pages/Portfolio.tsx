import { useState } from "react";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import { InfoAside } from "../components/Dashboard/InfoAside";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
// import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
// import HoldingsTable from "../components/Dashboard/HoldingsTable";
import "./Portfolio.css";
import type { Alert, Allocation } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";
import { computeDrift } from "../lib/drift";
import { usePortfolio } from "../hooks/usePortfolio";

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
      <PageHeader totalValueSek={portfolio.totalValueSek} fx={portfolio.fx} />
      <div className="dashboardGrid">
        <div className="leftColumn">
          {drift.overThreshold && <WarningBanner message={drift.message} />}
          <AssetAllocation allocation={allocation} />
          {/* TODO: Turn GoalAllocation into a modal */}
          {/* <GoalAllocation
            targetAktierPct={allocation.targetAktierPct}
            targetStabiltPct={allocation.targetStabiltPct}
            onTargetSaved={handleTargetSaved}
          /> */}
          {/* TODO: Move HoldingsTable to separate page */}
          {/* <HoldingsTable holdings={portfolio.holdings} /> */}
          <AccountsTable accounts={portfolio.accounts} allocation={allocation} holdings={portfolio.holdings} />
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
