import { useState } from "react";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
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

  const storedTarget = targetOverride ?? readStoredTarget();

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
      {drift.overThreshold && <WarningBanner message={drift.message} />}
      <div className="dashboard-grid">
        <AssetAllocation allocation={allocation} />
        <GoalAllocation
          targetAktierPct={allocation.targetAktierPct}
          targetStabiltPct={allocation.targetStabiltPct}
          onTargetSaved={handleTargetSaved}
        />
        <AccountsTable accounts={portfolio.accounts} allocation={allocation} />
        <NoticesEmpty alerts={driftAlerts(allocation)} />
        <HoldingsTable holdings={portfolio.holdings} />
      </div>
    </>
  );
}

export default Portfolio;
